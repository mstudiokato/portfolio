import { NextResponse } from "next/server";
import { Resend } from "resend";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/rate-limit";

// Adresy nie są sekretami — trzymamy w kodzie. Subdomena send zweryfikowana w Resend.
const MAIL_TO = "kontakt@michal-stezaly.pl";
const MAIL_FROM = "Portfolio <noreply@michal-stezaly.pl>";

const GENERIC_ERROR =
  "Coś poszło nie tak. Napisz bezpośrednio na kontakt@michal-stezaly.pl";

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Weryfikacja tokena Turnstile. Brak secret → pomijamy (dev/preview bez kluczy). */
async function verifyTurnstile(
  token: string | undefined,
  ip: string,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      },
    );
    const data = (await res.json()) as { success?: boolean };
    return Boolean(data?.success);
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Nieprawidłowe żądanie." },
      { status: 400 },
    );
  }
  const body = (raw ?? {}) as Record<string, unknown>;

  // Honeypot: ukryte pole "firma" musi być puste. Wypełnione = bot → udajemy sukces.
  if (typeof body.firma === "string" && body.firma.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Rate limiting per IP (3 / 10 min).
  const ip = getClientIp(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      {
        error:
          "Wysłano już kilka wiadomości z tego adresu. Spróbuj ponownie za chwilę.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rl.retryAfterSec ?? 600) },
      },
    );
  }

  // Walidacja pól (zod).
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Sprawdź poprawność pól formularza.",
        fields: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  // Antyspam Turnstile.
  const tokenOk = await verifyTurnstile(
    typeof body.turnstileToken === "string" ? body.turnstileToken : undefined,
    ip,
  );
  if (!tokenOk) {
    return NextResponse.json(
      {
        error:
          "Weryfikacja antyspamowa nie powiodła się. Odśwież stronę i spróbuj ponownie.",
      },
      { status: 400 },
    );
  }

  const { name, email, subject, message } = parsed.data;

  // Resend — wyślij tylko, gdy klucz skonfigurowany; inaczej no-op (dev/preview).
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[kontakt] Brak RESEND_API_KEY — pomijam wysyłkę maila (tryb dev/preview).",
    );
    return NextResponse.json({ ok: true, delivered: false });
  }

  try {
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: subject
        ? `[Portfolio] ${subject}`
        : `[Portfolio] Nowa wiadomość od ${name}`,
      text:
        `Imię i nazwisko: ${name}\n` +
        `E-mail: ${email}\n` +
        `Temat: ${subject || "—"}\n\n` +
        `${message}\n`,
    });
    if (error) {
      console.error("[kontakt] Resend error:", error);
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }
  } catch (e) {
    console.error("[kontakt] Wyjątek wysyłki:", e);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit } from "@/lib/rate-limit";

const MAIL_TO = "kontakt@michal-stezaly.pl";
const MAIL_FROM = "Portfolio <noreply@michal-stezaly.pl>";
const GENERIC_ERROR =
  "Coś poszło nie tak. Spróbuj jeszcze raz lub napisz bezpośrednio na kontakt@michal-stezaly.pl";

function getClientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return (
    req.headers.get("x-nf-client-connection-ip") ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

async function verifyTurnstile(token: string | undefined, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
  if (!token) return false;
  try {
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!data?.success) {
      console.error("[brief] Turnstile failed:", JSON.stringify(data));
    }
    return Boolean(data?.success);
  } catch (e) {
    console.error("[brief] Turnstile exception:", e);
    return false;
  }
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null) ?? "";
}

function arr(fd: FormData, key: string): string[] {
  try {
    const v = fd.get(key) as string | null;
    const parsed = JSON.parse(v ?? "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function or(v: string, fallback = "—"): string {
  return v.trim() || fallback;
}

function urlList(links: string[]): string {
  const valid = links.filter((l) => l.trim());
  if (!valid.length) return "—";
  return valid
    .map((l) => `<a href="${l}" style="color:#D4FF00">${l}</a>`)
    .join("<br>");
}

function list(items: string[]): string {
  if (!items.length) return "—";
  return items.map((i) => `• ${i}`).join("<br>");
}

// ── Email templates ────────────────────────────────────────────────────────────

function buildOwnerHtml(d: {
  name: string; company: string; about: string; targetClient: string;
  goal: string; hasWebsite: string; existingLinks: string[]; scale: string;
  inspirationLinks: string[]; noWant: string; wish: string;
  mood: string; colorsChoice: string; colorsText: string; bgStyle: string;
  sections: string[]; otherSection: string; ready: string[]; language: string; notes: string;
  budget: string; deadline: string; email: string; phone: string; contactPref: string;
  fileCount: number;
}): string {
  const colorsLabel = {
    "has-codes": "Ma konkretne kolory",
    "has-no-codes": "Ma kolory, nie zna kodów",
    "none": "Nie ma — dobierzemy razem",
  }[d.colorsChoice] ?? d.colorsChoice;

  const bgLabel = {
    "light": "Jasna (białe/jasne tło)",
    "dark": "Ciemna (czarne/granatowe tło)",
    "no-pref": "Bez preferencji",
  }[d.bgStyle] ?? d.bgStyle;

  const websiteLabel = {
    "yes": "Tak — chce odświeżyć lub zrobić od nowa",
    "no": "Nie — pierwsza strona",
  }[d.hasWebsite] ?? d.hasWebsite;

  const contactPrefLabel = {
    "email": "Mailowo",
    "phone": "Telefonicznie",
    "any": "Obojętnie",
  }[d.contactPref] ?? (d.contactPref || "—");

  const section = (title: string, content: string) =>
    `<div style="margin-top:24px;padding-top:20px;border-top:1px solid #1f2d44">
      <p style="color:#8b96ab;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 14px">${title}</p>
      ${content}
    </div>`;

  const row = (label: string, value: string) =>
    `<tr>
      <td style="color:#8b96ab;font-size:13px;padding:4px 16px 4px 0;white-space:nowrap;vertical-align:top">${label}</td>
      <td style="color:#f5f7fa;font-size:13px;padding:4px 0;vertical-align:top">${value}</td>
    </tr>`;

  const table = (rows: string) =>
    `<table cellpadding="0" cellspacing="0" style="border-collapse:collapse">${rows}</table>`;

  return `<!DOCTYPE html>
<html lang="pl">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width"><title>Nowy brief</title></head>
<body style="margin:0;padding:0;background:#0b1220;font-family:system-ui,sans-serif;color:#f5f7fa">
<div style="max-width:600px;margin:0 auto;padding:32px 24px">

  <div style="margin-bottom:8px">
    <span style="background:#D4FF00;color:#0b1220;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;padding:4px 10px;border-radius:2px">Nowy brief</span>
  </div>
  <h1 style="font-size:24px;font-weight:700;margin:8px 0 0;color:#f5f7fa">${d.company}</h1>

  ${section("Kontakt", table(
    row("Imię:", d.name) +
    row("Email:", `<a href="mailto:${d.email}" style="color:#D4FF00">${d.email}</a>`) +
    row("Telefon:", or(d.phone)) +
    row("Preferowany kontakt:", contactPrefLabel)
  ))}

  <div style="margin-top:20px;padding:16px;background:#152238;border-radius:8px;border-left:3px solid #D4FF00">
    ${table(
      row("BUDŻET:", `<strong style="color:#D4FF00">${or(d.budget)}</strong>`) +
      row("TERMIN:", `<strong style="color:#D4FF00">${or(d.deadline)}</strong>`)
    )}
  </div>

  ${d.wish.trim() ? `
  <div style="margin-top:20px;padding:16px;background:#0f1a2e;border:1px solid #D4FF00;border-radius:8px">
    <p style="color:#D4FF00;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.15em;margin:0 0 8px">★ Życzenie / pomysł klienta</p>
    <p style="color:#f5f7fa;font-size:14px;margin:0;line-height:1.6">${d.wish.replace(/\n/g, "<br>")}</p>
  </div>` : ""}

  ${section("Krok 1 — Kim jesteś?", table(
    row("Firma:", d.company) +
    row("Czym się zajmuje:", d.about.replace(/\n/g, "<br>")) +
    row("Typowy klient:", or(d.targetClient))
  ))}

  ${section("Krok 2 — Po co Ci strona?", table(
    row("Cel strony:", d.goal.replace(/\n/g, "<br>")) +
    row("Obecna strona:", websiteLabel) +
    row("Obecne linki:", urlList(d.existingLinks)) +
    row("Skala:", or(d.scale))
  ))}

  ${section("Krok 3 — Jak ma wyglądać?", table(
    row("Linki inspiracji:", urlList(d.inspirationLinks)) +
    row("Czego nie chce:", or(d.noWant)) +
    row("Pomysł klienta:", or(d.wish)) +
    row("Zdjęcia inspiracji:", d.fileCount > 0 ? `${d.fileCount} plik${d.fileCount === 1 ? "" : d.fileCount <= 4 ? "i" : "ów"} w załączniku` : "—")
  ))}

  ${section("Krok 4 — Kolory i klimat", table(
    row("Klimat marki:", d.mood) +
    row("Kolory:", colorsLabel + (d.colorsText.trim() ? ` — ${d.colorsText}` : "")) +
    row("Styl tła:", bgLabel)
  ))}

  ${section("Krok 5 — Co ma być na stronie?", table(
    row("Sekcje:", list(d.sections) + (d.otherSection.trim() ? `<br><em style="color:#8b96ab">Inne: ${d.otherSection}</em>` : "")) +
    row("Co już ma:", list(d.ready)) +
    row("Język:", or(d.language)) +
    row("Uwagi:", or(d.notes))
  ))}

  <div style="margin-top:32px;padding-top:16px;border-top:1px solid #1f2d44">
    <p style="color:#8b96ab;font-size:11px;margin:0">Portfolio — brief projektowy</p>
  </div>
</div>
</body>
</html>`;
}

function buildClientText(name: string, firstName: string): string {
  return `Cześć, ${firstName}!

Twój brief dotarł do nas bezpiecznie. Przejrzymy go dokładnie i odezwiemy się w ciągu 48 godzin.

Jeśli chcesz coś doprecyzować lub masz pytania — napisz na ${MAIL_TO}.

Do zobaczenia!

—
Portfolio — projekt graficzny
${MAIL_TO}
668 01 02 62
`;
}

// ── Handler ────────────────────────────────────────────────────────────────────

export async function POST(req: Request) {
  let fd: FormData;
  try {
    fd = await req.formData();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe żądanie." }, { status: 400 });
  }

  // Honeypot
  if (str(fd, "website").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Rate limiting
  const ip = getClientIp(req);
  const rl = rateLimit(ip);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Wysłano już kilka briefów z tego adresu. Spróbuj za chwilę." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 600) } },
    );
  }

  // Walidacja podstawowych pól
  const name = str(fd, "name").trim();
  const email = str(fd, "email").trim();
  const company = str(fd, "company").trim();
  if (!name || !email || !company) {
    return NextResponse.json({ error: "Brakuje wymaganych pól." }, { status: 400 });
  }
  if (!/\S+@\S+\.\S+/.test(email)) {
    return NextResponse.json({ error: "Nieprawidłowy adres e-mail." }, { status: 400 });
  }

  // Turnstile
  const tokenOk = await verifyTurnstile(str(fd, "turnstileToken") || undefined, ip);
  if (!tokenOk) {
    return NextResponse.json(
      { error: "Weryfikacja antyspamowa nie powiodła się. Odśwież stronę i spróbuj ponownie." },
      { status: 400 },
    );
  }

  // Zbierz pliki
  const attachments: { filename: string; content: Buffer }[] = [];
  for (let i = 0; i < MAX_FILES; i++) {
    const f = fd.get(`file_${i}`);
    if (!f || typeof f === "string") break;
    try {
      const buf = Buffer.from(await (f as File).arrayBuffer());
      attachments.push({ filename: `inspiracja_${i + 1}.jpg`, content: buf });
    } catch {
      // pomijamy uszkodzony plik
    }
  }

  const d = {
    name,
    company,
    about: str(fd, "about"),
    targetClient: str(fd, "targetClient"),
    goal: str(fd, "goal"),
    hasWebsite: str(fd, "hasWebsite"),
    existingLinks: arr(fd, "existingLinks"),
    scale: str(fd, "scale"),
    inspirationLinks: arr(fd, "inspirationLinks"),
    noWant: str(fd, "noWant"),
    wish: str(fd, "wish"),
    mood: str(fd, "mood"),
    colorsChoice: str(fd, "colorsChoice"),
    colorsText: str(fd, "colorsText"),
    bgStyle: str(fd, "bgStyle"),
    sections: arr(fd, "sections"),
    otherSection: str(fd, "otherSection"),
    ready: arr(fd, "ready"),
    language: str(fd, "language"),
    notes: str(fd, "notes"),
    budget: str(fd, "budget"),
    deadline: str(fd, "deadline"),
    email,
    phone: str(fd, "phone"),
    contactPref: str(fd, "contactPref"),
    fileCount: attachments.length,
  };

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[brief] Brak RESEND_API_KEY na produkcji.");
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 500 });
    }
    console.warn("[brief] Brak RESEND_API_KEY — pomijam wysyłkę (dev).");
    return NextResponse.json({ ok: true, delivered: false });
  }

  const resend = new Resend(apiKey);
  const firstName = name.split(" ")[0];

  try {
    // 1. Mail do właściciela
    console.log("[brief] Sending owner email", { company, email, attachments: attachments.length });
    const { error: ownerErr } = await resend.emails.send({
      from: MAIL_FROM,
      to: MAIL_TO,
      replyTo: email,
      subject: `Nowy brief — ${company}`,
      html: buildOwnerHtml(d),
      text: buildClientText(name, firstName),
      ...(attachments.length > 0 ? { attachments } : {}),
    });
    if (ownerErr) {
      console.error("[brief] Resend (owner):", ownerErr);
      return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
    }

    // 2. Auto-mail do klienta
    const { error: clientErr } = await resend.emails.send({
      from: MAIL_FROM,
      to: email,
      subject: "Dostaliśmy Twój brief — odezwiemy się wkrótce",
      text: buildClientText(name, firstName),
    });
    if (clientErr) {
      // Auto-mail jest nice-to-have — nie zwracamy błędu użytkownikowi
      console.warn("[brief] Resend (client auto-mail):", clientErr);
    }
  } catch (e) {
    console.error("[brief] Wyjątek wysyłki:", e);
    return NextResponse.json({ error: GENERIC_ERROR }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered: true });
}

const MAX_FILES = 10;

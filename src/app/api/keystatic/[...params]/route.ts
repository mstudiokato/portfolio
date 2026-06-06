import { makeRouteHandler } from "@keystatic/next/route-handler";

// Nic nie inicjalizujemy w module scope — `keystatic.config` i makeRouteHandler
// budujemy DOPIERO w obrębie żądania (dynamiczny import w buildHandler), żeby
// ewentualny błąd inicjalizacji nie zabijał całego modułu (Vercel pokazywał to
// jako 404). force-dynamic: trasa zawsze serwerowa, bez cache.
export const dynamic = "force-dynamic";

/**
 * Czyta zmienną środowiskową i przycina białe znaki. Wklejenie sekretu do
 * Vercela z końcowym znakiem nowej linii/spacją to najczęstsza przyczyna
 * „incorrect_client_credentials" → 401 „Authorization failed" z Keystatic.
 * Logujemy DŁUGOŚĆ (nie wartość), a przy wykryciu whitespace sygnalizujemy to.
 */
function env(name: string): string | undefined {
  const raw = process.env[name];
  if (raw === undefined) return undefined;
  const trimmed = raw.trim();
  if (trimmed.length !== raw.length) {
    console.error(
      `[keystatic-debug] ${name} zawierał białe znaki — przycięte (${raw.length} → ${trimmed.length})`,
    );
  }
  return trimmed;
}

// TODO(debug): TYMCZASOWE logowanie diagnostyczne. Usunąć po potwierdzeniu, że
// logowanie działa. Wypisuje TYLKO obecność i długość zmiennych (nie wartości!)
// + ścieżkę żądania + status/treść odpowiedzi handlera.
function logEnvDiagnostics(method: string, req: Request): void {
  let pathname = "(unparsable)";
  try {
    pathname = new URL(req.url).pathname;
  } catch {
    /* ignore */
  }
  const len = (n: string) => process.env[n]?.length ?? 0;
  console.error("[keystatic-debug] ===== request:", method, pathname, "=====");
  console.error("[keystatic-debug] NODE_ENV:", process.env.NODE_ENV);
  console.error(
    "[keystatic-debug] KEYSTATIC_GITHUB_CLIENT_ID exists:",
    Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID),
    "| length:",
    len("KEYSTATIC_GITHUB_CLIENT_ID"),
  );
  console.error(
    "[keystatic-debug] KEYSTATIC_GITHUB_CLIENT_SECRET exists:",
    Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_SECRET),
    "| length:",
    len("KEYSTATIC_GITHUB_CLIENT_SECRET"),
  );
  console.error(
    "[keystatic-debug] KEYSTATIC_SECRET exists:",
    Boolean(process.env.KEYSTATIC_SECRET),
    "| length:",
    len("KEYSTATIC_SECRET"),
  );
  console.error(
    "[keystatic-debug] NEXT_PUBLIC_URL:",
    process.env.NEXT_PUBLIC_URL ?? "(unset)",
  );
}

/**
 * Leniwa budowa handlera DOPIERO przy żądaniu. Zmienne GitHub OAuth przekazujemy
 * JAWNIE (przycięte), zamiast polegać na domyślnym odczycie process.env wewnątrz
 * Keystatic — pewność, że trafiają dokładnie te same, przycięte wartości.
 */
async function buildHandler() {
  const { default: config } = await import("../../../../../keystatic.config");
  return makeRouteHandler({
    config,
    clientId: env("KEYSTATIC_GITHUB_CLIENT_ID"),
    clientSecret: env("KEYSTATIC_GITHUB_CLIENT_SECRET"),
    secret: env("KEYSTATIC_SECRET"),
  });
}

async function run(method: "GET" | "POST", req: Request): Promise<Response> {
  logEnvDiagnostics(method, req);
  try {
    const handler = await buildHandler();
    const res =
      method === "GET" ? await handler.GET(req) : await handler.POST(req);
    if (res.status >= 400) {
      // Treść błędu Keystatic to komunikat (np. „Authorization failed"), nie sekret.
      console.error(
        `[keystatic-debug] ${method} response:`,
        res.status,
        await res.clone().text(),
      );
    } else {
      console.error(`[keystatic-debug] ${method} response status:`, res.status);
    }
    return res;
  } catch (err) {
    console.error(`[keystatic-debug] ${method} handler threw:`, err);
    throw err;
  }
}

export async function GET(req: Request): Promise<Response> {
  return run("GET", req);
}

export async function POST(req: Request): Promise<Response> {
  return run("POST", req);
}

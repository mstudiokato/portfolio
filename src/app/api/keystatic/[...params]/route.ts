import { makeRouteHandler } from "@keystatic/next/route-handler";

// WAŻNE: nic nie inicjalizujemy w module scope. `keystatic.config` (budujący
// pełną konfigurację przez @keystatic/core) ORAZ makeRouteHandler są wczytywane
// DOPIERO w obrębie żądania (dynamiczny import + wywołanie w GET/POST). Gdyby
// import configu rzucił przy cold-starcie, padłby cały moduł route'a — a Vercel
// pokazywał to jako 404 dla tej trasy (przy /api/kontakt, który ładuje się bez
// problemu, dostawaliśmy 405). Teraz ewentualny błąd inicjalizacji trafia do
// try/catch jako czytelny 500 z logiem, zamiast znikać jako 404.
export const dynamic = "force-dynamic";

/**
 * Tryb github (produkcja) wymaga TRZECH zmiennych środowiskowych. Bez nich
 * @keystatic/core rzuca surowy wyjątek → nieczytelny 500. Zamiast tego sami
 * sprawdzamy env i zwracamy jasny komunikat, co dokładnie ustawić na Vercel.
 * KEYSTATIC_SECRET musi mieć min. 32 znaki (Keystatic używa go do HKDF sesji).
 */
const REQUIRED_GITHUB_ENV = [
  "KEYSTATIC_GITHUB_CLIENT_ID",
  "KEYSTATIC_GITHUB_CLIENT_SECRET",
  "KEYSTATIC_SECRET",
] as const;

function envProblems(): string[] {
  // Dev używa storage "local" (bez logowania) — klucze github nie są potrzebne.
  if (process.env.NODE_ENV === "development") return [];

  const problems = REQUIRED_GITHUB_ENV.filter((k) => !process.env[k]).map(
    (k) => `Brak zmiennej: ${k}`,
  );

  const secret = process.env.KEYSTATIC_SECRET;
  if (secret && secret.length < 32) {
    problems.push("KEYSTATIC_SECRET musi mieć min. 32 znaki (losowy hex)");
  }
  return problems;
}

function envErrorResponse(problems: string[]): Response {
  const body =
    "Keystatic (tryb github) nie jest poprawnie skonfigurowany na Vercel:\n\n" +
    problems.map((p) => `- ${p}`).join("\n") +
    "\n\nDodaj brakujące zmienne w Vercel → Project → Settings → Environment " +
    "Variables (dla środowiska Production), następnie zrób redeploy.\n" +
    "KEYSTATIC_SECRET wygeneruj np.: openssl rand -hex 32";
  return new Response(body, {
    status: 500,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

// TODO(debug): TYMCZASOWE logowanie diagnostyczne. Usunąć po rozwiązaniu.
// Wypisuje TYLKO obecność zmiennych (boolean) + długość sekretu (nie wartości!)
// oraz ścieżkę żądania — w logach Vercel widać, czy request dociera do funkcji.
function logEnvDiagnostics(method: string, req: Request): void {
  let pathname = "(unparsable)";
  try {
    pathname = new URL(req.url).pathname;
  } catch {
    /* ignore */
  }
  console.error("[keystatic-debug] ===== request:", method, pathname, "=====");
  console.error("[keystatic-debug] NODE_ENV:", process.env.NODE_ENV);
  console.error(
    "[keystatic-debug] KEYSTATIC_SECRET exists:",
    Boolean(process.env.KEYSTATIC_SECRET),
    "| length:",
    process.env.KEYSTATIC_SECRET?.length ?? 0,
  );
  console.error(
    "[keystatic-debug] KEYSTATIC_GITHUB_CLIENT_ID exists:",
    Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_ID),
  );
  console.error(
    "[keystatic-debug] KEYSTATIC_GITHUB_CLIENT_SECRET exists:",
    Boolean(process.env.KEYSTATIC_GITHUB_CLIENT_SECRET),
  );
  console.error(
    "[keystatic-debug] NEXT_PUBLIC_URL:",
    process.env.NEXT_PUBLIC_URL ?? "(unset)",
  );
}

/** Leniwa budowa handlera: dynamiczny import configu + makeRouteHandler DOPIERO
 *  przy żądaniu (poza module scope). Wspólne dla GET i POST. */
async function buildHandler() {
  const { default: config } = await import("../../../../../keystatic.config");
  return makeRouteHandler({ config });
}

export async function GET(req: Request): Promise<Response> {
  logEnvDiagnostics("GET", req);
  const problems = envProblems();
  if (problems.length) {
    console.error("[keystatic-debug] envProblems:", problems);
    return envErrorResponse(problems);
  }
  try {
    const handler = await buildHandler();
    return await handler.GET(req);
  } catch (err) {
    console.error("[keystatic-debug] GET handler threw:", err);
    throw err;
  }
}

export async function POST(req: Request): Promise<Response> {
  logEnvDiagnostics("POST", req);
  const problems = envProblems();
  if (problems.length) {
    console.error("[keystatic-debug] envProblems:", problems);
    return envErrorResponse(problems);
  }
  try {
    const handler = await buildHandler();
    return await handler.POST(req);
  } catch (err) {
    console.error("[keystatic-debug] POST handler threw:", err);
    throw err;
  }
}

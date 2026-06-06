import { makeRouteHandler } from "@keystatic/next/route-handler";
import config from "../../../../../keystatic.config";

// Handler tworzony leniwie (przy żądaniu), nie przy ładowaniu modułu — inaczej
// w trybie github build/deploy padałby bez kluczy GitHub (KEYSTATIC_*). Dzięki
// temu build nigdy nie zależy od tych kluczy; panel działa po ich ustawieniu.
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

// TODO(debug): TYMCZASOWE logowanie diagnostyczne 500 na Vercel. Usunąć po
// rozwiązaniu. Wypisuje TYLKO obecność zmiennych (boolean) + długość sekretu
// (nie wartości!) oraz pełny stack trace błędu z handlera Keystatic.
function logEnvDiagnostics(method: string, req: Request): void {
  // Loguj ścieżkę żądania → w logach Vercel widać, czy /github/login i
  // /github/oauth/callback w ogóle docierają do funkcji (czy nie gubią się
  // wcześniej na routingu/middleware/rewrite).
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

export async function GET(req: Request): Promise<Response> {
  logEnvDiagnostics("GET", req);
  const problems = envProblems();
  if (problems.length) {
    console.error("[keystatic-debug] envProblems:", problems);
    return envErrorResponse(problems);
  }
  try {
    return await makeRouteHandler({ config }).GET(req);
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
    return await makeRouteHandler({ config }).POST(req);
  } catch (err) {
    console.error("[keystatic-debug] POST handler threw:", err);
    throw err;
  }
}

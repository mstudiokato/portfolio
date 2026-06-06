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

export async function GET(req: Request): Promise<Response> {
  const problems = envProblems();
  if (problems.length) return envErrorResponse(problems);
  return makeRouteHandler({ config }).GET(req);
}

export async function POST(req: Request): Promise<Response> {
  const problems = envProblems();
  if (problems.length) return envErrorResponse(problems);
  return makeRouteHandler({ config }).POST(req);
}

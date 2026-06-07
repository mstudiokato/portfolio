import { makeRouteHandler } from "@keystatic/next/route-handler";

// Handler budujemy DOPIERO w obrębie żądania (dynamiczny import w buildHandler),
// żeby ewentualny błąd inicjalizacji nie zabijał całego modułu (Vercel pokazywał
// to jako 404). force-dynamic: trasa zawsze serwerowa, bez cache.
export const dynamic = "force-dynamic";

/**
 * Czyta zmienną środowiskową i przycina białe znaki. Wklejenie sekretu do
 * Vercela z końcowym znakiem nowej linii/spacją to najczęstsza przyczyna
 * „incorrect_client_credentials" → 401 „Authorization failed" z Keystatic.
 */
function env(name: string): string | undefined {
  return process.env[name]?.trim();
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

export async function GET(req: Request): Promise<Response> {
  const handler = await buildHandler();
  return handler.GET(req);
}

export async function POST(req: Request): Promise<Response> {
  const handler = await buildHandler();
  return handler.POST(req);
}

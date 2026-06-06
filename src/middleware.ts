import { NextRequest, NextResponse } from "next/server";

/**
 * Kanonizacja hosta dla panelu Keystatic.
 *
 * Keystatic (github mode) buduje OAuth `redirect_uri` z origin/hosta requestu,
 * a NIE z konfiguracji — w tej wersji nie ma opcji baseURL/storage.url. Na
 * deploy-preview z hashem w subdomenie (np. portfolio-abc123.vercel.app)
 * powoduje to redirect_uri z hashem zamiast głównej domeny → redirect_uri_mismatch.
 *
 * Rozwiązanie: jeśli panel/API Keystatic otwarto pod innym hostem niż kanoniczny
 * (NEXT_PUBLIC_URL), przekierowujemy na host kanoniczny — wtedy window.location
 * .origin i host żądań są stabilne, a OAuth zgadza się z Callback URL w GitHub App.
 * Domyślny kanoniczny host = michal-stezaly.vercel.app (panel produkcyjny).
 *
 * Zakres: TYLKO /keystatic i /api/keystatic. Publiczna strona (i jej deploy
 * preview) działa bez zmian.
 */

const CANONICAL_URL =
  process.env.NEXT_PUBLIC_URL || "https://michal-stezaly.vercel.app";

export function middleware(req: NextRequest) {
  const canonical = new URL(CANONICAL_URL);
  const host = req.headers.get("host") ?? "";

  // Nie ruszaj dev (localhost) — inaczej panel dev przekierowywałby na produkcję.
  const isLocalHost =
    host.startsWith("localhost") ||
    host.startsWith("127.0.0.1") ||
    host.startsWith("[::1]");

  if (host && host !== canonical.host && !isLocalHost) {
    const url = req.nextUrl.clone();
    url.protocol = canonical.protocol;
    url.host = canonical.host;
    url.port = canonical.port;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/keystatic/:path*", "/api/keystatic/:path*"],
};

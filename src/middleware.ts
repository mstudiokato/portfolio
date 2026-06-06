import { NextRequest, NextResponse } from "next/server";

/**
 * Kanonizacja hosta dla UI panelu Keystatic (strona /keystatic).
 *
 * Cel: gdy panel otwarto pod innym hostem niż kanoniczny (np. deploy-preview
 * portfolio-abc123.vercel.app), przekierowujemy na host kanoniczny, żeby
 * window.location.origin był stabilny. Domyślny host = michal-stezaly.vercel.app.
 *
 * WAŻNE — zakres NIE obejmuje /api/keystatic (matcher poniżej). Endpoints OAuth
 * (/api/keystatic/github/login i /github/oauth/callback) MUSZĄ być serwowane
 * bezpośrednio na hoście zarejestrowanym w GitHub OAuth App. Przepuszczanie ich
 * przez 308 redirect na inny host psuło logowanie (404 / redirect_uri_mismatch
 * / utrata jednorazowego `code` i cookie `ks-<state>`). Dlatego API zostaje
 * nietknięte — login działa na tym samym origin, który zna GitHub.
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
  // Tylko UI panelu. /api/keystatic celowo POMINIĘTE — patrz komentarz wyżej.
  matcher: ["/keystatic/:path*"],
};

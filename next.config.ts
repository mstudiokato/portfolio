import type { NextConfig } from "next";

// Nagłówki bezpieczeństwa (N2/S1). Wcześniej tylko w netlify.toml — Vercel tego
// pliku nie czyta, więc trzymamy je tu, by działały na żywej stronie. CSP
// przepuszcza: własną domenę, Cloudflare Turnstile (challenges.cloudflare.com),
// Cloudflare Analytics (static.cloudflareinsights.com → beacon na
// cloudflareinsights.com) oraz 'unsafe-inline' dla stylów (Tailwind) i skryptów
// (hydracja Next.js). Lista skopiowana 1:1 z netlify.toml — nie zaostrzać.
const CSP =
  "default-src 'self'; script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://static.cloudflareinsights.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com; frame-src https://challenges.cloudflare.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "Content-Security-Policy", value: CSP },
];

// Panel Keystatic ma własny runtime, który CSP blokuje (inline scripts/styles,
// connect do GitHub OAuth itd.). Dajemy mu podstawowe nagłówki bezpieczeństwa,
// ale BEZ Content-Security-Policy, żeby panel ładował się normalnie.
const KEYSTATIC_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      // CSP + pełne nagłówki dla wszystkich tras POZA /keystatic.
      { source: "/((?!keystatic).*)", headers: SECURITY_HEADERS },
      // /keystatic — tylko podstawowe nagłówki, bez CSP.
      { source: "/keystatic/:path*", headers: KEYSTATIC_HEADERS },
    ];
  },
  async redirects() {
    return [
      // Strony główne
      { source: "/home", destination: "/", permanent: true },
      { source: "/omnie", destination: "/", permanent: true },
      { source: "/portfolio", destination: "/projekty", permanent: true },
      { source: "/kontakt", destination: "/#kontakt", permanent: true },
      // Kategorie → filtry
      { source: "/plakaty", destination: "/projekty?kategoria=plakaty", permanent: true },
      { source: "/socialmedia", destination: "/projekty?kategoria=social-media", permanent: true },
      { source: "/logo", destination: "/projekty?kategoria=logo", permanent: true },
      { source: "/branding", destination: "/projekty?kategoria=branding", permanent: true },
      { source: "/inne", destination: "/projekty?kategoria=inne-projekty", permanent: true },
      // Catch-all — cokolwiek innego ze starego Adobe Portfolio.
      // Negative lookahead wyklucza istniejące trasy Next.js oraz statyczne pliki
      // (ścieżki z kropką, np. /favicon.ico, /zdjecie.jpg), żeby nie przechwycić
      // realnego routingu ani zasobów z /public.
      {
        source:
          "/:path((?!api/|_next/|projekty$|projekty/|projekty\\?|polityka-prywatnosci|design-system|keystatic|admin|brief$|brief/|galerie/|klienci/|opinie/|ikonySpec/)(?!.*\\.).+)",
        destination: "/projekty",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

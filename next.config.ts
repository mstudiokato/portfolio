import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
          "/:path((?!api/|_next/|projekty$|projekty/|projekty\\?|polityka-prywatnosci|design-system|keystatic|admin|galerie/|klienci/|opinie/|ikonySpec/)(?!.*\\.).+)",
        destination: "/projekty",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;

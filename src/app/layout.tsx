import type { Metadata } from "next";
import Script from "next/script";
import { clashDisplay, switzer } from "@/lib/fonts";
import { CookieBanner } from "@/components/cookie-banner";
import { SEO_DEFAULT } from "@/lib/site-content";
import "./globals.css";

const SITE_NAME = "Michał Stężały — Senior Graphic Designer";

// Cloudflare Web Analytics — token publiczny z env (NEXT_PUBLIC_CF_BEACON_TOKEN).
// Właściciel wkleja prawdziwy token w panelu Vercel; skrypt renderuje się tylko
// gdy token jest ustawiony (NEXT_PUBLIC_* jest inline'owany w czasie buildu).
const CF_BEACON_TOKEN = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

// JSON-LD schema.org — Person (autor) + ProfessionalService. URL produkcyjny.
const SITE_URL = "https://michal-stezaly.pl";
// Potwierdzony profil LinkedIn. (Behance usunięty — niepotwierdzony przez właściciela.)
const SAME_AS = ["https://www.linkedin.com/in/michal-stezaly/"];
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Michał Stężały",
      jobTitle: "Senior Graphic Designer",
      description:
        "Projektant graficzny dla sportu i biznesu. 14 lat doświadczenia — branding, social media, identyfikacja wizualna dla klubów, federacji i marek B2B.",
      url: SITE_URL,
      email: "kontakt@michal-stezaly.pl",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Katowice",
        addressCountry: "PL",
      },
      sameAs: SAME_AS,
    },
    {
      "@type": "ProfessionalService",
      name: "Michał Stężały — Senior Graphic Designer",
      description: "Visual communication design for sport, events and business",
      url: SITE_URL,
      email: "kontakt@michal-stezaly.pl",
      telephone: "+48668010262",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Katowice",
        addressRegion: "Śląsk",
        addressCountry: "PL",
      },
      knowsAbout: [
        "sport branding",
        "event design",
        "social media",
        "graphic design",
        "visual identity",
      ],
      sameAs: SAME_AS,
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL("https://michal-stezaly.pl"),
  title: {
    default: SEO_DEFAULT.defaultTitle,
    template: "%s — Michał Stężały",
  },
  description: SEO_DEFAULT.defaultDescription,
  applicationName: SITE_NAME,
  authors: [{ name: "Michał Stężały" }],
  // Favicon (monogram MS) — pliki w /public, generowane z favicon.svg (sharp).
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/site.webmanifest",
  // Strona w budowie na subdomenie *.netlify.app — nie indeksujemy do launchu (masterprompt sek. 12, Etap 10).
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${clashDisplay.variable} ${switzer.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
        />
        {children}
        <CookieBanner />
        {CF_BEACON_TOKEN ? (
          <Script
            src="https://static.cloudflareinsights.com/beacon.min.js"
            strategy="afterInteractive"
            data-cf-beacon={JSON.stringify({ token: CF_BEACON_TOKEN })}
          />
        ) : null}
      </body>
    </html>
  );
}

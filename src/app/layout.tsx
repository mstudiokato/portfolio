import type { Metadata } from "next";
import { clashDisplay, switzer } from "@/lib/fonts";
import { CookieBanner } from "@/components/cookie-banner";
import { SEO_DEFAULT } from "@/lib/site-content";
import "./globals.css";

const SITE_NAME = "Michał Stężały — Senior Graphic Designer";

// JSON-LD schema.org (S2) — Person + ProfessionalService. URL podglądu (netlify).
const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      name: "Michał Stężały",
      jobTitle: "Senior Graphic Designer",
      description: "Visual communication design for sport, events and business",
      url: "https://michal-stezaly.netlify.app",
      email: "kontakt@michal-stezaly.pl",
      telephone: "+48668010262",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Katowice",
        addressRegion: "Śląsk",
        addressCountry: "Polska",
      },
      knowsAbout: [
        "sport branding",
        "event design",
        "social media",
        "graphic design",
        "visual identity",
      ],
      sameAs: [],
    },
    {
      "@type": "ProfessionalService",
      name: "Michał Stężały — Senior Graphic Designer",
      description: "Visual communication design for sport, events and business",
      url: "https://michal-stezaly.netlify.app",
      email: "kontakt@michal-stezaly.pl",
      telephone: "+48668010262",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Katowice",
        addressRegion: "Śląsk",
        addressCountry: "Polska",
      },
      knowsAbout: [
        "sport branding",
        "event design",
        "social media",
        "graphic design",
        "visual identity",
      ],
      sameAs: [],
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
      </body>
    </html>
  );
}

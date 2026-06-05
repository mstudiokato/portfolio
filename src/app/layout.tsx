import type { Metadata } from "next";
import { clashDisplay, switzer } from "@/lib/fonts";
import { CookieBanner } from "@/components/cookie-banner";
import { SEO_DEFAULT } from "@/lib/site-content";
import "./globals.css";

const SITE_NAME = "Michał Stężały — Senior Graphic Designer";

export const metadata: Metadata = {
  metadataBase: new URL("https://michal-stezaly.pl"),
  title: {
    default: SEO_DEFAULT.defaultTitle,
    template: "%s — Michał Stężały",
  },
  description: SEO_DEFAULT.defaultDescription,
  applicationName: SITE_NAME,
  authors: [{ name: "Michał Stężały" }],
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
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { clashDisplay, switzer } from "@/lib/fonts";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

const SITE_NAME = "Michał Stężały — Senior Graphic Designer";

export const metadata: Metadata = {
  metadataBase: new URL("https://michal-stezaly.pl"),
  title: {
    default: "Michał Stężały — Senior Graphic Designer for Sport & Business",
    template: "%s — Michał Stężały",
  },
  description:
    "Projektuję komunikację wizualną dla klubów, federacji, eventów i marek B2B — 14 lat doświadczenia połączone z nowoczesnym AI-augmented workflow.",
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

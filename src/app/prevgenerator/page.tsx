import type { Metadata } from "next";
import { GeneratorForm } from "@/components/prevgenerator/GeneratorForm";

// Narzędzie prywatne właściciela — generator masterpromptu do wizualizacji
// stron klientów. Nieindeksowane, poza nawigacją i sitemap. Cała logika
// client-side (zero API). Catch-all redirect w next.config.ts przepuszcza
// /prevgenerator (negative lookahead).
export const metadata: Metadata = {
  title: "Preview Generator",
  robots: { index: false, follow: false },
};

export default function PrevGeneratorPage() {
  return (
    <main className="min-h-screen bg-navy">
      <GeneratorForm />
    </main>
  );
}

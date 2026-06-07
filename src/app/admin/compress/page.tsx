import type { Metadata } from "next";
import { CompressTool } from "@/components/admin/compress-tool";

/**
 * Narzędzie kompresji obrazów (/admin/compress). Konwertuje zdjęcia do WebP
 * przez /api/admin/compress-image (sharp) PRZED wgraniem ich w panelu Keystatic.
 * Keystatic 0.5 nie kompresuje uploadów natywnie, więc to ręczny krok pośredni:
 * przeciągnij plik → pobierz lekki .webp → wgraj w Case Studies / Pozostałe
 * projekty. Strona wewnętrzna, nieindeksowana.
 */
export const metadata: Metadata = {
  title: "Kompresja obrazów",
  robots: { index: false, follow: false },
};

export default function CompressPage() {
  return <CompressTool />;
}

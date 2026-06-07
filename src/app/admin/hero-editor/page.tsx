import type { Metadata } from "next";
import fs from "node:fs";
import path from "node:path";
import { HERO } from "@/lib/site-content";
import { yearsOfExperience } from "@/lib/experience";
import { HeroEditor } from "@/components/admin/hero-editor";

/**
 * Wizualny edytor hero (/admin/hero-editor). Zastępuje dawne dev-narzędzie
 * kadrowania. Pokazuje podgląd 1:1 (proporcje hero, gradient, tekst na wierzchu)
 * i pozwala ustawić zdjęcie oraz kadr (X/Y/zoom).
 *
 * - DEV: zapis jednym klikiem do site.json (+ upload zdjęcia do /public).
 * - PROD: podgląd na żywo; finalne wartości przepisuje się do panelu Keystatic
 *   (Ustawienia strony → Hero), bo na hoście serverless nie zapisujemy do repo.
 *
 * Strona nieindeksowana (noindex) — narzędzie wewnętrzne.
 */
export const metadata: Metadata = {
  title: "Hero editor",
  robots: { index: false, follow: false },
};

function resolveInitialImage(): string | null {
  const configured =
    HERO.image && HERO.image.trim() !== "" ? HERO.image : "/zdjecie.jpg";
  const exists = fs.existsSync(
    path.join(process.cwd(), "public", configured.replace(/^\//, "")),
  );
  return exists ? configured : null;
}

export default function HeroEditorPage() {
  return (
    <HeroEditor
      isDev={process.env.NODE_ENV === "development"}
      initialImage={resolveInitialImage()}
      initialX={HERO.positionX ?? 50}
      initialY={HERO.positionY ?? 50}
      initialScale={HERO.scale ?? 100}
      eyebrow={HERO.eyebrow}
      subline={HERO.subline.replace("{lata}", String(yearsOfExperience()))}
    />
  );
}

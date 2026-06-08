import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/typography";
import { yearsOfExperience } from "@/lib/experience";
import { HERO } from "@/lib/site-content";
import { HERO_OVERLAY, heroTransform } from "@/lib/hero-style";
import { replaceWidows } from "@/lib/text";

/**
 * HERO (masterprompt sek. 8.1). Zdjęcie projektanta jako pełne tło sekcji
 * (next/image fill, object-cover, center top, za treścią). Gradient overlay
 * (ciemny po lewej → prześwit po prawej) trzyma teksty czytelne. Treść po lewej,
 * wysoko pod navbarem (minimalny padding-top). Min-height ≈ 100vh, by zdjęcie
 * miało przestrzeń. Zdjęcie: /public/zdjecie.jpg (fallback gdy brak pliku).
 */

// Zdjęcie hero z Keystatic (PANEL 3) z fallbackiem na /public/zdjecie.jpg.
// Sprawdzenie istnienia pliku w czasie buildu (Hero to server component).
function resolveHeroImage(): string | null {
  const configured =
    HERO.image && HERO.image.trim() !== "" ? HERO.image : "/zdjecie.jpg";
  const exists = fs.existsSync(
    path.join(process.cwd(), "public", configured.replace(/^\//, "")),
  );
  return exists ? configured : null;
}
const heroImage = resolveHeroImage();

export function Hero() {
  const years = yearsOfExperience();

  // Kadrowanie z Keystatic (PANEL 3): pozycja X/Y (0–100%) i zoom (100–200%).
  const posX = HERO.positionX ?? 50;
  const posY = HERO.positionY ?? 50;
  const scale = HERO.scale ?? 100;

  return (
    <section className="bg-navy relative isolate flex min-h-[510px] items-start overflow-hidden lg:min-h-[75vh] lg:items-center">
      {/* Tło — zdjęcie (za treścią). Kadr przez transform translate()+scale():
          zoom daje nadmiar w obu osiach, translate przesuwa X i Y. 50% = środek. */}
      {heroImage ? (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div
            id="hero-photo-scale"
            className="relative h-full w-full"
            style={{ transform: heroTransform(posX, posY, scale) }}
          >
            <Image
              id="hero-photo"
              src={heroImage}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        </div>
      ) : null}

      {/* Overlay gradientowy nad zdjęciem, pod treścią (FIX 2: z-index 1). */}
      <div
        className="absolute inset-0 z-[1]"
        style={{ background: HERO_OVERLAY }}
        aria-hidden="true"
      />

      {/* Mobile-only: dodatkowe ciemne overlay dla czytelności tekstu (desktop bez). */}
      <div
        className="absolute inset-0 z-[1] lg:hidden"
        style={{ backgroundColor: "rgba(11,18,32,0.45)" }}
        aria-hidden="true"
      />

      {/* Blok tekstowy: pełna szerokość z paddingiem px-6 / md:px-12 / lg:px-16 —
          DOKŁADNIE takim samym jak kontener sekcji „Fakty i liczby"
          (stats-and-clients.tsx), więc lewa krawędź tekstu pokrywa się z lewą
          krawędzią liczb poniżej. Zdjęcie full-bleed (absolute) bez zmian. */}
      <div className="relative z-[2] w-full px-6 pt-8 pb-16 md:px-12 lg:px-16 lg:py-[50px]">
        <div className="max-w-2xl lg:ml-[39px]">
          <Label>{HERO.eyebrow}</Label>

          <h1 className="font-display text-ink mt-[18px] text-[clamp(2.415rem,9.66vw,6.0375rem)] leading-[0.92] font-semibold tracking-[-0.03em] uppercase">
            Michał
            <br />
            Stężały
          </h1>

          <p className="font-display text-ink mt-[18px] text-[clamp(1.2075rem,1.00625rem_+_0.966vw,1.61rem)] leading-[1.15] font-semibold tracking-[-0.01em]">
            Senior Graphic Designer
            <br />
            <span className="text-lime">for Sport &amp; Business</span>
          </p>

          <p className="text-[0.906rem] text-ink/85 mt-[18px] max-w-xl leading-relaxed text-balance lg:text-[1.006rem]">
            {replaceWidows(HERO.subline.replace("{lata}", String(years)))}
          </p>

          <div className="mt-[28px]">
            <Button
              href="/projekty"
              variant="primary"
              className="w-full uppercase sm:w-auto"
              style={{
                fontSize: "1.035rem",
                paddingLeft: "1.553rem",
                paddingRight: "1.553rem",
                paddingTop: "0.776rem",
                paddingBottom: "0.776rem",
              }}
            >
              Zobacz moje projekty ↗
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

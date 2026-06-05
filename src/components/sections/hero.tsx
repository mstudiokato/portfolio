import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Container } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/typography";
import { yearsOfExperience } from "@/lib/experience";
import { HERO } from "@/lib/site-content";

/**
 * HERO (masterprompt sek. 8.1). Zdjęcie projektanta jako pełne tło sekcji
 * (next/image fill, object-cover, center top, za treścią). Gradient overlay
 * (ciemny po lewej → prześwit po prawej) trzyma teksty czytelne. Treść po lewej,
 * wysoko pod navbarem (minimalny padding-top). Min-height ≈ 100vh, by zdjęcie
 * miało przestrzeń. Zdjęcie: /public/zdjecie.jpg (fallback gdy brak pliku).
 */

// Sprawdzenie istnienia pliku w czasie buildu (Hero to server component).
const hasPhoto = fs.existsSync(
  path.join(process.cwd(), "public", "zdjecie.jpg"),
);

// Overlay: lewa prawie nieprzezroczysta (czytelność tekstu) → prawa prześwituje.
const HERO_OVERLAY =
  "linear-gradient(to right, rgba(11,18,32,0.95) 0%, rgba(11,18,32,0.7) 50%, rgba(11,18,32,0.2) 100%)";

export function Hero() {
  const years = yearsOfExperience();

  return (
    <section className="bg-navy relative isolate flex min-h-[600px] items-start overflow-hidden lg:min-h-screen">
      {/* Tło — zdjęcie (za treścią). */}
      {hasPhoto ? (
        <Image
          src="/zdjecie.jpg"
          alt=""
          fill
          sizes="100vw"
          priority
          className="-z-20 object-cover object-top"
        />
      ) : null}

      {/* Overlay gradientowy nad zdjęciem, pod treścią. */}
      <div
        className="absolute inset-0 -z-10"
        style={{ background: HERO_OVERLAY }}
        aria-hidden="true"
      />

      <Container className="w-full pt-8 pb-16 lg:pt-14">
        <div className="max-w-2xl">
          <Label>{HERO.eyebrow}</Label>

          <h1 className="font-display text-ink mt-6 text-[clamp(3rem,12vw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.03em] uppercase">
            Michał
            <br />
            Stężały
          </h1>

          <p className="font-display text-ink text-h3 mt-6">
            Senior Graphic Designer{" "}
            <span className="text-lime">for Sport &amp; Business</span>
          </p>

          <p className="text-body-lg text-ink/85 mt-6 max-w-xl leading-relaxed">
            {HERO.subline.replace("{lata}", String(years))}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button href="/#kontakt" variant="primary" className="w-full sm:w-auto">
              {HERO.ctaPrimary}
            </Button>
            <Button
              href="/projekty"
              variant="secondary"
              className="w-full sm:w-auto"
            >
              {HERO.ctaSecondary}
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

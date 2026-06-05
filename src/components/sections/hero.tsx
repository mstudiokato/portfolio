import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { Container, Section } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Label, Lead } from "@/components/ui/typography";
import { yearsOfExperience } from "@/lib/experience";
import { HERO } from "@/lib/site-content";

/**
 * HERO (masterprompt sek. 8.1). Lewa kolumna dominuje nazwiskiem (H1 max).
 * Prawa kolumna (tylko desktop): zdjęcie projektanta jako tło z gradientową
 * maską — wtapia się w ciemne tło po lewej i zanika ku dołowi, więc teksty hero
 * pozostają czytelne. Zdjęcie: /public/zdjecie.jpg (fallback gdy brak pliku).
 */

// Sprawdzenie istnienia pliku w czasie buildu (Hero to server component).
const hasPhoto = fs.existsSync(
  path.join(process.cwd(), "public", "zdjecie.jpg"),
);

// Maska: część prawa widoczna (fade od lewej), zanik ku dołowi. Złożenie obu
// gradientów przez mask-composite: intersect (z prefiksem WebKit: source-in).
const PHOTO_MASK =
  "linear-gradient(to right, transparent 0%, black 25%), linear-gradient(to bottom, black 60%, transparent 100%)";

export function Hero() {
  const years = yearsOfExperience();

  return (
    <Section>
      <Container>
        <div className="grid items-center gap-12 pt-4 sm:pt-8 lg:grid-cols-12 lg:gap-10 lg:pt-10">
          {/* LEWA KOLUMNA */}
          <div className="lg:col-span-7">
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

            <Lead className="mt-6 max-w-xl">
              {HERO.subline.replace("{lata}", String(years))}
            </Lead>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                href="/#kontakt"
                variant="primary"
                className="w-full sm:w-auto"
              >
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

          {/* PRAWA KOLUMNA — zdjęcie tła z gradientową maską; ukryte na mobile. */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="relative h-[34rem]">
              {hasPhoto ? (
                <Image
                  src="/zdjecie.jpg"
                  alt="Michał Stężały — Senior Graphic Designer"
                  fill
                  sizes="(min-width: 1024px) 40vw, 0px"
                  className="object-cover object-top"
                  priority
                  style={{
                    maskImage: PHOTO_MASK,
                    WebkitMaskImage: PHOTO_MASK,
                    maskComposite: "intersect",
                    WebkitMaskComposite: "source-in",
                  }}
                />
              ) : (
                <div className="bg-surface border-border rounded-card flex h-full items-center justify-center border p-4 text-center">
                  <span className="text-label text-muted uppercase">
                    [ZDJĘCIE — /public/zdjecie.jpg]
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

import Image from "next/image";
import { Container, Section } from "@/components/ui/layout";
import { H2, Label } from "@/components/ui/typography";
import { TESTIMONIALS } from "@/lib/site-content";

/**
 * TESTIMONIALE (T1) — karta ze zdjęciem-okładką u góry (gradient w tło karty),
 * pod nim duży limonkowy cudzysłów lekko nachodzący na zdjęcie, cytat i stopka
 * (linia + imię + stanowisko). Bez zdjęcia → szary placeholder z inicjałami.
 * Karty surface, sekcja section (kontrast). Grid 2×2 desktop / 1 kolumna mobile.
 */

/** Inicjały z dwóch pierwszych słów imienia i nazwiska. */
function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? "")
    .join("");
}

// Gradient wtapiający dół zdjęcia w tło karty (surface #152238) — płynne przejście.
const COVER_FADE =
  "linear-gradient(to bottom, transparent 40%, #152238 100%)";

export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <Section
      id="opinie-klientow"
      tone="section"
      size="tight"
      style={{ paddingTop: "calc(var(--spacing-section-tight) * 0.7)" }}
    >
      <Container>
        <Label>— Co mówią klienci</Label>
        <H2 className="mt-4 max-w-2xl">Opinie</H2>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="bg-surface flex flex-col overflow-hidden rounded-[4px]"
            >
              {/* Okładka — zdjęcie z gradientem w tło karty, albo placeholder. */}
              <div className="relative h-[180px] w-full">
                {t.imageExists && t.image ? (
                  <>
                    <Image
                      src={t.image}
                      alt={t.name}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover object-top"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: COVER_FADE }}
                      aria-hidden="true"
                    />
                  </>
                ) : (
                  <div className="bg-section flex h-full w-full items-center justify-center">
                    <span className="font-display text-muted text-2xl font-semibold">
                      {initials(t.name)}
                    </span>
                  </div>
                )}
              </div>

              {/* Treść — cudzysłów nachodzi lekko na zdjęcie (-mt-4). */}
              <div className="px-6 pb-6">
                <span
                  aria-hidden="true"
                  className="font-display text-lime block -mt-4 text-[4rem] leading-none"
                >
                  &ldquo;
                </span>

                <blockquote className="text-ink text-body -mt-2 italic">
                  {t.quote}
                </blockquote>

                <figcaption className="border-border mt-4 border-t pt-4">
                  <p className="font-display text-ink font-semibold">{t.name}</p>
                  <p className="text-caption text-muted mt-0.5">{t.role}</p>
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

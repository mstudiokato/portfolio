import Image from "next/image";
import { Container, Section } from "@/components/ui/layout";
import { H2, Label } from "@/components/ui/typography";
import { TESTIMONIALS } from "@/lib/site-content";

/**
 * TESTIMONIALE (FIX 2) — układ lewo/prawo: po lewej pionowe zdjęcie 80×120
 * (object-cover od góry) lub szary placeholder z inicjałami; po prawej cytat
 * (kursywa, z cudzysłowami typograficznymi) + imię (bold) + stanowisko.
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
              className="bg-surface flex gap-5 rounded-[4px] p-6"
            >
              {/* Lewa — pionowe zdjęcie 80×120 albo placeholder z inicjałami. */}
              {t.imageExists && t.image ? (
                <div className="relative h-[120px] w-[80px] shrink-0 overflow-hidden rounded-[2px]">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="80px"
                    className="object-cover object-top"
                  />
                </div>
              ) : (
                <div
                  className="bg-section flex h-[120px] w-[80px] shrink-0 items-center justify-center rounded-[2px]"
                  aria-hidden="true"
                >
                  <span className="text-muted text-xs font-semibold">
                    {initials(t.name)}
                  </span>
                </div>
              )}

              {/* Prawa — cytat + autor. */}
              <div className="flex flex-col">
                <blockquote className="text-ink text-body italic">
                  „{t.quote}”
                </blockquote>
                <figcaption className="mt-4">
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

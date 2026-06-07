import Image from "next/image";
import { Container, Section } from "@/components/ui/layout";
import { H2, Label } from "@/components/ui/typography";
import { TESTIMONIALS, EYEBROW_COLOR } from "@/lib/site-content";
import { textColorHex } from "@/lib/text-color";
import { replaceWidows } from "@/lib/text";

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
        <Label style={{ color: textColorHex(EYEBROW_COLOR, "lime") }}>
          — CO MÓWIĄ ZLECENIODAWCY
        </Label>
        <H2 className="mt-4 max-w-2xl">Rekomendacje</H2>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="group bg-surface flex gap-5 rounded-[4px] p-6"
            >
              {/* Lewa — pionowe zdjęcie 100×140 (FIX 3). Wrapper relative+overflow-hidden:
                  zdjęcie skaluje się przy hover karty (scale 1.05), gradient od dołu
                  wtapia zdjęcie w tło karty (#152238). prefers-reduced-motion → bez ruchu. */}
              {t.imageExists && t.image ? (
                <div className="relative h-[140px] w-[100px] shrink-0 overflow-hidden rounded-[4px]">
                  <Image
                    src={t.image}
                    alt={t.name}
                    fill
                    sizes="100px"
                    className="object-cover object-top transition-transform duration-300 ease-in-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
                  />
                  {/* Gradient od dołu — zdjęcie wtapia się w tło karty. */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to bottom, transparent 50%, #152238 100%)",
                    }}
                  />
                </div>
              ) : (
                <div
                  className="bg-section flex h-[140px] w-[100px] shrink-0 items-center justify-center rounded-[4px]"
                  aria-hidden="true"
                >
                  <span className="text-muted text-xs font-semibold">
                    {initials(t.name)}
                  </span>
                </div>
              )}

              {/* Prawa — cytat + autor. */}
              <div className="flex flex-col">
                <blockquote
                  className="text-body italic"
                  style={{ color: textColorHex(t.quoteColor) }}
                >
                  „{replaceWidows(t.quote)}”
                </blockquote>
                <figcaption className="mt-4">
                  <p className="font-display text-ink font-semibold">{t.name}</p>
                  {/* Każda rola/stanowisko w osobnej linii. */}
                  {t.roles.map((r) => (
                    <p key={r} className="text-caption text-muted mt-0.5">
                      {r}
                    </p>
                  ))}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

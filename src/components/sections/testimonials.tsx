import { Container, Section } from "@/components/ui/layout";
import { H2, Label } from "@/components/ui/typography";
import { TESTIMONIALS } from "@/lib/site-content";

/**
 * TESTIMONIALE (FIX 9) — nowy układ karty: duży limonkowy cudzysłów u góry,
 * cytat (kursywa), na dole inicjały w kółku (lime border) + imię + stanowisko.
 * Karty na tle surface, sekcja na tle section (kontrast). Grid 2×2 desktop /
 * 1 kolumna mobile. Padding sekcji zwarty, top −30% (FIX 5).
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
        <H2 className="mt-4 max-w-2xl">Opinie klientów</H2>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="bg-surface border-border flex flex-col gap-4 rounded-[2px] border p-8"
            >
              {/* Duży cudzysłów otwierający (lime). */}
              <span
                aria-hidden="true"
                className="font-display text-lime text-[4rem] leading-none"
              >
                &ldquo;
              </span>

              <blockquote className="text-ink text-body-lg italic">
                {t.quote}
              </blockquote>

              <figcaption className="mt-auto flex items-center gap-3 pt-2">
                <span
                  aria-hidden="true"
                  className="bg-surface border-lime text-ink text-caption flex h-10 w-10 shrink-0 items-center justify-center rounded-full border font-semibold"
                >
                  {initials(t.name)}
                </span>
                <div>
                  <p className="font-display text-ink font-semibold">{t.name}</p>
                  <p className="text-caption text-muted">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

import { Container, Section } from "@/components/ui/layout";
import { H2, Label } from "@/components/ui/typography";
import { TESTIMONIALS } from "@/lib/site-content";

/**
 * TESTIMONIALE (N1) — social proof (masterprompt sek. 7). Grid 2×2 na desktop,
 * 1 kolumna na mobile. Karta: avatar (inicjały na ciemnym kole), imię,
 * stanowisko, cytat. Treść edytowalna w Keystatic (singleton testimonials);
 * domyślnie placeholder do podmiany przez właściciela. Karty na tle surface.
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
    <Section id="opinie">
      <Container>
        <Label>Co mówią klienci</Label>
        <H2 className="mt-4 max-w-2xl">Opinie</H2>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="bg-surface border-border rounded-card flex flex-col gap-5 border p-6 sm:p-8"
            >
              <div className="flex items-center gap-4">
                <div
                  className="bg-navy border-border flex h-12 w-12 shrink-0 items-center justify-center rounded-full border"
                  aria-hidden="true"
                >
                  <span className="font-display text-ink text-body font-semibold">
                    {initials(t.name)}
                  </span>
                </div>
                <figcaption>
                  <p className="font-display text-ink text-h4">{t.name}</p>
                  <p className="text-caption text-muted mt-0.5">{t.role}</p>
                </figcaption>
              </div>
              <blockquote className="text-muted text-body italic">
                „{t.quote}”
              </blockquote>
            </figure>
          ))}
        </div>
      </Container>
    </Section>
  );
}

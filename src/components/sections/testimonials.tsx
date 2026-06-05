import Image from "next/image";
import { Container, Section } from "@/components/ui/layout";
import { H2, Label } from "@/components/ui/typography";
import { TESTIMONIALS } from "@/lib/site-content";

/**
 * TESTIMONIALE (N1 / T1, T2) — social proof (masterprompt sek. 7). Tło sekcji =
 * surface (#152238), id=opinie-klientow; padding zwarty (NAPRAWA 3, −30%).
 * Karta: po lewej popiersie (zdjęcie z Keystatic albo placeholder „FOTO"),
 * po prawej cytat (kursywa) + imię (bold) + stanowisko (secondary). Poziomo
 * na desktop, pionowy stack na mobile.
 */
export function Testimonials() {
  if (TESTIMONIALS.length === 0) return null;

  return (
    <Section id="opinie-klientow" tone="surface" size="tight">
      <Container>
        <Label>Co mówią klienci</Label>
        <H2 className="mt-4 max-w-2xl">Opinie klientów</H2>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="bg-navy border-border flex flex-col gap-5 rounded-card border p-6 sm:flex-row sm:gap-6 sm:p-8"
            >
              {/* Popiersie (~80×100): zdjęcie z Keystatic albo placeholder „FOTO". */}
              {t.imageExists && t.image ? (
                <div className="border-border relative h-[100px] w-[80px] shrink-0 overflow-hidden rounded-[2px] border">
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
                  className="bg-section border-border text-label text-muted flex h-[100px] w-[80px] shrink-0 items-center justify-center rounded-[2px] border uppercase"
                  aria-hidden="true"
                >
                  Foto
                </div>
              )}

              {/* Tekst opinii + autor. */}
              <div className="flex flex-col">
                <blockquote className="text-ink text-body italic">
                  „{t.quote}”
                </blockquote>
                <figcaption className="mt-4">
                  <p className="font-display text-ink font-semibold">
                    {t.name}
                  </p>
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

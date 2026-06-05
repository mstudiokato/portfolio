import type { Project } from "@/lib/content";
import { Container, Section } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Label, Lead } from "@/components/ui/typography";
import { yearsOfExperience } from "@/lib/experience";

/**
 * HERO (masterprompt sek. 8.1). Lewa kolumna dominuje nazwiskiem (H1 max).
 * Prawa kolumna (desktop): placeholder zdjęcia + kolaż miniatur projektów.
 * Bez animacji (Etap 8). Zdjęcie wrzuca właściciel: /public/zdjecie.jpg.
 */
export function Hero({ featured }: { featured: Project[] }) {
  const years = yearsOfExperience();
  const thumbs = featured.slice(0, 3);

  return (
    <Section>
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* LEWA KOLUMNA */}
          <div className="lg:col-span-7">
            <Label>— Projektuję dla sportu i biznesu</Label>

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
              Projektuję komunikację wizualną dla klubów, federacji, eventów i
              marek B2B — łącząc {years} lat doświadczenia z nowoczesnym
              AI-augmented workflow.
            </Lead>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
              <Button
                href="/#kontakt"
                variant="primary"
                className="w-full sm:w-auto"
              >
                Porozmawiajmy ↗
              </Button>
              <Button
                href="/projekty"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                Zobacz projekty
              </Button>
            </div>
          </div>

          {/* PRAWA KOLUMNA — ukryta na mobile/tablet (nazwisko dominuje). */}
          <div className="hidden lg:col-span-5 lg:block">
            <div className="grid h-[28rem] grid-cols-3 grid-rows-3 gap-3">
              {/* Placeholder zdjęcia projektanta. */}
              <div className="bg-surface border-border rounded-card col-span-2 row-span-3 flex items-center justify-center border p-4 text-center">
                <span className="text-label text-muted uppercase">
                  [ZDJĘCIE — /public/zdjecie.jpg]
                </span>
              </div>

              {/* Kolaż miniatur projektów (placeholdery coverów). */}
              {thumbs.map((p) => (
                <div
                  key={p.slug}
                  className="bg-section border-border rounded-card flex items-center justify-center border p-2 text-center"
                >
                  <span className="text-caption text-muted">{p.client}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}

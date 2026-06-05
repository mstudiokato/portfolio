import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { Container, Section } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import { ProjectCard } from "@/components/project-card";
import {
  H1,
  H2,
  H3,
  H4,
  Lead,
  Body,
  Label,
  Caption,
} from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Design system",
  robots: { index: false, follow: false },
};

const COLORS: Array<{
  name: string;
  token: string;
  hex: string;
  ink?: boolean;
}> = [
  { name: "Navy (bg)", token: "bg-navy", hex: "#0B1220" },
  { name: "Section", token: "bg-section", hex: "#0F1A2E" },
  { name: "Surface", token: "bg-surface", hex: "#152238" },
  { name: "Border", token: "bg-border", hex: "#1F2D44" },
  { name: "Lime (akcent)", token: "bg-lime", hex: "#D4FF00", ink: true },
  { name: "Ink (tekst)", token: "bg-ink", hex: "#F5F7FA", ink: true },
  { name: "Muted", token: "bg-muted", hex: "#8B96AB", ink: true },
];

/** Mały nagłówek grupy w podglądzie. */
function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-border py-section-sm border-t first:border-t-0">
      <Label className="text-muted">{title}</Label>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export default function DesignSystemPage() {
  const sampleProject = getAllProjects()[0];

  return (
    <main>
      <Section size="sm">
        <Container>
          <Label>Etap 2 · podgląd</Label>
          <H1 className="text-h2 mt-4">Design system</H1>
          <Lead className="mt-3 max-w-2xl">
            Editorial Sports Dark — typografia, kolory, spacing i komponenty
            obok siebie. Strona robocza (noindex).
          </Lead>

          {/* ── KOLORY ────────────────────────────────────────────── */}
          <Group title="Kolory">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
              {COLORS.map((c) => (
                <div key={c.token} className="flex flex-col gap-2">
                  <div
                    className={`${c.token} border-border rounded-card h-20 border`}
                  />
                  <div>
                    <Caption className="text-ink">{c.name}</Caption>
                    <Caption className="font-mono">{c.hex}</Caption>
                  </div>
                </div>
              ))}
            </div>
            <Caption className="mt-4">
              Reguła limu: akcent, nie dominanta — CTA, ważne liczby,
              hover/active, pojedyncze słowa.
            </Caption>
          </Group>

          {/* ── TYPOGRAFIA ────────────────────────────────────────── */}
          <Group title="Skala typograficzna">
            <div className="flex flex-col gap-6">
              <div>
                <H1>Nagłówek H1 — Clash Display</H1>
                <Caption className="mt-1">font-display · text-h1</Caption>
              </div>
              <div>
                <H2>Nagłówek H2 — Clash Display</H2>
                <Caption className="mt-1">font-display · text-h2</Caption>
              </div>
              <div>
                <H3>Nagłówek H3 — Clash Display</H3>
                <Caption className="mt-1">font-display · text-h3</Caption>
              </div>
              <div>
                <H4>Nagłówek H4 — Clash Display</H4>
                <Caption className="mt-1">font-display · text-h4</Caption>
              </div>
              <div>
                <Lead>
                  Lead / wprowadzenie — Switzer. Większy body do akapitów
                  otwierających sekcję.
                </Lead>
                <Caption className="mt-1">font-sans · text-body-lg</Caption>
              </div>
              <div>
                <Body>
                  Body — Switzer. Podstawowy tekst treści, czytelny i neutralny,
                  z komfortowym interlinem.
                </Body>
                <Caption className="mt-1">font-sans · text-body</Caption>
              </div>
              <div>
                <Label>Label / eyebrow — wersaliki, tracking</Label>
                <Caption className="mt-1">text-label · uppercase</Caption>
              </div>
              <div>
                <Caption className="text-ink">
                  Caption — drobny tekst pomocniczy, podpisy.
                </Caption>
                <Caption className="mt-1">text-caption</Caption>
              </div>
            </div>
          </Group>

          {/* ── BUTTONY ───────────────────────────────────────────── */}
          <Group title="Buttony">
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center gap-4">
                <Button href="#" variant="primary">
                  Primary (lime)
                </Button>
                <Button href="#" variant="secondary">
                  Secondary (outline)
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Button href="#" variant="primary" size="sm">
                  Small
                </Button>
                <Button href="#" variant="primary" size="md">
                  Medium
                </Button>
                <Button href="#" variant="primary" size="lg">
                  Large
                </Button>
              </div>
              <Caption>
                Kant ostry (rounded-button · 2px) — sportowy, pewny; świadomie
                NIE pill. Polimorficzny: z href → link, bez → &lt;button&gt;.
                Focus-visible (lime) — sprawdź klawiszem Tab.
              </Caption>
            </div>
          </Group>

          {/* ── TAGI / CHIPY ──────────────────────────────────────── */}
          <Group title="Tag / chip kategorii">
            <div className="flex flex-wrap items-center gap-2">
              <Tag>Domyślny</Tag>
              <Tag active>Aktywny</Tag>
              <Tag href="/projekty?kategoria=social-media">Jako link</Tag>
              <Tag href="/projekty?kategoria=branding-identity">
                Branding &amp; Identyfikacja{" "}
                <span className="opacity-70">2</span>
              </Tag>
            </div>
          </Group>

          {/* ── KARTA PROJEKTU ────────────────────────────────────── */}
          <Group title="Karta projektu (3:2)">
            {sampleProject ? (
              <div className="gap-x-grid grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                <ProjectCard project={sampleProject} />
                <ProjectCard project={sampleProject} />
                <ProjectCard project={sampleProject} />
              </div>
            ) : (
              <Caption>Brak projektów do podglądu.</Caption>
            )}
            <Caption className="mt-4">
              Cover w ratio 3:2 [ZABLOKOWANE] — placeholder do czasu
              podstawienia grafik. Najedź kursorem: hover na obrysie i tytule.
            </Caption>
          </Group>

          {/* ── SPACING ───────────────────────────────────────────── */}
          <Group title="Spacing / rytm">
            <div className="flex flex-col gap-4">
              <div className="gap-grid flex items-end">
                <div className="bg-surface border-border rounded-card h-12 w-12 border" />
                <div className="bg-surface border-border rounded-card h-12 w-12 border" />
                <div className="bg-surface border-border rounded-card h-12 w-12 border" />
                <Caption className="self-center">gap-grid (1.5rem)</Caption>
              </div>
              <div className="bg-section border-border rounded-card p-card border">
                <Caption className="text-ink">p-card (1.25rem)</Caption>
              </div>
              <Caption>
                Sekcje używają py-section / py-section-sm (fluid clamp) — rytm
                pionowy strony.
              </Caption>
            </div>
          </Group>
        </Container>
      </Section>
    </main>
  );
}

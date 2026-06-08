import type { Metadata } from "next";
import { Suspense } from "react";
import { getFeaturedProjects, getGalleryItems } from "@/lib/content";
import { EYEBROW_COLOR } from "@/lib/site-content";
import { textColorHex } from "@/lib/text-color";
import { ProjectCard } from "@/components/project-card";
import { GalleryArchive } from "@/components/gallery-archive";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, H2, Label } from "@/components/ui/typography";

export const metadata: Metadata = {
  // absolute → pomija szablon „%s — Michał Stężały" z layoutu (tytuł ma już sufiks).
  title: {
    absolute:
      "Portfolio — projekty graficzne dla sportu i biznesu | Michał Stężały",
  },
  description:
    "Portfolio projektanta graficznego: branding sportowy, social media, identyfikacja wizualna i materiały do druku dla klubów, federacji i marek B2B.",
  // Self-canonical → warianty z ?kategoria= wskazują na /projekty (bez parametru).
  alternates: { canonical: "/projekty" },
};

export default function ProjektyPage() {
  const featured = getFeaturedProjects();
  const gallery = getGalleryItems();

  return (
    <>
      <SiteHeader />

      {/* SEKCJA 1 — Case studies (featured): grid 3-kol desktop / 1 mobile (P1, P2). */}
      <Section>
        <Container>
          <Label style={{ color: textColorHex(EYEBROW_COLOR, "lime") }}>
            — Wybrane realizacje
          </Label>
          <H1 className="text-h2 mt-4">Case Studies</H1>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-x-grid sm:gap-y-12 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </Section>

      {/* SEKCJA 2 — Pozostałe prace: filtry kategorii + bloki galerii (P1).
          Tło section + górna linia = wyraźny podział. Padding-top −40% (NAPRAWA 5). */}
      <Section
        tone="section"
        className="border-border border-t"
        style={{ paddingTop: "calc(var(--spacing-section) * 0.6)" }}
      >
        <Container>
          <Label style={{ color: textColorHex(EYEBROW_COLOR, "lime") }}>
            — Pozostałe prace
          </Label>
          <H2 className="mt-4">Projekty</H2>

          <div className="mt-8">
            <Suspense fallback={null}>
              <GalleryArchive items={gallery} />
            </Suspense>
          </div>
        </Container>
      </Section>

      <SiteFooter />
    </>
  );
}

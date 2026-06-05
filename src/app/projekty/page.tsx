import type { Metadata } from "next";
import { getFeaturedProjects, getGalleryItems } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { GalleryArchive } from "@/components/gallery-archive";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, H2, Label } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Projekty",
  description:
    "Wybrane realizacje case-study oraz pozostałe prace: logo, social media, plakaty, branding i więcej.",
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
          <Label>Wybrane realizacje</Label>
          <H1 className="text-h2 mt-4">Case Studies</H1>

          <div className="gap-x-grid mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </Section>

      {/* SEKCJA 2 — Pozostałe prace: filtry kategorii + bloki galerii (P1).
          Tło section + górna linia = wyraźny podział od sekcji case studies. */}
      <Section tone="section" className="border-border border-t">
        <Container>
          <Label>Pozostałe prace</Label>
          <H2 className="mt-4">Projekty</H2>

          <div className="mt-8">
            <GalleryArchive items={gallery} />
          </div>
        </Container>
      </Section>

      <SiteFooter />
    </>
  );
}

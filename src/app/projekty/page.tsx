import type { Metadata } from "next";
import { getFeaturedProjects, getGalleryItems } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { GalleryArchive } from "@/components/gallery-archive";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, Lead, Label } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Projekty",
  description:
    "Wybrane projekty case-study oraz pozostałe prace: social media, logo, plakaty, branding i więcej.",
};

export default function ProjektyPage() {
  const featured = getFeaturedProjects();
  const gallery = getGalleryItems();

  return (
    <>
      <SiteHeader />

      {/* SEKCJA 1 — Case studies (featured): grid 3-kol desktop / 1 mobile. */}
      <Section>
        <Container>
          <H1 className="text-h2">Projekty</H1>
          <Lead className="mt-3 max-w-2xl">
            Wybrane realizacje case-study oraz pozostałe prace.
          </Lead>

          <div className="mt-12">
            <Label>Wybrane projekty</Label>
            <div className="gap-x-grid mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* SEKCJA 2 — Pozostałe prace: filtry kategorii + bloki galerii. */}
      <Section tone="section">
        <Container>
          <Label>Pozostałe prace</Label>
          <div className="mt-8">
            <GalleryArchive items={gallery} />
          </div>
        </Container>
      </Section>

      <SiteFooter />
    </>
  );
}

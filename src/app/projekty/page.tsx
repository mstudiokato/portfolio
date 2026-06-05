import type { Metadata } from "next";
import { getFeaturedProjects, getGalleryByCategory } from "@/lib/content";
import { GALLERY_CATEGORIES } from "@/lib/gallery-categories";
import { ProjectCard } from "@/components/project-card";
import {
  GalleryAccordion,
  type GalleryGroup,
} from "@/components/gallery-accordion";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, H2, Lead, Label } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Projekty",
  description:
    "Wybrane projekty case-study oraz archiwum pozostałych prac: social media, logo, plakaty, branding i więcej.",
};

export default function ProjektyPage() {
  const featured = getFeaturedProjects();

  // Grupy do accordionu „Pozostałe prace" — kolejność z GALLERY_CATEGORIES.
  const groups: GalleryGroup[] = GALLERY_CATEGORIES.map((c) => ({
    slug: c.slug,
    label: c.label,
    items: getGalleryByCategory(c.slug),
  }));

  return (
    <>
      <SiteHeader />

      {/* SEKCJA 1 — Wyróżnione projekty (te same karty co na homepage). */}
      <Section>
        <Container>
          <H1 className="text-h2">Projekty</H1>
          <Lead className="mt-3 max-w-2xl">
            Wybrane realizacje case-study oraz archiwum pozostałych prac.
          </Lead>

          <div className="mt-12">
            <Label>Wybrane projekty</Label>
            <div className="gap-x-grid mt-8 grid grid-cols-1 gap-y-12 lg:grid-cols-2">
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* SEKCJA 2 — Pozostałe prace (accordion galerii). */}
      <Section tone="section">
        <Container>
          <Label>Pozostałe prace</Label>
          <H2 className="mt-4 max-w-2xl">Archiwum</H2>
          <Lead className="mt-3 max-w-2xl">
            Mniejsze projekty i pojedyncze realizacje, pogrupowane tematycznie.
          </Lead>

          <div className="mt-10">
            <GalleryAccordion groups={groups} />
          </div>
        </Container>
      </Section>

      <SiteFooter />
    </>
  );
}

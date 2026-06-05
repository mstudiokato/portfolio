import type { Metadata } from "next";
import { getAllProjects, getProjectsByCategory } from "@/lib/content";
import {
  type CategorySlug,
  categoryLabel,
  isCategorySlug,
} from "@/lib/categories";
import { ProjectCard } from "@/components/project-card";
import { CategoryFilter } from "@/components/category-filter";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, Lead, Body } from "@/components/ui/typography";

export const metadata: Metadata = {
  title: "Projekty",
  description:
    "Archiwum projektów — branding, event branding, social media, print, prezentacje. Filtruj po kategorii.",
};

export default async function ProjektyPage({
  searchParams,
}: {
  searchParams: Promise<{ kategoria?: string }>;
}) {
  const { kategoria } = await searchParams;

  // Domyślnie „wszystkie"; nieznana kategoria → traktujemy jak brak filtra.
  const active: CategorySlug | null = isCategorySlug(kategoria)
    ? kategoria
    : null;

  const projects = active ? getProjectsByCategory(active) : getAllProjects();

  return (
    <>
      <SiteHeader />

      <Section size="sm">
        <Container>
          <H1 className="text-h2">Projekty</H1>
          <Lead className="mt-3 max-w-2xl">
            {active
              ? `Kategoria: ${categoryLabel(active)}`
              : "Pełne archiwum realizacji. Filtruj po kategorii."}
          </Lead>

          <div className="mt-8">
            <CategoryFilter active={active} />
          </div>

          {projects.length > 0 ? (
            <div className="gap-x-grid mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <Body className="text-muted mt-10">
              Brak projektów w tej kategorii.
            </Body>
          )}
        </Container>
      </Section>

      <SiteFooter />
    </>
  );
}

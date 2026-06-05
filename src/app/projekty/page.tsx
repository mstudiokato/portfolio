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

      <main className="mx-auto max-w-6xl px-5 pt-14 pb-8">
        <h1 className="font-display text-ink text-4xl font-semibold">
          Projekty
        </h1>
        <p className="text-muted mt-3 max-w-2xl">
          {active
            ? `Kategoria: ${categoryLabel(active)}`
            : "Pełne archiwum realizacji. Filtruj po kategorii."}
        </p>

        <div className="mt-8">
          <CategoryFilter active={active} />
        </div>

        {projects.length > 0 ? (
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        ) : (
          <p className="text-muted mt-10">Brak projektów w tej kategorii.</p>
        )}
      </main>

      <SiteFooter />
    </>
  );
}

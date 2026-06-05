import Link from "next/link";
import type { Project } from "@/lib/content";
import { Container, Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { ProjectCard } from "@/components/project-card";

/**
 * SELECTED WORK (sek. 8.3). Czysty, równy 2-kolumnowy grid wszystkich
 * featured projektów — bez karty full-width (V6). Na mobile 1 kolumna,
 * kolejność zachowana. Ratio kafli 3:2 [ZABLOKOWANE], hover states i linki
 * w ProjectCard.
 */
export function SelectedWork({ projects }: { projects: Project[] }) {
  return (
    <Section id="wybrane">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <Label>Wybrane projekty</Label>
          <Link
            href="/projekty"
            // Wyróżniony link — off-white, medium, hover lime (nie ginie w tle).
            className="text-label text-ink hover:text-lime shrink-0 uppercase transition-colors"
            style={{ fontWeight: 500 }}
          >
            Zobacz wszystkie projekty →
          </Link>
        </div>

        <div className="gap-x-grid mt-10 grid grid-cols-1 gap-y-12 lg:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

import Link from "next/link";
import type { Project } from "@/lib/content";
import { Container, Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { ProjectCard } from "@/components/project-card";

/**
 * SELECTED WORK (sek. 8.3). Czytelna hierarchia: pierwszy projekt (order:1)
 * na pełną szerokość (jeden szeroki kadr 3:2), reszta w równym 2-kolumnowym
 * gridzie (6/6). Na mobile wszystko 1 kolumna, kolejność zachowana.
 * Ratio kafli 3:2 [ZABLOKOWANE].
 */
export function SelectedWork({ projects }: { projects: Project[] }) {
  const [lead, ...rest] = projects;

  return (
    <Section id="wybrane">
      <Container>
        <div className="flex items-end justify-between gap-4">
          <Label>Wybrane projekty</Label>
          <Link
            href="/projekty"
            className="text-label text-lime shrink-0 uppercase hover:underline"
          >
            Zobacz wszystkie →
          </Link>
        </div>

        <div className="mt-10 flex flex-col gap-12">
          {/* Główny projekt — pełna szerokość. */}
          {lead ? <ProjectCard project={lead} /> : null}

          {/* Pozostałe — równy 2-kolumnowy grid. */}
          {rest.length > 0 ? (
            <div className="gap-x-grid grid grid-cols-1 gap-y-12 lg:grid-cols-2">
              {rest.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : null}
        </div>
      </Container>
    </Section>
  );
}

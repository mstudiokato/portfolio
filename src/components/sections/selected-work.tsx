import Link from "next/link";
import type { Project } from "@/lib/content";
import { Container, Section } from "@/components/ui/layout";
import { Label } from "@/components/ui/typography";
import { ProjectCard } from "@/components/project-card";

/**
 * SELECTED WORK (sek. 8.3). Editorial, asymetryczny układ (nie równy bento):
 * na desktopie 12-kolumnowa siatka z różnymi szerokościami kart (pierwsza
 * większa), na mobile 1 kolumna. Karty 3:2 [ZABLOKOWANE].
 */

// Szerokości kolumn (z 12) dla kolejnych kart — rytm wide/narrow.
const SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
  "lg:col-span-6",
  "lg:col-span-6",
];

export function SelectedWork({ projects }: { projects: Project[] }) {
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

        <div className="gap-x-grid mt-10 grid grid-cols-1 gap-y-12 lg:grid-cols-12">
          {projects.map((project, i) => (
            <div key={project.slug} className={SPANS[i % SPANS.length]}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}

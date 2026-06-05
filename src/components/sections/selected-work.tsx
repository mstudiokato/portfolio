import type { Project } from "@/lib/content";
import { Container, Section } from "@/components/ui/layout";
import { H2, Label } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";

/**
 * SELECTED WORK (sek. 8.3). Równy grid wszystkich featured projektów — 3 kolumny
 * desktop / 1 mobile (H1). Ratio kafli 3:2 [ZABLOKOWANE], hover states i linki
 * w ProjectCard. CTA „Zobacz wszystkie projekty" jako Button primary wycentrowany
 * pod gridem (H2).
 */
export function SelectedWork({ projects }: { projects: Project[] }) {
  return (
    <Section id="wybrane">
      <Container>
        <Label>— Wybrane realizacje</Label>
        <H2 className="mt-4 max-w-2xl">Case Studies</H2>

        <div className="gap-x-grid mt-10 grid grid-cols-1 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button href="/projekty" variant="primary" className="uppercase">
            Zobacz wszystkie projekty ↗
          </Button>
        </div>
      </Container>
    </Section>
  );
}

import Link from "next/link";
import type { Project } from "@/lib/content";
import { categoryLabel } from "@/lib/categories";
import { Tag } from "@/components/ui/tag";
import { ProjectImage } from "@/components/project-image";

/**
 * Editorial tile kafla Selected Work (sek. 6.04 / 7). Cover w stałym ratio 3:2
 * [ZABLOKOWANE]. Gdy plik coveru istnieje → next/image (object-cover); gdy brak →
 * ciemny placeholder (bg-surface #152238) z nazwą klienta. Tytuł linkuje do
 * podstrony projektu; chip kategorii to statyczna etykieta (bez linku).
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col gap-4">
      <Link
        href={`/projekty/${project.slug}`}
        aria-label={`${project.client} — zobacz projekt`}
        className="rounded-card border-border group-hover:border-muted block overflow-hidden border transition-colors"
      >
        {project.coverExists ? (
          <ProjectImage
            src={project.cover.src}
            alt={project.cover.alt}
            ratio="3/2"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ) : (
          // Placeholder coveru w ratio 3:2 — ciemne tło (surface) + nazwa klienta.
          <div className="bg-surface flex aspect-[3/2] items-center justify-center p-4 text-center">
            <span className="text-label text-muted uppercase">
              {project.client}
            </span>
          </div>
        )}
      </Link>

      <div className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display text-h4 text-ink">
            <Link
              href={`/projekty/${project.slug}`}
              className="hover:text-lime transition-colors"
            >
              {project.client}
            </Link>
          </h3>
          <span className="text-caption text-muted shrink-0">
            {project.year}
          </span>
        </div>

        {project.scope ? (
          <p className="text-caption text-muted">{project.scope}</p>
        ) : null}

        <div className="mt-1">
          <Tag>{categoryLabel(project.category)}</Tag>
        </div>
      </div>
    </article>
  );
}

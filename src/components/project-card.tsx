import Link from "next/link";
import type { Project } from "@/lib/content";
import { categoryLabel } from "@/lib/categories";
import { Tag } from "@/components/ui/tag";

/**
 * Editorial tile kafla Selected Work (sek. 6.04 / 7). Cover w stałym ratio 3:2
 * [ZABLOKOWANE]. W tej fazie cover to placeholder (pliki grafik dochodzą później)
 * — bez next/image. Tytuł linkuje do podstrony projektu; chip kategorii to
 * statyczna etykieta (bez linku — archiwum nie ma już filtrów ?kategoria=).
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col gap-4">
      <Link
        href={`/projekty/${project.slug}`}
        aria-label={`${project.client} — zobacz projekt`}
        className="rounded-card border-border group-hover:border-muted block overflow-hidden border transition-colors"
      >
        {/* Placeholder coveru w ratio 3:2 do czasu podstawienia grafik. */}
        <div className="bg-section flex aspect-[3/2] items-center justify-center">
          <span className="text-label text-muted uppercase">
            {project.client}
          </span>
        </div>
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

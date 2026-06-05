import Link from "next/link";
import type { Project } from "@/lib/content";
import { categoryLabel } from "@/lib/categories";

/**
 * Editorial tile kafla Selected Work. Cover w stałym ratio 3:2 [ZABLOKOWANE].
 * W Etapie 1 cover to placeholder (pliki grafik dochodzą później) — bez next/image.
 * Tytuł linkuje do podstrony projektu; etykieta kategorii linkuje do archiwum
 * przefiltrowanego po tej kategorii (osobny link — nie zagnieżdżamy <a> w <a>).
 */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex flex-col gap-3">
      <Link
        href={`/projekty/${project.slug}`}
        className="border-border bg-surface block overflow-hidden rounded-md border"
        aria-label={`${project.client} — zobacz projekt`}
      >
        {/* Placeholder coveru w ratio 3:2 do czasu podstawienia grafik. */}
        <div className="bg-section flex aspect-[3/2] items-center justify-center">
          <span className="font-display text-muted text-sm tracking-widest uppercase">
            {project.client}
          </span>
        </div>
      </Link>

      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-display text-ink text-lg leading-tight">
          <Link href={`/projekty/${project.slug}`}>{project.client}</Link>
        </h3>
        <span className="text-muted shrink-0 text-sm">{project.year}</span>
      </div>

      <div className="text-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
        <Link
          href={`/projekty?kategoria=${project.category}`}
          className="text-lime hover:underline"
        >
          {categoryLabel(project.category)}
        </Link>
        {project.scope ? (
          <>
            <span aria-hidden>·</span>
            <span>{project.scope}</span>
          </>
        ) : null}
      </div>
    </article>
  );
}

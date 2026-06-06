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
        {/* Oznaczenie KLIENT — limonkowy badge (spójnie z /projekty/[slug]). */}
        <div className="flex items-center gap-2">
          <span className="bg-lime text-navy text-label rounded-button px-2 py-1 uppercase">
            Klient
          </span>
          <span className="text-caption text-muted">{project.client}</span>
        </div>

        {/* Większy tekst = nazwa projektu (nie klienta). */}
        <h3 className="font-display text-h4 text-ink">
          <Link
            href={`/projekty/${project.slug}`}
            className="hover:text-lime transition-colors"
          >
            {project.title}
          </Link>
        </h3>

        {project.scope ? (
          <p className="text-caption text-muted">{project.scope}</p>
        ) : null}

        {/* Kategoria — ta sama etykieta/pisownia co na /projekty (categoryLabel). */}
        <div className="mt-1">
          <Tag>{categoryLabel(project.category)}</Tag>
        </div>
      </div>
    </article>
  );
}

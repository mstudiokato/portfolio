import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProjects,
  getProjectBySlug,
  getProjectNeighbors,
  type ImageRef,
  type Project,
} from "@/lib/content";
import { categoryLabel } from "@/lib/categories";
import { cn } from "@/lib/cn";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, Lead, Body, Label, Caption } from "@/components/ui/typography";
import { ProjectImage } from "@/components/project-image";
import { GallerySlider } from "@/components/gallery-slider";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  const title = project.seo.title || project.client;
  const description =
    project.seo.description || project.context || project.description;
  const ogImage = project.seo.ogImage || project.cover.src;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

/** Breadcrumb: Projekty → Kategoria → Tytuł projektu. */
function Breadcrumb({ project }: { project: Project }) {
  return (
    <nav aria-label="Ścieżka nawigacji">
      <ol className="text-caption text-muted flex flex-wrap items-center gap-2">
        <li>
          <Link href="/projekty" className="hover:text-ink">
            Projekty
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li>
          <Link
            href={`/projekty?kategoria=${project.category}`}
            className="hover:text-ink"
          >
            {categoryLabel(project.category)}
          </Link>
        </li>
        <li aria-hidden>/</li>
        <li className="text-ink" aria-current="page">
          {project.client}
        </li>
      </ol>
    </nav>
  );
}

/** Dolna nawigacja: „Więcej projektów" + poprzedni/następny. */
function ProjectFooterNav({ project }: { project: Project }) {
  const { prev, next } = getProjectNeighbors(project.slug);
  return (
    <div className="border-border mt-section border-t pt-8">
      <Link
        href={`/projekty?kategoria=${project.category}`}
        className="text-label text-lime uppercase hover:underline"
      >
        Więcej projektów →
      </Link>

      <div className="mt-6 flex items-center justify-between gap-4">
        {prev ? (
          <Link
            href={`/projekty/${prev.slug}`}
            className="text-muted hover:text-ink group flex flex-col gap-1"
          >
            <span className="text-caption">← Poprzedni</span>
            <span className="font-display text-ink">{prev.client}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/projekty/${next.slug}`}
            className="text-muted hover:text-ink flex flex-col gap-1 text-right"
          >
            <span className="text-caption">Następny →</span>
            <span className="font-display text-ink">{next.client}</span>
          </Link>
        ) : (
          <span />
        )}
      </div>
    </div>
  );
}

/** Body MDX renderowane jako proste akapity (pełny MDX-runtime nie jest potrzebny w MVP). */
function BodyParagraphs({ body }: { body: string }) {
  const paragraphs = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  if (paragraphs.length === 0) return null;
  return (
    <div className="mt-6 flex max-w-2xl flex-col gap-4">
      {paragraphs.map((p, i) => (
        <Body key={i} className="text-muted">
          {p}
        </Body>
      ))}
    </div>
  );
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <>
      <SiteHeader />
      <Section size="sm">
        <Container className="max-w-4xl">
          <Breadcrumb project={project} />

          {project.displayType === "gallery" ? (
            <GalleryView project={project} />
          ) : (
            <CaseStudyView project={project} />
          )}

          <ProjectFooterNav project={project} />
        </Container>
      </Section>
      <SiteFooter />
    </>
  );
}

// Mapowanie liczby kolumn → klasa Tailwind (statyczna, by nie zgubił jej JIT).
const GRID_COLS: Record<number, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
};

/**
 * Galeria zdjęć projektu — logika układu:
 *  - 1–3 zdjęcia → grid-cols-{n}, bez slidera;
 *  - dokładnie 4 zdjęcia → grid-cols-2 (mobile) / grid-cols-4 (desktop), bez
 *    slidera;
 *  - 5+ zdjęć → poziomy slider ze strzałkami.
 * W gridzie każde zdjęcie: w-full, NATURALNE proporcje (ratio="original", bez
 * stałej wysokości i bez wymuszania kwadratu — wysokość wynika z proporcji pliku).
 */
function ProjectGallery({ images }: { images: ImageRef[] }) {
  const count = images.length;
  if (count === 0) return null;

  // 5+ → slider ze strzałkami (kafle o jednolitej wysokości, naturalna szerokość).
  if (count >= 5) {
    return (
      <GallerySlider>
        {images.map((img) => (
          <div
            key={img.src}
            data-gallery-item
            className="shrink-0 snap-start"
          >
            <ProjectImage
              src={img.src}
              alt={img.alt}
              ratio="strip"
              sizes="(min-width: 1024px) 18rem, 50vw"
            />
          </div>
        ))}
      </GallerySlider>
    );
  }

  // 1–3 → grid-cols-{n}; dokładnie 4 → 2 kolumny na mobile, 4 na desktop.
  const gridClass =
    count === 4 ? "grid-cols-2 sm:grid-cols-4" : GRID_COLS[count];

  return (
    <div className={cn("grid gap-3", gridClass)}>
      {images.map((img) => (
        <ProjectImage
          key={img.src}
          src={img.src}
          alt={img.alt}
          ratio="original"
          sizes="(min-width: 640px) 18rem, 50vw"
        />
      ))}
    </div>
  );
}

/* ── SZABLON: case-study ──────────────────────────────────────────────── */
function CaseStudyView({ project }: { project: Project }) {
  const meta: Array<[string, string]> = [
    ["Klient", project.client],
    ["Rok", String(project.year)],
    ["Scope", project.scope],
    ["Deliverables", project.deliverables.join(", ")],
    ["Rola", project.role],
    ["Kontekst", project.context],
  ];

  return (
    <>
      <header className="mt-8">
        <Label className="text-muted">{categoryLabel(project.category)}</Label>
        <H1 className="text-h2 mt-3">{project.client}</H1>
        {project.description ? (
          <Lead className="mt-5">{project.description}</Lead>
        ) : null}
      </header>

      {/* Cover jako obraz prowadzący (3:2). */}
      {project.cover.src ? (
        <div className="mt-10">
          <ProjectImage
            src={project.cover.src}
            alt={project.cover.alt}
            ratio="3/2"
            sizes="(min-width: 1024px) 56rem, 100vw"
            priority
          />
        </div>
      ) : null}

      {/* Pola projektu. */}
      <dl className="border-border mt-10 grid grid-cols-1 gap-x-8 gap-y-4 border-t pt-8 sm:grid-cols-2">
        {meta
          .filter(([, value]) => value)
          .map(([label, value]) => (
            <div key={label} className="flex flex-col">
              <dt>
                <Label className="text-muted">{label}</Label>
              </dt>
              <dd className="text-ink mt-1">{value}</dd>
            </div>
          ))}
      </dl>

      <BodyParagraphs body={project.body} />

      {/* Galeria — slider gdy 5+ zdjęć lub zdjęcia poziome; inaczej zawijany rząd. */}
      {project.gallery.length > 0 ? (
        <div className="mt-12">
          <Label className="text-muted">Galeria</Label>
          <div className="mt-6">
            <ProjectGallery images={project.gallery} />
          </div>
        </div>
      ) : null}
    </>
  );
}

/* ── SZABLON: gallery (lekki) ─────────────────────────────────────────── */
function GalleryView({ project }: { project: Project }) {
  return (
    <>
      <header className="mt-8">
        <Label className="text-muted">{categoryLabel(project.category)}</Label>
        <H1 className="text-h2 mt-3">{project.client}</H1>
        <Caption className="mt-3">{project.year}</Caption>
        {project.context ? (
          <Lead className="mt-5 max-w-2xl">{project.context}</Lead>
        ) : null}
      </header>

      {/* Galeria — slider gdy 5+ zdjęć lub zdjęcia poziome; inaczej zawijany rząd. */}
      {project.gallery.length > 0 ? (
        <div className="mt-10">
          <ProjectGallery images={project.gallery} />
        </div>
      ) : (
        <Caption className="mt-10">Galeria w przygotowaniu.</Caption>
      )}
    </>
  );
}

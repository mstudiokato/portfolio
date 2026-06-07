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
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, Lead, Body, Label, Caption } from "@/components/ui/typography";
import {
  ProjectImage,
  isLandscapeImage,
  isSquareImage,
} from "@/components/project-image";

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

/**
 * Galeria zdjęć projektu z progiem slidera (FIX 9 + grid kwadratów):
 *  - dokładnie 4 zdjęcia kwadratowe → grid-cols-4 na pełną szerokość, bez
 *    slidera i bez pustego miejsca po prawej;
 *  - 4 lub mniej zdjęć i żadne nie jest poziome → układ bez slidera (zawijany
 *    rząd), wszystkie widoczne od razu;
 *  - 5+ zdjęć ALBO którekolwiek poziome (szerokie, nie mieści się na ekranie) →
 *    poziomy slider ze scroll-snapem (jak dotychczas).
 */
function ProjectGallery({ images }: { images: ImageRef[] }) {
  if (images.length === 0) return null;

  // Dokładnie 4 zdjęcia kwadratowe → grid-cols-4 na pełną szerokość, bez slidera
  // i bez pustego miejsca po prawej (każde wypełnia komórkę 1:1).
  const allSquare = images.every((img) => isSquareImage(img.src));
  if (images.length === 4 && allSquare) {
    return (
      <div className="grid grid-cols-4 gap-3">
        {images.map((img) => (
          <ProjectImage
            key={img.src}
            src={img.src}
            alt={img.alt}
            ratio="square"
            sizes="(min-width: 1024px) 13rem, 25vw"
          />
        ))}
      </div>
    );
  }

  const hasLandscape = images.some((img) => isLandscapeImage(img.src));
  const useSlider = images.length >= 5 || hasLandscape;

  if (useSlider) {
    return (
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto">
        {images.map((img) => (
          <div key={img.src} className="shrink-0 snap-start">
            <ProjectImage
              src={img.src}
              alt={img.alt}
              ratio="strip"
              sizes="(min-width: 1024px) 18rem, 50vw"
            />
          </div>
        ))}
      </div>
    );
  }

  // ≤4 zdjęć, brak poziomych → zawijany rząd (bez scrolla), wszystkie widoczne.
  return (
    <div className="flex flex-wrap gap-3">
      {images.map((img) => (
        <ProjectImage
          key={img.src}
          src={img.src}
          alt={img.alt}
          ratio="strip"
          sizes="(min-width: 1024px) 18rem, 50vw"
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

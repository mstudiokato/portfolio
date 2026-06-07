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
};

/**
 * Galeria zdjęć projektu — STAŁA wysokość (280px mobile / 420px desktop),
 * object-cover. Logika układu (spójna z GalleryBlock):
 *  - 1 zdjęcie → pełna szerokość (grid-cols-1);
 *  - 2–3 zdjęcia → grid-cols-{n};
 *  - 4+ zdjęć → slider ze strzałkami.
 */
function ProjectGallery({ images }: { images: ImageRef[] }) {
  const count = images.length;
  if (count === 0) return null;

  // Slider: 4 lub więcej zdjęć (stała wysokość, naturalna szerokość kafli).
  if (count >= 4) {
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
              sizes="(min-width: 1024px) 28rem, 80vw"
            />
          </div>
        ))}
      </GallerySlider>
    );
  }

  // Grid 1–3 kolumn: stała wysokość, pełna szerokość komórki, object-cover.
  return (
    <div className={cn("grid gap-3", GRID_COLS[count])}>
      {images.map((img) => (
        <ProjectImage
          key={img.src}
          src={img.src}
          alt={img.alt}
          ratio="fixed"
          sizes="(min-width: 640px) 33vw, 100vw"
        />
      ))}
    </div>
  );
}

/**
 * Sekcja tekstowa case study: limonkowa etykieta (mały tekst) nad białym
 * akapitem, duże odstępy (breathing room). Ukrywana gdy brak treści.
 */
function TextSection({
  label,
  children,
}: {
  label: string;
  children?: string;
}) {
  if (!children || children.trim() === "") return null;
  return (
    <section className="mt-16">
      <Label>{label}</Label>
      <Body className="text-ink mt-4 max-w-2xl leading-relaxed whitespace-pre-line">
        {children}
      </Body>
    </section>
  );
}

/* ── SZABLON: case-study ──────────────────────────────────────────────── */
function CaseStudyView({ project }: { project: Project }) {
  // META — jedna linia: Klient · Rok · Zakres · Rola (puste pomijamy).
  const metaParts = [
    project.client,
    project.year ? String(project.year) : "",
    project.scope,
    project.role,
  ].filter((v) => v && v.trim() !== "");

  return (
    <>
      {/* HERO — nagłówek + duże zdjęcie coveru (3:2, pełna szerokość). */}
      <header className="mt-8">
        <Label className="text-muted">{categoryLabel(project.category)}</Label>
        <H1 className="text-h2 mt-3">{project.client}</H1>
        {project.description ? (
          <Lead className="mt-5">{project.description}</Lead>
        ) : null}
      </header>

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

      {/* META — Klient · Rok · Zakres · Rola. */}
      {metaParts.length > 0 ? (
        <p className="border-border text-muted mt-8 border-t pt-6 text-sm">
          {metaParts.join("  ·  ")}
        </p>
      ) : null}

      {/* WYZWANIE / KONCEPCJA / PROCES. */}
      <TextSection label="Wyzwanie">{project.challenge}</TextSection>
      <TextSection label="Koncepcja">{project.concept}</TextSection>
      <TextSection label="Proces projektowy">{project.process}</TextSection>

      {/* GALERIA ZDJĘĆ. */}
      {project.gallery.length > 0 ? (
        <section className="mt-16">
          <Label>Galeria</Label>
          <div className="mt-6">
            <ProjectGallery images={project.gallery} />
          </div>
        </section>
      ) : null}

      {/* EFEKT. */}
      <TextSection label="Efekt">{project.effect}</TextSection>
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

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
import { replaceWidows } from "@/lib/text";
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

  // Wzorzec: „[tytuł] | Michał Stężały" (brak pola „typ" w danych). absolute →
  // pomija szablon layoutu. seo.title (per-projekt) ma pierwszeństwo nad tytułem.
  const baseTitle = project.seo.title || project.title;
  const fullTitle = `${baseTitle} | Michał Stężały`;
  // Opis: seo.description lub context, przycięte do 155 znaków. Brak → undefined.
  const rawDescription = project.seo.description || project.context;
  const description = rawDescription
    ? rawDescription.slice(0, 155)
    : undefined;
  const ogImage = project.seo.ogImage || project.cover.src;
  return {
    title: { absolute: fullTitle },
    description,
    openGraph: {
      title: fullTitle,
      description,
      type: "article",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

/** Breadcrumb (2 poziomy): Projekty → Tytuł projektu. Kategoria pominięta — jest
 *  już widoczna jako eyebrow pod breadcrumbem. */
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
        <li className="text-ink" aria-current="page">
          {project.title}
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
            <span className="text-caption text-muted">{prev.title}</span>
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
            <span className="text-caption text-muted">{next.title}</span>
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

  // BreadcrumbList (schema.org): Home → Projekty → [tytuł projektu].
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://michal-stezaly.pl",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Projekty",
        item: "https://michal-stezaly.pl/projekty",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `https://michal-stezaly.pl/projekty/${project.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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
 * JEDEN spójny system etykiet na całej podstronie (META + nagłówki sekcji) —
 * punkty nawigacyjne strony: limonkowy (#D4FF00), UPPERCASE, text-sm,
 * tracking-[0.2em], bold.
 */
function SectionLabel({ children }: { children: string }) {
  return (
    <span className="text-lime text-sm font-bold tracking-[0.2em] uppercase">
      {children}
    </span>
  );
}

const hasText = (s?: string): boolean => !!s && s.trim() !== "";

/**
 * Komórka tekstowa w gridzie 2-kolumnowym: etykieta + biały akapit wypełniający
 * całą szerokość kolumny. Ukrywana gdy brak treści. className → padding/separator.
 */
function TextCell({
  label,
  text,
  className,
}: {
  label: string;
  text?: string;
  className?: string;
}) {
  if (!hasText(text)) return null;
  return (
    <div className={className}>
      <SectionLabel>{label}</SectionLabel>
      <Body className="text-ink mt-4 leading-relaxed whitespace-pre-line">
        {replaceWidows(text)}
      </Body>
    </div>
  );
}

/* ── SZABLON: case-study ──────────────────────────────────────────────── */
function CaseStudyView({ project }: { project: Project }) {
  // META — premium grid: KLIENT / ROK / ZAKRES / ROLA (puste pomijamy).
  // Długie wartości (np. rozbudowana rola) zajmują 2 kolumny na desktop, by się
  // nie zawijały w ciasnej kolumnie.
  const metaItems = [
    { label: "Klient", value: project.client },
    { label: "Rok", value: project.year ? String(project.year) : "" },
    { label: "Zakres", value: project.scope },
    { label: "Rola", value: project.role },
  ].filter((m) => m.value && m.value.trim() !== "");

  return (
    <>
      {/* a) eyebrow (kategoria) + b) H1 = TYTUŁ PROJEKTU (klient jest w META). */}
      <header className="mt-8">
        <Label className="text-muted">{categoryLabel(project.category)}</Label>
        <H1 className="text-h2 mt-3">{project.title}</H1>
      </header>

      {/* c) META grid — przed coverem. Blok wydzielony liniami (#1F2D44) góra/dół. */}
      {metaItems.length > 0 ? (
        <dl className="border-border mt-8 grid grid-cols-2 gap-x-10 gap-y-6 border-y py-8 sm:grid-cols-4">
          {metaItems.map((m) => (
            <div
              key={m.label}
              className={m.value.length > 24 ? "sm:col-span-2" : ""}
            >
              <dt>
                <SectionLabel>{m.label}</SectionLabel>
              </dt>
              <dd className="text-ink mt-2 text-base leading-snug">{m.value}</dd>
            </div>
          ))}
        </dl>
      ) : null}

      {/* d) HERO foto — duże zdjęcie coveru (3:2, pełna szerokość). */}
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

      {/* e) Rząd 1: Kontekst (lewa) | Wyzwanie (prawa). Pionowy separator (#1F2D44)
          między kolumnami na desktop; na mobile (stack) ukryty. */}
      {hasText(project.context) || hasText(project.challenge) ? (
        <div className="border-border mt-12 grid grid-cols-1 gap-y-12 border-t pt-8 md:grid-cols-2 md:gap-y-0">
          <TextCell
            label="Kontekst"
            text={project.context}
            className="md:pr-12 lg:pr-16"
          />
          <TextCell
            label="Wyzwanie"
            text={project.challenge}
            className="border-border md:border-l md:pl-12 lg:pl-16"
          />
        </div>
      ) : null}

      {/* f) Rząd 2: Koncepcja (lewa) | Proces projektowy (prawa). */}
      {hasText(project.concept) || hasText(project.process) ? (
        <div className="border-border mt-12 grid grid-cols-1 gap-y-12 border-t pt-8 md:grid-cols-2 md:gap-y-0">
          <TextCell
            label="Koncepcja"
            text={project.concept}
            className="md:pr-12 lg:pr-16"
          />
          <TextCell
            label="Proces projektowy"
            text={project.process}
            className="border-border md:border-l md:pl-12 lg:pl-16"
          />
        </div>
      ) : null}

      {/* g) GALERIA — pełna szerokość. */}
      {project.gallery.length > 0 ? (
        <section className="border-border mt-12 border-t pt-8">
          <SectionLabel>Galeria</SectionLabel>
          <div className="mt-6">
            <ProjectGallery images={project.gallery} />
          </div>
        </section>
      ) : null}

      {/* h) REZULTAT — wyróżnienie grubym limonkowym obrysem, tło transparentne. */}
      {hasText(project.effect) ? (
        <section className="mt-12 rounded-sm border-2 border-[#D4FF00] px-8 py-8">
          <SectionLabel>Rezultat</SectionLabel>
          <Body className="text-ink mt-4 leading-relaxed whitespace-pre-line">
            {replaceWidows(project.effect)}
          </Body>
        </section>
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
          <Lead className="mt-5 max-w-2xl">
            {replaceWidows(project.context)}
          </Lead>
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

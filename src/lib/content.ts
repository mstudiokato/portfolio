import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  type CategorySlug,
  CATEGORIES,
  isCategorySlug,
} from "@/lib/categories";
import {
  type GalleryCategorySlug,
  GALLERY_CATEGORY_SLUGS,
  isGalleryCategorySlug,
} from "@/lib/gallery-categories";

/**
 * Model treści MVP: projekty jako pliki MDX z typowanym frontmatterem w repo
 * (BEZ Sanity — masterprompt sek. 10). Frontmatter jest źródłem prawdy dla kafli
 * i metadanych; treść MDX (body) służy podstronom projektu (Etap 5).
 */

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projekty");

/** Dwa typy podstrony projektu (masterprompt sek. 9). Domyślnie case-study. */
export type DisplayType = "case-study" | "gallery";

/** Obraz: ścieżka względem /public + alt (a11y/SEO). */
export type ImageRef = { src: string; alt: string };

/** SEO per projekt (puste pola → fallback w renderze do tytułu/kontekstu/coveru). */
export type ProjectSeo = {
  title: string;
  description: string;
  ogImage: string;
};

export type Project = {
  /** slug = nazwa pliku bez rozszerzenia; adres /projekty/[slug] */
  slug: string;
  /** Tytuł projektu (slugField w Keystatic). */
  title: string;
  /** Typ podstrony: pełne case-study albo lekka galeria. Fallback: case-study. */
  displayType: DisplayType;
  client: string;
  year: number;
  /** Dokładnie jedna z sześciu kategorii — pole WYMAGANE. */
  category: CategorySlug;
  scope: string;
  deliverables: string[];
  role: string;
  /** Jedno zdanie kontekstu. */
  context: string;
  /** Krótki opis biznesowy (2–4 zdania). */
  description: string;
  /** Cover (ratio 3:2 — [ZABLOKOWANE]) ze ścieżką i altem. */
  cover: ImageRef;
  /** Czy plik coveru istnieje w /public (build-time) — brak → placeholder. */
  coverExists: boolean;
  /** Galeria — obrazy ze ścieżką i altem. */
  gallery: ImageRef[];
  /** Tag do „powiązanych projektów". */
  tag: string;
  /** featured:true → kafel na stronie głównej (8–10 top). */
  featured: boolean;
  /** Ręczna kolejność (mniejsze = wyżej); brak → sort po roku malejąco. */
  order?: number;
  /** SEO per projekt. */
  seo: ProjectSeo;
  /** Surowa treść MDX (body) — render na podstronie projektu. */
  body: string;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim() !== "") {
    return value.split(",").map((s) => s.trim());
  }
  return [];
}

function str(value: unknown): string {
  return value === undefined || value === null ? "" : String(value);
}

/** Parsowanie obrazu z frontmattera ({src, alt}). */
function toImageRef(value: unknown): ImageRef | null {
  if (value && typeof value === "object" && "src" in value) {
    const v = value as { src?: unknown; alt?: unknown };
    if (str(v.src).trim() !== "") return { src: str(v.src), alt: str(v.alt) };
  }
  return null;
}

function toImageRefArray(value: unknown): ImageRef[] {
  if (!Array.isArray(value)) return [];
  return value.map(toImageRef).filter((x): x is ImageRef => x !== null);
}

function parseProject(fileName: string): Project {
  const slug = fileName.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(PROJECTS_DIR, fileName), "utf8");
  const { data, content } = matter(raw);

  // Walidacja pól wymaganych — błąd buildu z nazwą pliku, jeśli czegoś brakuje.
  const require = (field: string): string => {
    const v = data[field];
    if (v === undefined || v === null || String(v).trim() === "") {
      throw new Error(
        `Projekt "${fileName}": brak wymaganego pola "${field}" we frontmatterze.`,
      );
    }
    return String(v);
  };

  require("client");
  require("year");

  // category jest WYMAGANA i musi być jedną z sześciu (kod nie pozwoli inaczej).
  const category = data.category;
  if (!isCategorySlug(category)) {
    const allowed = CATEGORIES.map((c) => c.slug).join(", ");
    throw new Error(
      `Projekt "${fileName}": pole "category" jest wymagane i musi być jedną z: ${allowed}. ` +
        `Otrzymano: ${JSON.stringify(category)}.`,
    );
  }

  const year = Number(data.year);
  if (!Number.isFinite(year)) {
    throw new Error(`Projekt "${fileName}": "year" musi być liczbą.`);
  }

  // displayType: tylko "gallery" przełącza tryb; cokolwiek innego/brak → case-study.
  const displayType: DisplayType =
    data.displayType === "gallery" ? "gallery" : "case-study";

  // cover.alt jest wymagany (a11y/SEO) — błąd buildu, jeśli brak.
  const cover = toImageRef(data.cover);
  if (!cover) {
    throw new Error(
      `Projekt "${fileName}": pole "cover" musi mieć { src, alt }.`,
    );
  }
  if (cover.alt.trim() === "") {
    throw new Error(`Projekt "${fileName}": "cover.alt" jest wymagany.`);
  }

  const seoData = (data.seo ?? {}) as Record<string, unknown>;

  return {
    slug,
    title: str(data.title) || str(data.client),
    displayType,
    client: String(data.client),
    year,
    category,
    scope: str(data.scope),
    deliverables: toStringArray(data.deliverables),
    role: str(data.role),
    context: str(data.context),
    description: str(data.description),
    cover,
    coverExists: publicAssetExists(cover.src),
    gallery: toImageRefArray(data.gallery),
    tag: str(data.tag),
    featured: data.featured === true,
    order: data.order !== undefined ? Number(data.order) : undefined,
    seo: {
      title: str(seoData.title),
      description: str(seoData.description),
      ogImage: str(seoData.ogImage),
    },
    body: content,
  };
}

function byOrderThenYear(a: Project, b: Project): number {
  const ao = a.order ?? Number.POSITIVE_INFINITY;
  const bo = b.order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  if (a.year !== b.year) return b.year - a.year; // nowsze wyżej
  return a.client.localeCompare(b.client, "pl");
}

/** Wszystkie projekty, posortowane (order → rok malejąco → klient). */
export function getAllProjects(): Project[] {
  if (!fs.existsSync(PROJECTS_DIR)) return [];
  return fs
    .readdirSync(PROJECTS_DIR)
    .filter((f) => /\.mdx?$/.test(f))
    .map(parseProject)
    .sort(byOrderThenYear);
}

/** Projekty na stronę główną (featured:true), 8–10 top — bez filtrów. */
export function getFeaturedProjects(): Project[] {
  return getAllProjects().filter((p) => p.featured);
}

export function getProjectBySlug(slug: string): Project | undefined {
  return getAllProjects().find((p) => p.slug === slug);
}

/**
 * Sąsiedzi projektu (poprzedni/następny) wg globalnej kolejności getAllProjects
 * (order → rok → klient). Do nawigacji „← poprzedni / następny →" na podstronie.
 */
export function getProjectNeighbors(slug: string): {
  prev: Project | undefined;
  next: Project | undefined;
} {
  const all = getAllProjects();
  const i = all.findIndex((p) => p.slug === slug);
  if (i === -1) return { prev: undefined, next: undefined };
  return { prev: all[i - 1], next: all[i + 1] };
}

/** Projekty danej kategorii (zachowuje sortowanie). */
export function getProjectsByCategory(category: CategorySlug): Project[] {
  return getAllProjects().filter((p) => p.category === category);
}

/**
 * Helper grupujący wszystkie projekty po kategorii. Klucze = wszystkie sluginy
 * kategorii (także puste tablice), w kolejności z CATEGORIES.
 */
export function groupProjectsByCategory(): Record<CategorySlug, Project[]> {
  const all = getAllProjects();
  const grouped = {} as Record<CategorySlug, Project[]>;
  for (const { slug } of CATEGORIES) {
    grouped[slug] = all.filter((p) => p.category === slug);
  }
  return grouped;
}

/** Liczność projektów per kategoria (do liczników przy filtrach). */
export function countByCategory(): Record<CategorySlug, number> {
  const grouped = groupProjectsByCategory();
  const counts = {} as Record<CategorySlug, number>;
  for (const { slug } of CATEGORIES) counts[slug] = grouped[slug].length;
  return counts;
}

/* ──────────────────────────────────────────────────────────────────────────
   GALERIE („Pozostałe prace") — osobny, lekki model treści od projektów MDX.
   Jeden wpis = grupa zdjęć (oryginalne proporcje) + metadane, BEZ podstrony.
   Pliki: src/content/galerie/<slug>.json (kolekcja Keystatic „Galerie").
   ────────────────────────────────────────────────────────────────────────── */

const GALLERY_DIR = path.join(process.cwd(), "src/content/galerie");

/** Obraz galerii: ścieżka + alt + flaga istnienia pliku w /public (liczona w buildzie). */
export type GalleryImage = { src: string; alt: string; exists: boolean };

export type GalleryItem = {
  /** slug = nazwa pliku bez rozszerzenia. */
  slug: string;
  /** Nazwa klienta / projektu. */
  title: string;
  /** Dokładnie jedna z pięciu kategorii galerii. */
  category: GalleryCategorySlug;
  /** Rok realizacji (opcjonalny) — nagłówek bloku. */
  year?: number;
  /** Krótki opis (1–2 zdania). */
  description: string;
  /** Czy pokazać opis pod galerią na stronie (panel: checkbox, domyślnie true). */
  showDescription: boolean;
  /** Zdjęcia (1–12), w oryginalnych proporcjach. */
  images: GalleryImage[];
  /** Kolejność w obrębie kategorii (mniejsze = wyżej). */
  order: number;
};

/** Czy plik obrazu (ścieżka względem /public) istnieje — render: <img> vs placeholder. */
function publicAssetExists(src: string): boolean {
  if (!src || src.trim() === "") return false;
  const rel = src.replace(/^\//, "");
  return fs.existsSync(path.join(process.cwd(), "public", rel));
}

function parseGalleryItem(fileName: string): GalleryItem {
  const slug = fileName.replace(/\.json$/, "");
  const raw = fs.readFileSync(path.join(GALLERY_DIR, fileName), "utf8");
  const data = JSON.parse(raw) as Record<string, unknown>;

  const category = data.category;
  if (!isGalleryCategorySlug(category)) {
    throw new Error(
      `Galeria "${fileName}": "category" musi być jedną z: ${GALLERY_CATEGORY_SLUGS.join(", ")}. ` +
        `Otrzymano: ${JSON.stringify(category)}.`,
    );
  }

  const rawImages = Array.isArray(data.images) ? data.images : [];
  const images: GalleryImage[] = rawImages
    .map(toImageRef)
    .filter((x): x is ImageRef => x !== null)
    .map((img) => ({ ...img, exists: publicAssetExists(img.src) }));

  const yearNum = Number(data.year);

  return {
    slug,
    title: str(data.title) || slug,
    category,
    year: Number.isFinite(yearNum) && yearNum > 0 ? yearNum : undefined,
    description: str(data.description),
    // Domyślnie true — opis pokazujemy, chyba że w panelu jawnie odznaczono.
    showDescription: data.showDescription !== false,
    images,
    order: data.order !== undefined ? Number(data.order) : 0,
  };
}

function byOrderThenTitle(a: GalleryItem, b: GalleryItem): number {
  if (a.order !== b.order) return a.order - b.order;
  return a.title.localeCompare(b.title, "pl");
}

/** Wszystkie wpisy galerii, posortowane (kolejność → tytuł). */
export function getGalleryItems(): GalleryItem[] {
  if (!fs.existsSync(GALLERY_DIR)) return [];
  return fs
    .readdirSync(GALLERY_DIR)
    .filter((f) => f.endsWith(".json"))
    .map(parseGalleryItem)
    .sort(byOrderThenTitle);
}

/** Wpisy galerii danej kategorii (zachowuje sortowanie). */
export function getGalleryByCategory(
  category: GalleryCategorySlug,
): GalleryItem[] {
  return getGalleryItems().filter((g) => g.category === category);
}

import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import {
  type CategorySlug,
  CATEGORIES,
  isCategorySlug,
} from "@/lib/categories";

/**
 * Model treści MVP: projekty jako pliki MDX z typowanym frontmatterem w repo
 * (BEZ Sanity — masterprompt sek. 10). Frontmatter jest źródłem prawdy dla kafli
 * i metadanych; treść MDX (body) służy podstronom projektu (Etap 5).
 */

const PROJECTS_DIR = path.join(process.cwd(), "src/content/projekty");

/** Dwa typy podstrony projektu (masterprompt sek. 9). Domyślnie case-study. */
export type DisplayType = "case-study" | "gallery";

export type Project = {
  /** slug = nazwa pliku bez rozszerzenia; adres /projekty/[slug] */
  slug: string;
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
  /** Ścieżka coveru względem /public (ratio 3:2 — [ZABLOKOWANE]). */
  cover: string;
  /** Galeria — ścieżki względem /public. */
  gallery: string[];
  /** Tag do „powiązanych projektów". */
  tag: string;
  /** featured:true → kafel na stronie głównej (8–10 top). */
  featured: boolean;
  /** Ręczna kolejność (mniejsze = wyżej); brak → sort po roku malejąco. */
  order?: number;
  /** Surowa treść MDX (body) — render na podstronie projektu (Etap 5). */
  body: string;
};

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string" && value.trim() !== "") {
    return value.split(",").map((s) => s.trim());
  }
  return [];
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

  return {
    slug,
    displayType,
    client: String(data.client),
    year,
    category,
    scope: data.scope ? String(data.scope) : "",
    deliverables: toStringArray(data.deliverables),
    role: data.role ? String(data.role) : "",
    context: data.context ? String(data.context) : "",
    description: data.description ? String(data.description) : "",
    cover: data.cover ? String(data.cover) : "",
    gallery: toStringArray(data.gallery),
    tag: data.tag ? String(data.tag) : "",
    featured: data.featured === true,
    order: data.order !== undefined ? Number(data.order) : undefined,
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

/** Archiwum /projekty: projekty danej kategorii (zachowuje sortowanie). */
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

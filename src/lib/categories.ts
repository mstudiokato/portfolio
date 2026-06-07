/**
 * Sześć rozłącznych kategorii projektów. Każdy projekt należy DOKŁADNIE do jednej.
 * Slug = wartość w query param /projekty?kategoria=... oraz w frontmatterze MDX.
 * Kolejność tablicy = kolejność wyświetlania filtrów na /projekty.
 */

// Jedna, wspólna lista 6 kategorii — identyczna dla Case Studies i Pozostałych
// projektów (gallery-categories.ts re-eksportuje TĘ tablicę). Kolejność tablicy
// = kolejność filtrów na /projekty.
export const CATEGORIES = [
  { slug: "social-media", label: "Social Media" },
  { slug: "logo", label: "Logo" },
  { slug: "plakaty", label: "Plakaty" },
  { slug: "branding", label: "Branding" },
  { slug: "print-dtp", label: "Print & DTP" },
  { slug: "inne", label: "Inne projekty" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as CategorySlug[];

export function isCategorySlug(value: unknown): value is CategorySlug {
  return (
    typeof value === "string" && CATEGORY_SLUGS.includes(value as CategorySlug)
  );
}

export function categoryLabel(slug: CategorySlug): string {
  return CATEGORIES.find((c) => c.slug === slug)!.label;
}

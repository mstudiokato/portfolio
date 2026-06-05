/**
 * Sześć rozłącznych kategorii projektów. Każdy projekt należy DOKŁADNIE do jednej.
 * Slug = wartość w query param /projekty?kategoria=... oraz w frontmatterze MDX.
 * Kolejność tablicy = kolejność wyświetlania filtrów na /projekty.
 */

export const CATEGORIES = [
  { slug: "branding-identity", label: "Branding & Identyfikacja" },
  { slug: "event-branding", label: "Event Branding" },
  { slug: "social-media", label: "Social Media" },
  { slug: "print-plakaty", label: "Print & Plakaty" },
  { slug: "decks-prezentacje", label: "Decki & Prezentacje" },
  { slug: "inne", label: "Inne" },
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

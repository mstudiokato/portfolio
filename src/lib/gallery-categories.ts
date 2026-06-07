/**
 * Kategorie GALERII („Pozostałe projekty" na /projekty) są TERAZ IDENTYCZNE z
 * kategoriami Case Studies — re-eksportujemy wspólną listę z lib/categories.ts,
 * żeby obie kolekcje miały dokładnie te same 6 kategorii. Moduł czysty (bez fs) —
 * importowany przez loader serwerowy (content.ts) i keystatic.config.ts.
 * Kolejność tablicy = kolejność accordionu/filtrów na /projekty.
 */

import { CATEGORIES, type CategorySlug } from "@/lib/categories";

export const GALLERY_CATEGORIES = CATEGORIES;

export type GalleryCategorySlug = CategorySlug;

export const GALLERY_CATEGORY_SLUGS = GALLERY_CATEGORIES.map(
  (c) => c.slug,
) as GalleryCategorySlug[];

export function isGalleryCategorySlug(
  value: unknown,
): value is GalleryCategorySlug {
  return (
    typeof value === "string" &&
    GALLERY_CATEGORY_SLUGS.includes(value as GalleryCategorySlug)
  );
}

/** Domyślnie rozwinięta kategoria w accordionie. */
export const DEFAULT_OPEN_GALLERY: GalleryCategorySlug = "social-media";

import Link from "next/link";
import { type CategorySlug, CATEGORIES } from "@/lib/categories";
import { countByCategory } from "@/lib/content";

/**
 * Filtry archiwum /projekty sterowane query paramem ?kategoria=...
 * (domyślnie „wszystkie"). Linki — działają bez JS, SSG-friendly.
 */
export function CategoryFilter({ active }: { active: CategorySlug | null }) {
  const counts = countByCategory();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  const base = "rounded-full border px-3 py-1.5 text-sm transition-colors";
  const on = "border-lime bg-lime text-navy";
  const off = "border-border text-muted hover:text-ink hover:border-muted";

  return (
    <nav aria-label="Filtruj projekty po kategorii">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/projekty"
            aria-current={active === null ? "page" : undefined}
            className={`${base} ${active === null ? on : off}`}
          >
            Wszystkie <span className="opacity-70">{total}</span>
          </Link>
        </li>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link
              href={`/projekty?kategoria=${c.slug}`}
              aria-current={active === c.slug ? "page" : undefined}
              className={`${base} ${active === c.slug ? on : off}`}
            >
              {c.label} <span className="opacity-70">{counts[c.slug]}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import { type CategorySlug, CATEGORIES } from "@/lib/categories";
import { countByCategory } from "@/lib/content";
import { Tag } from "@/components/ui/tag";

/**
 * Filtry archiwum /projekty sterowane query paramem ?kategoria=...
 * (domyślnie „wszystkie"). Linki — działają bez JS, SSG-friendly.
 */
export function CategoryFilter({ active }: { active: CategorySlug | null }) {
  const counts = countByCategory();
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <nav aria-label="Filtruj projekty po kategorii">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Tag
            href="/projekty"
            active={active === null}
            aria-current={active === null ? "page" : undefined}
          >
            Wszystkie <span className="opacity-70">{total}</span>
          </Tag>
        </li>
        {CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Tag
              href={`/projekty?kategoria=${c.slug}`}
              active={active === c.slug}
              aria-current={active === c.slug ? "page" : undefined}
            >
              {c.label} <span className="opacity-70">{counts[c.slug]}</span>
            </Tag>
          </li>
        ))}
      </ul>
    </nav>
  );
}

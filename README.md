# Portfolio — Michał Stężały · Senior Graphic Designer for Sport & Business

Autorska strona portfolio. Kierunek wizualny: **Editorial Sports Dark**.
Źródło prawdy projektu: [`MASTERPROMPT.md`](./MASTERPROMPT.md). Treść właściciela:
[`SZABLON_TRESCI.md`](./SZABLON_TRESCI.md).

> ⚠️ Domeny `michal-stezaly.pl` NIE dotykamy do launchu (Etap 10). Build i deploy
> wyłącznie na subdomenie `*.netlify.app`.

## Stack

- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS v4**
- Fonty self-hostowane z Fontshare (ITF Free Font License): **Clash Display**
  (display) + **Switzer** (body) — `next/font/local`, pliki w `src/fonts/`.
  Geist/Inter/Poppins **zakazane** jako fonty wiodące.
- Treść: **MDX z typowanym frontmatterem** w repo (BEZ CMS w MVP).
- Hosting docelowy: **Netlify Free** (`netlify.toml` + `@netlify/plugin-nextjs`).

## Komendy

```bash
npm run dev       # serwer deweloperski (turbopack)
npm run build     # produkcyjny build
npm run start     # serwowanie buildu
npm run lint      # ESLint
npm run format    # Prettier (zapis)
```

## Model treści

Projekty: pliki `src/content/projekty/*.mdx`. Frontmatter (pola wymagane: `client`,
`year`, `category`). **`category` musi być jedną z sześciu** — brak/niepoprawna
wartość = błąd buildu:

`branding-identity` · `event-branding` · `social-media` · `print-plakaty` ·
`decks-prezentacje` · `inne`

`featured: true` → kafel na stronie głównej (8–10 top, bez filtrów). Wszystkie
projekty trafiają do archiwum `/projekty` z filtrowaniem po kategorii
(`/projekty?kategoria=<slug>`, domyślnie „wszystkie").

Logika i helpery (m.in. `groupProjectsByCategory`): `src/lib/content.ts`.
Definicje kategorii: `src/lib/categories.ts`.

## Struktura

```
src/
  app/
    layout.tsx              # root, podpięcie fontów, metadata
    page.tsx                # home: hero + featured + kotwica #kontakt
    projekty/page.tsx       # archiwum + filtr kategorii (?kategoria=)
    projekty/[slug]/page.tsx# podstrona projektu (minimalna; pełna w Etapie 5)
    globals.css             # tokeny Editorial Sports Dark (@theme)
  components/               # ProjectCard, CategoryFilter, SiteHeader/Footer
  content/projekty/*.mdx    # projekty (placeholdery na realnych klientach)
  fonts/                    # Clash Display + Switzer (Variable woff2) + licencje
  lib/                      # categories.ts, content.ts, fonts.ts
```

## CMS / Keystatic

Treść edytujesz przez Keystatic (`/keystatic`): **panel lokalny działa od razu**
(`npm run dev` → `localhost:3000/keystatic`, bez logowania), a **panel produkcyjny
aktywuje się po ustawieniu `NEXT_PUBLIC_URL` na docelową domenę w Etapie 10**
(na subdomenie `*.netlify.app` pokazuje komunikat zamiast niedziałającego OAuth).

## Status etapów

Aktualnie ukończony **Etap 1** (setup + model treści + routing). Kolejne etapy
i zasady — patrz `MASTERPROMPT.md` sek. 12. Bez animacji / WOW na tym etapie.

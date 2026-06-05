import { config, fields, collection, singleton } from "@keystatic/core";
import { CATEGORIES } from "./src/lib/categories";

/**
 * Keystatic — Git-based CMS. Treść nadal żyje w repo (src/content/projekty/*.mdx
 * + src/content/settings/*.json). Keystatic to TYLKO UI do edycji tych plików;
 * strona renderuje przez własny loader (gray-matter / fs), bez zależności runtime
 * od Keystatic.
 *
 * Tryb: local w dev (panel bez logowania), github na produkcji (OAuth).
 */
export default config({
  storage:
    process.env.NODE_ENV === "development"
      ? { kind: "local" }
      : {
          kind: "github",
          repo: { owner: "mstudiokato", name: "portfolio" },
        },

  ui: {
    brand: { name: "Portfolio — Michał Stężały" },
  },

  collections: {
    projects: collection({
      label: "Projekty",
      slugField: "title",
      path: "src/content/projekty/*",
      format: { contentField: "content" },
      entryLayout: "content",
      columns: ["title", "year"],
      schema: {
        title: fields.slug({
          name: { label: "Tytuł", validation: { isRequired: true } },
          slug: {
            label: "Slug (adres URL)",
            description: "Część adresu /projekty/[slug]. URL-safe.",
          },
        }),
        client: fields.text({
          label: "Klient",
          validation: { isRequired: true },
        }),
        year: fields.integer({
          label: "Rok",
          validation: { isRequired: true },
        }),
        order: fields.integer({
          label: "Kolejność (sortowanie)",
          validation: { isRequired: true },
        }),
        featured: fields.checkbox({
          label: "Wyróżniony (strona główna)",
          defaultValue: false,
        }),
        displayType: fields.select({
          label: "Typ podstrony",
          options: [
            { label: "Case study (pełny)", value: "case-study" },
            { label: "Galeria (lekki)", value: "gallery" },
          ],
          defaultValue: "case-study",
        }),
        category: fields.select({
          label: "Kategoria",
          options: CATEGORIES.map((c) => ({ label: c.label, value: c.slug })),
          defaultValue: "inne",
        }),
        scope: fields.text({ label: "Scope" }),
        deliverables: fields.array(fields.text({ label: "Deliverable" }), {
          label: "Deliverables",
          itemLabel: (p) => p.value,
        }),
        role: fields.text({ label: "Rola" }),
        context: fields.text({ label: "Kontekst (1 zdanie)", multiline: true }),
        description: fields.text({
          label: "Opis (2–4 zdania)",
          multiline: true,
        }),
        tag: fields.text({ label: "Tag (powiązane projekty)" }),
        cover: fields.object(
          {
            src: fields.text({
              label: "Ścieżka pliku",
              description: "np. /projekty/<slug>/cover.jpg",
            }),
            alt: fields.text({
              label: "Alt (opis obrazu)",
              validation: { isRequired: true },
            }),
          },
          { label: "Cover (3:2)" },
        ),
        gallery: fields.array(
          fields.object({
            src: fields.text({ label: "Ścieżka pliku" }),
            alt: fields.text({ label: "Alt (opis obrazu)" }),
          }),
          {
            label: "Galeria",
            itemLabel: (p) => p.fields.src.value || "zdjęcie",
          },
        ),
        seo: fields.object(
          {
            title: fields.text({ label: "SEO title (puste = tytuł)" }),
            description: fields.text({
              label: "SEO description (puste = kontekst)",
              multiline: true,
            }),
            ogImage: fields.text({ label: "OG image (ścieżka)" }),
          },
          { label: "SEO" },
        ),
        content: fields.mdx({ label: "Treść podstrony (body)" }),
      },
    }),
  },

  singletons: {
    site: singleton({
      label: "Ustawienia strony",
      path: "src/content/settings/site",
      format: { data: "json" },
      schema: {
        hero: fields.object(
          {
            eyebrow: fields.text({ label: "Eyebrow" }),
            subline: fields.text({
              label: "Subline (użyj {lata} dla lat doświadczenia)",
              multiline: true,
            }),
            ctaPrimary: fields.text({ label: "CTA primary" }),
            ctaSecondary: fields.text({ label: "CTA secondary" }),
          },
          { label: "Hero" },
        ),
        numbers: fields.object(
          {
            projects: fields.text({ label: "Liczba projektów (np. 100+)" }),
            brands: fields.text({ label: "Liczba marek (np. 20+)" }),
          },
          { label: "Liczby" },
        ),
        aiWorkflow: fields.text({
          label: "AI-Augmented Workflow — akapit",
          multiline: true,
        }),
        contact: fields.object(
          {
            email: fields.text({ label: "E-mail" }),
            phone: fields.text({ label: "Telefon" }),
            availability: fields.array(fields.text({ label: "Pozycja" }), {
              label: "Dostępność",
              itemLabel: (p) => p.value,
            }),
            cvHref: fields.text({ label: "CV (ścieżka pliku)" }),
          },
          { label: "Kontakt" },
        ),
        seo: fields.object(
          {
            defaultTitle: fields.text({ label: "Domyślny title" }),
            defaultDescription: fields.text({
              label: "Domyślny description",
              multiline: true,
            }),
          },
          { label: "SEO domyślne" },
        ),
      },
    }),

    services: singleton({
      label: "Usługi (Services)",
      path: "src/content/settings/services",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({ label: "Tytuł" }),
            description: fields.text({ label: "Opis", multiline: true }),
          }),
          { label: "Usługi", itemLabel: (p) => p.fields.title.value },
        ),
      },
    }),

    clients: singleton({
      label: "Klienci",
      path: "src/content/settings/clients",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({ label: "Nazwa (pełna)" }),
            shortName: fields.text({
              label: "Krótka nazwa (pasek credibility)",
            }),
            logo: fields.text({ label: "Logo (ścieżka, opcjonalnie)" }),
            featured: fields.checkbox({
              label: "Wyróżniony (pasek na górze)",
              defaultValue: false,
            }),
          }),
          { label: "Klienci", itemLabel: (p) => p.fields.name.value },
        ),
      },
    }),
  },
});

import fs from "node:fs";
import path from "node:path";

/**
 * Treść strony jako dane w repo, edytowalne przez Keystatic (singletony Site /
 * Services / Clients → pliki JSON w src/content/settings). Ten moduł jest
 * SERWEROWY (czyta pliki przez fs) — nie importuj go w komponentach klienckich.
 * Cal link pozostaje z env (NEXT_PUBLIC_CAL_LINK), zgodnie z Etapem 7.
 */

const SETTINGS_DIR = path.join(process.cwd(), "src/content/settings");

function readJson<T>(file: string): T {
  return JSON.parse(
    fs.readFileSync(path.join(SETTINGS_DIR, file), "utf8"),
  ) as T;
}

type SiteJson = {
  hero: {
    eyebrow: string;
    subline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    // Kadrowanie zdjęcia hero (PANEL 3) — opcjonalne, z fallbackiem w hero.tsx.
    image?: string | null;
    positionX?: number;
    positionY?: number;
    scale?: number;
  };
  numbers: { projects: string; brands: string };
  aiWorkflow: string;
  contact: {
    email: string;
    phone: string;
    availability: string[];
    cvHref: string;
  };
  seo: { defaultTitle: string; defaultDescription: string };
};

type ServicesJson = { items: Array<{ title: string; description: string }> };
type ClientsJson = {
  items: Array<{
    name: string;
    shortName: string;
    logo: string | null;
    featured: boolean;
  }>;
};
type TestimonialsJson = {
  items: Array<{
    name: string;
    role: string;
    quote: string;
    image?: string | null;
  }>;
};

const site = readJson<SiteJson>("site.json");
const services = readJson<ServicesJson>("services.json");
const clients = readJson<ClientsJson>("clients.json");
const testimonials = readJson<TestimonialsJson>("testimonials.json");

/** Czy plik (ścieżka względem /public) istnieje — render obrazu vs placeholder. */
function publicAssetExists(src?: string | null): boolean {
  if (!src || src.trim() === "") return false;
  return fs.existsSync(
    path.join(process.cwd(), "public", src.replace(/^\//, "")),
  );
}

export const LOCATION = "Katowice, PL";

/** Hero — eyebrow, subline (z tokenem {lata}), etykiety CTA, kadrowanie zdjęcia. */
export const HERO = site.hero;

/** Services (sek. 8.4) — 6 obszarów. */
export const SERVICES = services.items;

/** Testimoniale (N1) — opinie klientów; treść + popiersie podmieniane w Keystatic.
 *  imageExists liczone w buildzie (fs) → render <Image> albo placeholder „FOTO". */
export const TESTIMONIALS = testimonials.items.map((t) => ({
  name: t.name,
  role: t.role,
  quote: t.quote,
  image: t.image ?? null,
  imageExists: publicAssetExists(t.image),
}));

/** AI-Augmented Workflow (sek. 8.5) — jeden akapit. */
export const AI_WORKFLOW_PARAGRAPH = site.aiWorkflow;

/** Liczby (sek. 8.6) — lata liczone osobno z experience.ts. */
export const STATS: Array<{ value: string; label: string }> = [
  { value: site.numbers.projects, label: "Projektów" },
  { value: site.numbers.brands, label: "Organizacji" },
];

/** Credibility strip — wyróżnieni klienci (krótka nazwa do logotypu). */
export const CREDIBILITY_CLIENTS: string[] = clients.items
  .filter((c) => c.featured)
  .map((c) => c.shortName || c.name);

/** Pełna lista klientów (sek. 8.7) — nazwy formalne. */
export const ALL_CLIENTS: string[] = clients.items.map((c) => c.name);

/** Domyślne SEO (fallback metadanych). */
export const SEO_DEFAULT = site.seo;

/** Kontakt (sek. 8.8). Cal link z env; reszta z CMS. */
export const CONTACT = {
  email: site.contact.email,
  phone: site.contact.phone,
  calUrl: process.env.NEXT_PUBLIC_CAL_LINK || "#",
  cvHref: site.contact.cvHref,
  availability: site.contact.availability,
};

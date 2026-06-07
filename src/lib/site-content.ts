import fs from "node:fs";
import path from "node:path";
import siteJson from "@/content/settings/site.json";
import servicesJson from "@/content/settings/services.json";
import clientsJson from "@/content/settings/clients.json";
import testimonialsJson from "@/content/settings/testimonials.json";

/**
 * Treść strony jako dane w repo, edytowalne przez Keystatic (singletony Site /
 * Services / Clients → pliki JSON w src/content/settings).
 *
 * Pliki są wczytywane przez STATYCZNE importy JSON — webpack pakuje je do
 * bundla w buildzie. (Wcześniej fs.readFileSync(process.cwd()/src/content/...)
 * padał ENOENT na trasach dynamicznych w funkcji serverless na Vercel — np.
 * /keystatic, które przechodzi przez root layout importujący ten moduł — bo
 * pliki treści nie były trace'owane do bundla funkcji.)
 *
 * Cal link pozostaje z env (NEXT_PUBLIC_CAL_LINK), zgodnie z Etapem 7.
 */

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
  numbers: {
    experience: string;
    projects: string;
    clients: string;
  };
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
    // Rozmiar logo w % (20–200, domyślnie 100). Skaluje wysokość w pasku zaufania.
    logoSize?: number;
    featured: boolean;
  }>;
};
type TestimonialsJson = {
  items: Array<{
    name: string;
    // Lista ról/stanowisk (jedna na linię). Starsze wpisy mogą mieć pojedynczy
    // string `role` — loader normalizuje oba do tablicy.
    roles?: string[];
    role?: string;
    quote: string;
    image?: string | null;
  }>;
};

const site = siteJson as SiteJson;
const services = servicesJson as ServicesJson;
const clients = clientsJson as ClientsJson;
const testimonials = testimonialsJson as TestimonialsJson;

/** Czy plik (ścieżka względem /public) istnieje — render obrazu vs placeholder.
 *  fs.existsSync nie rzuca (zwraca false dla braku), więc jest bezpieczny także
 *  na trasach dynamicznych; liczony build-time dla stron statycznych. */
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
  // Normalizacja do tablicy: nowy model `roles[]` albo starszy pojedynczy `role`.
  roles: (t.roles ?? (t.role ? [t.role] : [])).filter(
    (r) => r && r.trim() !== "",
  ),
  quote: t.quote,
  image: t.image ?? null,
  imageExists: publicAssetExists(t.image),
}));

/** Liczby (sek. 8.6). Opcjonalny prefix (np. „Ponad") renderowany nad liczbą. */
export const STATS: Array<{
  value: string;
  label: string;
  prefix?: string;
  // Jednostka eksponowana razem z liczbą w kolorze akcentu (np. „14 LAT").
  unit?: string;
}> = [
  {
    value: site.numbers.experience,
    unit: "LAT",
    // \n wymusza łamanie na dwie linie pod akcentem „14 LAT".
    label: "doświadczenia\nprojektowego",
    prefix: "Ponad",
  },
  { value: site.numbers.projects, label: "Zrealizowanych projektów" },
  { value: site.numbers.clients, label: "Zadowolonych klientów" },
];

/** Credibility strip — wyróżnieni klienci: nazwa + logo (SVG) z flagą istnienia.
 *  logoExists liczone w buildzie (fs) → render <Image> albo fallback tekstowy. */
export const CREDIBILITY = clients.items
  .filter((c) => c.featured)
  .map((c) => ({
    name: c.shortName || c.name,
    logo: c.logo ?? null,
    logoExists: publicAssetExists(c.logo),
    // Rozmiar logo (%) — clamp 20–200, domyślnie 100; skaluje wysokość w pasku.
    logoSize: Math.min(200, Math.max(20, c.logoSize ?? 100)),
  }));

/** Pełna lista klientów (sek. 8.7) — nazwy formalne. */
export const ALL_CLIENTS: string[] = clients.items.map((c) => c.name);

/** Domyślne SEO (fallback metadanych). */
export const SEO_DEFAULT = site.seo;

/** Kontakt (sek. 8.8). Cal link z env; reszta z CMS. */
export const CONTACT = {
  email: site.contact.email,
  phone: site.contact.phone,
  calUrl:
    process.env.NEXT_PUBLIC_CAL_LINK || "https://cal.com/eu/michal-stezaly",
  cvHref: site.contact.cvHref,
  availability: site.contact.availability,
};

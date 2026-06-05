/**
 * Treść landingu jako typowany TS w repo (MVP, bez CMS — masterprompt sek. 10).
 * Źródło: SZABLON_TRESCI.md. Placeholdery kontaktu wymienia właściciel.
 */

export const LOCATION = "Katowice, PL";

/** Sekcja 8.4 — Services. 6 obszarów, bez ikon. */
export const SERVICES: Array<{ title: string; body: string }> = [
  {
    title: "Social Media Systems",
    body: "Spójne systemy graficzne do mediów społecznościowych: szablony, key visuale i adaptacje, które trzymają markę rozpoznawalną w każdym poście.",
  },
  {
    title: "Event Branding",
    body: "Identyfikacja i oprawa wizualna wydarzeń sportowych i biznesowych — od key visuala po materiały na obiekcie i w digitalu.",
  },
  {
    title: "Sponsorship & Pitch Decks",
    body: "Prezentacje sponsorskie i ofertowe, które porządkują argumenty i wyglądają na tyle dobrze, że pomagają domykać rozmowy.",
  },
  {
    title: "Identity & Campaign Design",
    body: "Systemy identyfikacji i kampanie wizualne działające spójnie na wielu nośnikach.",
  },
  {
    title: "Print & Promotional Materials",
    body: "Materiały drukowane i promocyjne przygotowane do produkcji — od koncepcji po pliki gotowe do druku.",
  },
  {
    title: "AI-Augmented Visual Production",
    body: "AI do przyspieszenia produkcji wizualnej: moodboardy, eksploracja wariantów, assety pomocnicze — przy zachowaniu kontroli jakości po stronie projektanta.",
  },
];

/** Sekcja 8.5 — jeden mocny akapit o AI w workflow. */
export const AI_WORKFLOW_PARAGRAPH =
  "AI jest częścią mojego warsztatu, nie jego zastępstwem. Wykorzystuję je tam, gdzie realnie przyspiesza pracę — na etapie ideacji, przy moodboardach, eksploracji wariantów i tworzeniu assetów pomocniczych. Dzięki temu szybciej docieram do dobrych kierunków, a więcej czasu zostaje na to, co najważniejsze: koncepcję, decyzje projektowe i jakość finalnego efektu. Selekcja, dopracowanie i odpowiedzialność za wynik zawsze pozostają po mojej stronie.";

/** Sekcja 8.6 — liczby (wartości tekstowe; lata liczone osobno z experience.ts). */
export const STATS: Array<{ value: string; label: string }> = [
  { value: "100+", label: "Projektów" },
  { value: "20+", label: "Organizacji" },
];

/** Credibility strip — 6 najmocniejszych (mono, placeholder tekstowy). */
export const CREDIBILITY_CLIENTS: string[] = [
  "IBU",
  "SPORTFIVE",
  "Stadion Śląski",
  "GKS Katowice",
  "Polski Związek Biathlonu",
  "Węglokoks",
];

/** Sekcja 8.7 — pełna lista klientów. */
export const ALL_CLIENTS: string[] = [
  "International Biathlon Union",
  "Polski Związek Biathlonu",
  "SPORTFIVE Polska",
  "Stadion Śląski",
  "GKS Katowice",
  "Węglokoks",
  "Shark Entertainment",
  "SportValue",
  "Coerver Coaching Poland",
  "Football Code",
  "Kancelaria Jara Drapała",
];

/** Sekcja 8.8 — kontakt. PLACEHOLDERY — właściciel podmienia na realne dane. */
export const CONTACT = {
  email: "twoj@email.pl", // [PLACEHOLDER]
  phone: "+48 xxx xxx xxx", // [PLACEHOLDER]
  calUrl: "#", // [PLACEHOLDER — link Cal.com]
  cvHref: "/cv.pdf", // [PLACEHOLDER — właściciel wrzuci /public/cv.pdf]
  availability: ["zdalnie", "hybrydowo", "B2B", "UoP", "projektowo"],
};

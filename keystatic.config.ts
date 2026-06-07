import { config, fields, collection, singleton } from "@keystatic/core";
import { CATEGORIES } from "./src/lib/categories";
import { GALLERY_CATEGORIES } from "./src/lib/gallery-categories";

/**
 * Pole wyboru koloru tekstu (Biały / Limonkowy / Szary). Wartości spójne z
 * src/lib/text-color.ts. Domyślnie biały; eyebrow sekcji ma własny default „lime".
 */
function textColorField(
  defaultValue: "white" | "lime" | "grey" = "white",
) {
  return fields.select({
    label: "Kolor tekstu",
    description:
      "Biały = domyślny. Limonkowy = akcent. Szary = drugoplanowy.",
    options: [
      { label: "Biały", value: "white" },
      { label: "Limonkowy", value: "lime" },
      { label: "Szary", value: "grey" },
    ],
    defaultValue,
  });
}

/**
 * Keystatic — Git-based CMS. Treść nadal żyje w repo (src/content/projekty/*.mdx
 * + src/content/settings/*.json). Keystatic to TYLKO UI do edycji tych plików;
 * strona renderuje przez własny loader (gray-matter / fs), bez zależności runtime
 * od Keystatic.
 *
 * Tryb: local w dev (panel bez logowania), github na produkcji (OAuth).
 *
 * Etykiety (label) i opisy (description) pól pisane są po polsku i zrozumiale dla
 * osoby nietechnicznej — opis mówi WPROST co wpisać w dane pole.
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
      label: "Case Studies",
      slugField: "title",
      path: "src/content/projekty/*",
      format: { contentField: "content" },
      entryLayout: "content",
      // Kolumny listy: kategoria → klient → rok, a kolumna slug (title) na końcu.
      columns: ["category", "client", "year", "title"],
      schema: {
        title: fields.slug({
          name: {
            label: "Tytuł projektu",
            description: "Nazwa projektu wyświetlana na stronie i liście prac.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Adres URL projektu",
            description:
              "Np. gks-katowice-social-media (małe litery, myślniki). To część adresu /projekty/[adres].",
          },
        }),
        client: fields.text({
          label: "Klient",
          description: "Nazwa klienta lub organizacji.",
          validation: { isRequired: true },
        }),
        year: fields.text({
          label: "Rok realizacji",
          // Text (nie integer) — integer renderuje się z separatorem tysięcy
          // („2 026"). Rok to czterocyfrowa liczba bez formatowania.
          description: "Np. 2024 (czterocyfrowy rok, bez separatorów).",
          validation: { isRequired: true, length: { min: 4, max: 4 } },
        }),
        order: fields.integer({
          label: "Kolejność",
          description:
            "Liczba określa kolejność na liście. 1 = pierwszy, 2 = drugi itd.",
          defaultValue: 99,
        }),
        featured: fields.checkbox({
          label: "Wyróżniony na stronie głównej",
          description:
            "Zaznacz żeby projekt pokazał się w sekcji „Wybrane realizacje” na stronie głównej.",
          defaultValue: false,
        }),
        displayType: fields.select({
          label: "Typ podstrony",
          description:
            "Case study = pełna podstrona z opisem i treścią. Galeria = lekka strona głównie ze zdjęciami.",
          options: [
            { label: "Case study (pełny)", value: "case-study" },
            { label: "Galeria (lekki)", value: "gallery" },
          ],
          defaultValue: "case-study",
        }),
        category: fields.select({
          label: "Kategoria",
          description:
            "Branża / typ projektu — używana do filtrowania na liście projektów.",
          options: CATEGORIES.map((c) => ({ label: c.label, value: c.slug })),
          defaultValue: "inne",
        }),
        scope: fields.text({
          label: "Zakres prac (scope)",
          description:
            "Krótko, czego dotyczył projekt. Np. „Identyfikacja wizualna, social media”.",
        }),
        deliverables: fields.array(
          fields.text({
            label: "Pozycja",
            description: "Jedna oddana rzecz, np. „Księga znaku”.",
          }),
          {
            label: "Lista deliverables (co oddano)",
            description:
              "Konkretne rzeczy oddane klientowi. Dodawaj po jednej pozycji. Przeciągnij, żeby zmienić kolejność.",
            itemLabel: (p) => p.value || "pozycja",
          },
        ),
        role: fields.text({
          label: "Twoja rola",
          description: "Np. „Senior Graphic Designer”, „Art Director”.",
        }),
        context: fields.text({
          label: "Kontekst (1 zdanie)",
          description: "Jedno zdanie tła: kim jest klient i jaka była sytuacja.",
          multiline: true,
        }),
        description: fields.text({
          label: "Krótki opis (2–4 zdania)",
          description:
            "Zwięzły opis projektu pokazywany na podstronie i w podglądach.",
          multiline: true,
        }),
        challenge: fields.text({
          label: "Wyzwanie",
          description: "1-2 zdania o problemie który rozwiązywał projekt",
          multiline: true,
        }),
        concept: fields.text({
          label: "Koncepcja",
          description: "1-2 zdania o podejściu projektowym",
          multiline: true,
        }),
        process: fields.text({
          label: "Proces projektowy",
          description: "Jeden akapit o wyzwaniach i decyzjach. Bez bulletów.",
          multiline: true,
        }),
        effect: fields.text({
          label: "Rezultat",
          description: "1-2 zdania o rezultacie projektu",
          multiline: true,
        }),
        tag: fields.text({
          label: "Tag (powiązane projekty)",
          description:
            "Wspólne słowo-klucz łączące powiązane projekty (np. „gks-katowice”). Projekty z tym samym tagiem linkują się wzajemnie.",
        }),
        cover: fields.object(
          {
            src: fields.image({
              label: "Plik zdjęcia",
              description:
                "Wgraj plik z dysku. Zapis do public/projekty. (Przed uploadem warto skompresować — patrz /admin/compress.)",
              directory: "public/projekty",
              publicPath: "/projekty",
            }),
            alt: fields.text({
              label: "Opis zdjęcia (alt)",
              description:
                "Krótki opis co jest na zdjęciu — dla dostępności i Google.",
              validation: { isRequired: true },
            }),
          },
          {
            label: "Zdjęcie okładkowe (3:2)",
            description:
              "Główne zdjęcie projektu widoczne na liście. Format 3:2.",
          },
        ),
        gallery: fields.array(
          fields.object({
            src: fields.image({
              label: "Plik zdjęcia",
              description: "Wgraj plik z dysku. Zapis do public/projekty.",
              directory: "public/projekty",
              publicPath: "/projekty",
            }),
            alt: fields.text({
              label: "Opis zdjęcia (alt)",
              description: "Krótki opis co jest na zdjęciu.",
            }),
          }),
          {
            label: "Galeria zdjęć",
            description:
              "Przeciągnij, żeby zmienić kolejność. Pierwsze zdjęcie = okładka.",
            itemLabel: (p) => p.fields.alt.value || "zdjęcie",
          },
        ),
        seo: fields.object(
          {
            title: fields.text({
              label: "Tytuł SEO",
              description: "Puste = tytuł projektu.",
            }),
            description: fields.text({
              label: "Opis SEO",
              description: "Puste = kontekst projektu. Ok. 150 znaków.",
              multiline: true,
            }),
            ogImage: fields.text({
              label: "Obrazek do social media (OG)",
              description:
                "Ścieżka do obrazka pokazywanego przy udostępnianiu linku. Puste = okładka.",
            }),
          },
          {
            label: "SEO (opcjonalne)",
            description:
              "Ustawienia dla Google i social media. Możesz zostawić puste — użyte zostaną dane projektu.",
          },
        ),
        content: fields.mdx({
          label: "Treść podstrony",
          description:
            "Główna treść case study: nagłówki, akapity, zdjęcia. Pole puste dla typu „Galeria”.",
        }),
      },
    }),

    galerie: collection({
      label: "Pozostałe projekty",
      slugField: "title",
      path: "src/content/galerie/*",
      format: { data: "json" },
      // Kolumny listy: kategoria → rok, a kolumna slug/klient (title) na końcu.
      // (W tej kolekcji „klient" = pole title.) Keystatic 0.5 nie ma natywnego
      // UI filtrowania — kolejność kolumn + sort klikiem nagłówka = grupowanie.
      columns: ["category", "year", "title"],
      // Kolejność pól w formularzu = kolejność kluczy: Kategoria → Tytuł/klient
      // (z adresem URL) → Rok → Opis → Kolejność → Zdjęcia. Kategoria pierwsza
      // (grupowanie), pole adresu URL (slug) wraz z tytułem — nie na samej górze.
      schema: {
        category: fields.select({
          label: "Kategoria",
          description: "Grupa, w której pojawi się ten zestaw prac na stronie.",
          options: GALLERY_CATEGORIES.map((c) => ({
            label: c.label,
            value: c.slug,
          })),
          defaultValue: "social-media",
        }),
        title: fields.slug({
          name: {
            label: "Tytuł / klient",
            description: "Nazwa wpisu — najczęściej nazwa klienta.",
            validation: { isRequired: true },
          },
          slug: {
            label: "Adres URL / nazwa pliku",
            description:
              "Np. gks-katowice (małe litery, myślniki). Identyfikator wpisu.",
          },
        }),
        year: fields.text({
          label: "Rok (opcjonalnie)",
          // Text (nie integer) — integer renderuje rok z separatorem tysięcy
          // („2 026"). Rok to czterocyfrowa liczba bez formatowania.
          description: "Np. 2024 (czterocyfrowy rok, bez separatorów).",
        }),
        description: fields.text({
          label: "Opis (1–2 zdania)",
          description: "Krótki opis zestawu prac.",
          multiline: true,
        }),
        showDescription: fields.checkbox({
          label: "Pokaż opis pod galerią",
          description:
            "Odznacz, aby ukryć opis pod zdjęciami na stronie. Domyślnie: pokazany.",
          defaultValue: true,
        }),
        descriptionColor: textColorField("white"),
        order: fields.integer({
          label: "Kolejność w kategorii",
          description:
            "Liczba sortująca — im mniejsza, tym wyżej w swojej kategorii.",
          validation: { isRequired: true },
          defaultValue: 1,
        }),
        images: fields.array(
          fields.object({
            // Upload z dysku. Wszystkie zdjęcia tej kolekcji żyją teraz w jednym
            // drzewie public/galerie/, więc publicPath „/galerie" je obejmuje
            // (po migracji ścieżek). Nowe pliki trafiają do public/galerie/.
            src: fields.image({
              label: "Plik zdjęcia",
              description:
                "Wgraj plik z dysku (oryginalne proporcje). Zapis do public/galerie. Warto skompresować — patrz /admin/compress.",
              directory: "public/galerie",
              publicPath: "/galerie",
            }),
            alt: fields.text({
              label: "Opis zdjęcia (alt)",
              description: "Krótki opis co jest na zdjęciu.",
              validation: { isRequired: true },
            }),
          }),
          {
            label: "Zdjęcia (1–12)",
            description:
              "Przeciągnij, żeby zmienić kolejność. Pierwsze zdjęcie = okładka.",
            itemLabel: (p) => p.fields.alt.value || "zdjęcie",
          },
        ),
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
            eyebrow: fields.text({
              label: "Nadtytuł (eyebrow)",
              description:
                "Mały tekst nad nagłówkiem. Np. „— Projektuję dla sportu i biznesu”.",
            }),
            subline: fields.text({
              label: "Podtytuł (subline)",
              description:
                "Zdanie pod nagłówkiem. Wpisz {lata}, aby wstawić liczbę lat doświadczenia.",
              multiline: true,
            }),
            ctaPrimary: fields.text({
              label: "Przycisk główny — tekst",
              description: "Np. „Porozmawiajmy ↗”.",
            }),
            ctaSecondary: fields.text({
              label: "Przycisk drugi — tekst",
              description: "Np. „Zobacz projekty”.",
            }),
            image: fields.image({
              label: "Zdjęcie hero (tło sekcji)",
              description:
                "Najwygodniej ustawić i wykadrować w wizualnym edytorze: /admin/hero-editor. Tutaj możesz też wgrać plik ręcznie.",
              directory: "public",
              publicPath: "/",
            }),
            positionX: fields.integer({
              label: "Kadr — pozycja pozioma (X)",
              description:
                "0–100%. 50 = środek. Najłatwiej ustawić suwakiem w /admin/hero-editor.",
              defaultValue: 50,
            }),
            positionY: fields.integer({
              label: "Kadr — pozycja pionowa (Y)",
              description:
                "0–100%. 50 = środek. Najłatwiej ustawić suwakiem w /admin/hero-editor.",
              defaultValue: 50,
            }),
            scale: fields.integer({
              label: "Zoom zdjęcia",
              description:
                "100–200%. 100 = bez powiększenia. Najłatwiej ustawić w /admin/hero-editor.",
              defaultValue: 100,
            }),
          },
          {
            label: "Hero (sekcja powitalna)",
            description:
              "Górna sekcja strony głównej. Zdjęcie i kadrowanie najwygodniej ustawić w wizualnym edytorze: /admin/hero-editor.",
          },
        ),
        numbers: fields.object(
          {
            experience: fields.text({
              label: "Lata doświadczenia",
              description: "Np. 14",
            }),
            projects: fields.text({
              label: "Zrealizowanych projektów",
              description: "Np. 1000+",
            }),
            clients: fields.text({
              label: "Zadowolonych klientów",
              description: "Np. 30+",
            }),
            labelColor: textColorField("white"),
          },
          {
            label: "Liczby (statystyki)",
            description:
              "Liczby pokazywane na stronie głównej. „Kolor tekstu” dotyczy etykiet pod liczbami.",
          },
        ),
        // Kolor nadtytułów (eyebrow) sekcji na stronie głównej — domyślnie
        // limonkowy (akcent), żeby zachować obecny wygląd.
        eyebrowColor: textColorField("lime"),
        contact: fields.object(
          {
            email: fields.text({
              label: "E-mail",
              description: "Np. kontakt@twojadomena.pl",
            }),
            phone: fields.text({
              label: "Telefon",
              description: "Np. 668 01 02 62",
            }),
            availability: fields.array(
              fields.text({
                label: "Pozycja",
                description: "Np. „zdalnie” lub „B2B”.",
              }),
              {
                label: "Formy współpracy",
                description:
                  "Dodawaj po jednej pozycji. Przeciągnij, żeby zmienić kolejność.",
                itemLabel: (p) => p.value || "pozycja",
              },
            ),
            cvHref: fields.text({
              label: "Plik CV (ścieżka)",
              description: "Np. /cv.pdf (plik znajduje się w folderze public).",
            }),
          },
          {
            label: "Kontakt",
            description: "Dane kontaktowe pokazywane na stronie.",
          },
        ),
        seo: fields.object(
          {
            defaultTitle: fields.text({
              label: "Domyślny tytuł",
              description:
                "Tytuł strony w wynikach Google i na karcie przeglądarki.",
            }),
            defaultDescription: fields.text({
              label: "Domyślny opis",
              description: "Ok. 150 znaków. Opis w wynikach wyszukiwania.",
              multiline: true,
            }),
          },
          {
            label: "SEO domyślne",
            description:
              "Tytuł i opis strony dla Google, gdy podstrona nie ma własnych.",
          },
        ),
      },
    }),

    services: singleton({
      label: "Specjalizacje",
      path: "src/content/settings/services",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            title: fields.text({
              label: "Tytuł specjalizacji",
              description: "Np. „Identyfikacja wizualna”.",
            }),
            description: fields.text({
              label: "Opis specjalizacji",
              description: "1–2 zdania, co obejmuje.",
              multiline: true,
            }),
            icon: fields.image({
              label: "Ikona (PNG)",
              description:
                "Wgraj plik PNG 48x48px. Zostaw puste żeby użyć domyślnej ikony.",
              directory: "public/ikonySpec",
              publicPath: "/ikonySpec",
            }),
            color: textColorField("white"),
          }),
          {
            label: "Lista specjalizacji",
            description: "Przeciągnij, żeby zmienić kolejność.",
            itemLabel: (p) => p.fields.title.value || "specjalizacja",
          },
        ),
      },
    }),

    testimonials: singleton({
      label: "Opinie klientów",
      path: "src/content/settings/testimonials",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({
              label: "Imię i nazwisko",
              description: "Osoba wystawiająca opinię.",
            }),
            roles: fields.array(
              fields.text({
                label: "Rola / stanowisko",
                description: "Np. „Prezes Zarządu ŁKS Łódź”.",
              }),
              {
                label: "Role / stanowiska",
                description:
                  "Każda rola w osobnej linii. Dodaj kolejną klikając „+”.",
                itemLabel: (p) => p.value || "rola",
              },
            ),
            quote: fields.text({
              label: "Treść opinii",
              description: "Cytat klienta.",
              multiline: true,
            }),
            quoteColor: textColorField("white"),
            image: fields.image({
              label: "Zdjęcie (popiersie)",
              description:
                "Zdjęcie osoby. Najlepiej kwadrat lub portret, twarz wyśrodkowana.",
              directory: "public/opinie",
              publicPath: "/opinie",
            }),
          }),
          {
            label: "Opinie",
            description: "Przeciągnij, żeby zmienić kolejność.",
            itemLabel: (p) => p.fields.name.value || "opinia",
          },
        ),
      },
    }),

    clients: singleton({
      label: "Loga klientów",
      path: "src/content/settings/clients",
      format: { data: "json" },
      schema: {
        items: fields.array(
          fields.object({
            name: fields.text({
              label: "Pełna nazwa",
              description: "Oficjalna nazwa klienta / organizacji.",
            }),
            shortName: fields.text({
              label: "Krótka nazwa",
              description: "Skrócona nazwa do paska zaufania na górze strony.",
            }),
            logo: fields.image({
              label: "Logo (SVG / PNG)",
              description:
                "Plik logo. Najlepiej SVG lub PNG z przezroczystym tłem.",
              directory: "public/klienci",
              publicPath: "/klienci",
            }),
            logoSize: fields.integer({
              label: "Rozmiar logo (%)",
              description:
                "100 = rozmiar standardowy. Zmniejsz jeśli logo jest za duże (np. 70), zwiększ jeśli za małe (np. 130). Zakres: 20–200.",
              defaultValue: 100,
              validation: { isRequired: true, min: 20, max: 200 },
            }),
            featured: fields.checkbox({
              label: "Wyróżniony (pasek na górze)",
              description:
                "Zaznacz, aby logo pojawiło się w pasku zaufania na górze strony.",
              defaultValue: false,
            }),
          }),
          {
            label: "Klienci",
            description: "Przeciągnij, żeby zmienić kolejność.",
            itemLabel: (p) => p.fields.name.value || "klient",
          },
        ),
      },
    }),
  },
});

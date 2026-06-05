# MASTERPROMPT v2.1 (FINAL) — Portfolio Senior Graphic Designera
### Editorial Sports Dark · MVP-first · wersja produkcyjna pod Claude Code

> **Status:** wersja po audycie + z naniesionymi finalnymi decyzjami właściciela. Wszystkie wcześniejsze błędy i over-engineering są skorygowane. To jest dokument referencyjny — żyje w sekcji **Projects** w Claude i jest punktem odniesienia dla każdej rozmowy o tym projekcie. **v2.1 zastępuje v2.**

---

## 0. Jak korzystać z tego dokumentu

- To jest **źródło prawdy**. Jeśli jakakolwiek decyzja jest z nim sprzeczna — wygrywa dokument, chyba że świadomie go zaktualizujemy.
- **[ZABLOKOWANE]** = decyzja podjęta, nie wracamy do niej bez powodu (ochrona przed scope creep).
- Zasada nadrzędna: **najpierw treść, prawa, struktura, mobile, szybkość. Dopiero potem motion, polish, WOW.**
- Druga zasada nadrzędna: **nie płacimy za fonty, grafiki, ikony, zdjęcia ani usługi**, jeśli istnieje dobre darmowe rozwiązanie.

---

## 1. Kontekst

Michał Stężały — Senior Graphic Designer, 14 lat doświadczenia, Katowice. Specjalizacja: komunikacja wizualna dla **sportu i biznesu** — federacje, kluby, eventy, marki B2B; social media, key visuale, sponsorship/pitch decki, materiały drukowane, identyfikacje, AI-augmented visual workflow.

Wybrani klienci/współprace: International Biathlon Union, Polski Związek Biathlonu, SPORTFIVE Polska, Stadion Śląski, GKS Katowice, Węglokoks, Shark Entertainment, SportValue, Coerver Coaching Poland, Football Code, Kancelaria Jara Drapała.

Obecne portfolio stoi na **Adobe Portfolio pod domeną michal-stezaly.pl** — jest zbyt szablonowe i ogranicza kontrolę nad SEO, strukturą, szybkością, wersją językową i jakością prezentacji. Cel: autorska strona wyglądająca jak projekt premium za kilka–kilkanaście tysięcy złotych, zbudowana rozsądnie — bez przepalania pieniędzy, bez płatnych fontów, bez zbędnej infrastruktury, bez efektów zabijających performance.

---

## 2. Główna zasada projektu

Portfolio: szybkie, czytelne, efektowne (nie przeładowane), mocne wizualnie, łatwe do rozwijania, zoptymalizowane pod desktop i mobile, zbudowane pod realne wdrożenie w Claude Code, tanie w utrzymaniu.

**Dwie współrzędne zasady (równoważne):**
1. **MVP-first technicznie:** najpierw stabilne, szybkie, piękne MVP. Żadnych bajerów przed strukturą, contentem, mobile, performance i SEO.
2. **Content & rights first:** o sukcesie decyduje spójna prezentacja realnych prac. Ten wymiar ma równy priorytet z kodem (sekcja 7).

---

## 3. Cel biznesowy i grupy docelowe

Strona **sprzedaje kompetencje**, nie jest galerią obrazków.

- **Primary:** skłonić klienta / agencję / markę sportową do kontaktu.
- **Secondary:** szybko pokazać najlepsze prace i poziom doświadczenia.
- **Tertiary:** pokazać klasyczny warsztat + AI jako przewagę workflow (nie zastępstwo myślenia).

**Test 10 sekund:** po 10 s użytkownik wie: kim jestem, dla kogo projektuję, jakie mam doświadczenie, jakie typy projektów, z kim współpracowałem, jak się skontaktować.

**Prymat odbiorcy [ZABLOKOWANE]:** klient/agencja/marka = grupa nr 1. Rekruter/HR obsłużony minimalnie — krótkie bio + dyskretny link do CV (PDF) w kontakcie/stopce.

**Pomiar [ZABLOKOWANE]:** od dnia launchu mierzymy skuteczność (sekcja 18).

---

## 4. Pozycjonowanie

Marka osobista: **Senior Graphic Designer for Sport & Business.**

Alternatywne claimy: „Visual design for sport, events and business." / „Graphic design for sport brands, federations and B2B." / „Senior graphic designer combining classic craft with AI-augmented workflow." / „Projektuję komunikację wizualną dla sportu i biznesu."

Strona **nie** komunikuje „AI designera od obrazków". Fundament = doświadczenie, warsztat, klienci, realne projekty. AI = przewaga workflow.

---

## 5. Design direction — Editorial Sports Dark

Połączenie: premium sportowego klimatu + editorialowego layoutu + mocnej typografii + ciemnej, eleganckiej kolorystyki + energicznego, ale kontrolowanego akcentu + wysokiej jakości prezentacji projektów.

**Inspiracje:** portfolio światowych designerów, premium sports branding, editorial layouts, federacje sportowe, F1 / NBA / event branding, ciemne dopracowane systemy wizualne.

**Unikać bezwzględnie:** generycznego SaaS looku, fioletowych gradientów AI, glassmorphismu, blobów 3D, przesadnego parallaxu, czegokolwiek wyglądającego jak template 2024/2025, efektów „żeby coś się działo".

---

## 6. Checklista jakości „$10K Website"

Bramki decyzyjne — element, który nie przechodzi, jest upraszczany lub usuwany.

**01. Point of view, not a template [ZABLOKOWANE]:** Editorial Sports Dark.

**02. Typography that does work [ZABLOKOWANE]:**
- **Display: Clash Display** (Fontshare) — charakterny, pewny, sportowo-editorialowy.
- **Body/UI: Switzer** (Fontshare) — czysty, neutralny grotesk, mniej „oklepany" niż General Sans/Satoshi/Inter, świetnie się paruje.
- **Sankcjonowane alternatywy display** (gdyby kierunek miał być rzadszy/inny): Cabinet Grotesk (Fontshare, rzadziej spotykany), Archivo Expanded (bardziej „sport/wide", Google), Fraunces (bardziej „editorial/magazine", Google).
- **Wszystkie fonty self-hostowane** (`next/font/local`) z Fontshare — 100% darmowe komercyjnie (ITF Free Font License), bez atrybucji, bez zależności zewnętrznej.
- **NIE używamy Adobe Fonts jako webfontów** — wymagałyby kitu/CDN Adobe i zależą od aktywnej subskrypcji CC; self-hosted Fontshare jest szybszy, darmowy na zawsze i bez zależności.
- **ZAKAZ: Geist** (domyślny font startupów AI/SaaS — niszczy wyróżnienie) oraz przesyconych Inter/Poppins/Montserrat jako fontów wiodących.

**03. Restrained color system [ZABLOKOWANE]:**
- Deep navy `#0B1220` · Section bg `#0F1A2E` · Surface `#152238`
- Electric lime `#D4FF00` · Off-white `#F5F7FA` · Secondary text `#8B96AB` · Border `#1F2D44`
- **Reguła limu:** akcent, nie dominanta. Użycie: CTA, ważne liczby, hover/active, drobne detale, pojedyncze słowa w nagłówkach. Lime musi spełniać kontrast jako focus-indicator i na `#152238` (sprawdzić).

**04. Hierarchy that breathes:** mocna hierarchia, dużo oddechu. Unikać ścian tekstu, nadmiaru równorzędnych sekcji, nadmiaru małych kart, przypadkowego spacingu, nadmiaru CTA. Każda sekcja ma jedną funkcję: informuje / buduje zaufanie / pokazuje projekty / prowadzi do kontaktu.

**05. Imagery with intent:** patrz sekcja 7. Skrót: **AI-generated imagery cannot compete with portfolio work. It can only frame it.** Żadnych stocków Unsplash/Pexels. AI tylko jako tła, tekstury, mockup environments, klimat — nigdy fałszywe kampanie/realizacje.

**06. Motion that whispers [ZABLOKOWANE]:** subtelne, dopracowane, funkcjonalne. Zero AOS-fade-up na wszystkim, parallaxu na wszystkim, scroll-jackingu, krzykliwych animacji. **Framer Motion. BEZ Lenis** (smooth-scroll szkodzi LCP/CLS i a11y → natywny `scroll-behavior` + IntersectionObserver). **BEZ GSAP** w MVP. **21st.dev: 0 importów na produkcję — tylko inspiracja** (kinetic hero text, marquee z hover-pause, hover states, ewentualnie magnetic CTA budujemy ręcznie). Custom cursor: opcjonalny, trywialny, tylko desktop, off na touch, respektuje `prefers-reduced-motion`, nigdy nie zastępuje `:focus-visible`.

**07. Mobile that is designed, not shrunk:** osobny projekt informacji i interakcji: hero mniejszy i czytelny, CTA full-width, magnetic/cursor off, selected works przeprojektowane na mobile, menu jako bottom sheet / ergonomiczny nav, duże touch-targety, czytelne odstępy, szybkie ładowanie, formularz dostosowany. Testować: 360 / 390–393 / 430 / 768 / desktop.

**08. Invisible expensive stuff:** Lighthouse mobile ≥ 90, desktop ≥ 95, LCP < 2 s, CLS < 0,1, dobra dostępność, poprawne meta, semantyczny HTML, sensowne alt-texty, sitemap, robots.txt, canonical, Open Graph, JSON-LD (gdzie ma sens), keyboard nav, focus states, `prefers-reduced-motion`. **Performance ponad efekt.**

---

## 7. Content, assety i prawa — sekcja o najwyższym priorytecie

**Strategia obrazów [ZABLOKOWANE]:**
- **Jeden** aspect ratio kafli selected works — **4:5 lub 3:2, bez wyjątku** (decyzja przed budową layoutu). 16:9 dla banerów/hero.
- Spójne kadrowanie, jedna rodzina mockupów, social w jednej rodzinie ramek, logotypy klientów monochromatyczne, jeden rytm. Żadnego miksu przypadkowych mockupów.

**Workflow assetów na czas budowy [ZABLOKOWANE — uzgodnione]:**
- Budujemy na **realnych grafikach z obecnego portfolio jako placeholderach** (lepsze niż lorem — pokazują prawdziwy vibe i zachowanie layoutu), w docelowym aspect ratio.
- Właściciel **finalnie wymienia/poprawia grafiki, gdy zobaczy vibe całej strony**. Jeśli coś się „gryzie", produkuje nowe mockupy generatorem obrazów — szybko.
- **Granica AI [ZABLOKOWANE]:** generator do mockup environments, ramek, teł, tekstur i klimatu — czyli do *oprawienia* realnych prac. Nigdy do udawania kampanii/realizacji ani do wizuali mocniejszych niż realne projekty.

**Prawa [ZABLOKOWANE — uzgodnione]:** **cała zawartość obecnego portfolio jest dopuszczona do publicznej prezentacji.** Forma „pracowałem dla / collaborated with" zamiast sugerowania rekomendacji.

**Social proof [DO DOPISANIA]:** zdobyć 1–2 krótkie testimoniale (kontakt w federacji/agencji) — większa dźwignia niż kolejny efekt.

---

## 8. Struktura strony (landing)

Kolejność wspiera prymat klienta i test 10 sekund; sekcje drugorzędne świadomie **kompresujemy**.

1. **Hero** — kim jestem i dla kogo. Mocny headline, krótki opis, CTA do kontaktu + CTA do projektów, subtelne AI-tło, **bez wideo w MVP**, max 1 mocny efekt (kinetic text).
   - Headline: *Senior Graphic Designer for Sport & Business.*
   - Pod spodem: *Projektuję komunikację wizualną dla klubów, federacji, eventów i marek B2B — łącząc 14 lat doświadczenia z nowoczesnym AI-augmented workflow.*
2. **Credibility strip / clients** — wysoko: IBU, SPORTFIVE, Stadion Śląski, GKS Katowice, Polski Związek Biathlonu, Węglokoks. Pasek / marquee (hover-pause) / grid, logotypy mono, bez przesady z ruchem.
3. **Selected Work** — najważniejsza sekcja. **8–10 najlepszych.** Editorial tile: cover (jeden ratio), klient, typ, rok, krótki tag, hover state. Asymetria OK, ale visual archive / editorial, nie startup-bento.
4. **What I Design / Services** — bez taniej sprzedażówki: Social Media Systems, Event Branding, Sponsorship & Pitch Decks, Identity & Campaign Design, Print & Promotional Materials, AI-Augmented Visual Production. Każda krótko i po ludzku.
5. **AI-Augmented Workflow** — **jeden mocny akapit**, profesjonalnie: AI na etapie ideacji, moodboardy, eksploracja wariantów, assety pomocnicze; finalna selekcja i jakość po stronie doświadczenia. Zaufanie, nie hype.
6. **Experience / Numbers** — **lata doświadczenia liczone DYNAMICZNIE od roku startu działalności = 2012** (`obecny_rok − 2012`, dziś 14+); liczba aktualizuje się sama co roku, NIGDY nie hardkodować. Dalej: 100+ projektów, 20+ marek/organizacji, sport + B2B, długofalowe współprace. Tylko wiarygodne liczby. **[ZABLOKOWANE: rok startu działalności = 2012]**
7. **Full Client List** — elegancki grid tekstowy/logotypowy (skompresowany).
8. **Contact** — mail, telefon, Cal.com, formularz, info o dostępności (remote / hybrid / B2B / UOP / project-based), dyskretny link do CV (PDF).

---

## 9. Strony projektów

Osobna strona: `/projekty/[slug]`. Bez deep case studies na start, ale **nie same obrazki bez kontekstu**.

Minimalna struktura: Client, Year, Scope, Deliverables, Role, Context, krótki opis, galeria. Opis krótki, konkretny, biznesowy.

> **Client:** GKS Katowice · **Year:** 2024 · **Scope:** Social media / Matchday graphics · **Deliverables:** Key visuals, social assets, digital adaptations · **Role:** Concept, design, adaptation · **Context:** Visual communication for matchday and promotional content.

---

## 10. Stack technologiczny [ZABLOKOWANE]

| Warstwa | Wybór | Uwaga |
|---|---|---|
| Framework | **Next.js 15 / App Router** | SSG gdzie się da |
| Język | **TypeScript** | |
| Style | **Tailwind CSS** | |
| Komponenty | **shadcn/ui — punktowo** | Tylko prymitywy formularza + ewentualnie Sheet/Drawer na mobile nav; resztę editorialu ręcznie |
| **Treść / CMS** | **MDX / typowany TS w repo (MVP). BEZ Sanity.** | Keystatic (darmowy, Git-based) ewentualnie po launchu |
| Fonty | **Clash Display + Switzer (Fontshare), self-hosted** | Darmowe komercyjnie; bez Adobe Fonts |
| Motion | **Framer Motion. BEZ Lenis. BEZ GSAP.** | |
| i18n | **next-intl — szkielet tak, treść MVP jednojęzyczna (PL)** | EN = faza po launchu |
| **Hosting** | **Netlify (Free)** | Darmowy plan **dozwala użycie komercyjne** (Vercel Hobby — nie). **W trakcie budowy deploy na subdomenie `*.netlify.app`** |
| Formularz | **Resend (Free)** | Wymaga jednorazowej weryfikacji domeny (SPF/DKIM w DNS) |
| Antyspam | **Cloudflare Turnstile (Free) + honeypot + rate limiting** | |
| Umawianie | **Cal.com (Free)** | |
| Analityka | **Cloudflare Web Analytics (Free, cookieless)** | Niezależna od hostingu, privacy-first → bez bannera cookies dla analityki |
| Repo | **GitHub (Free)** | **Commitujemy wcześnie i często** |
| **Domena** | **michal-stezaly.pl (OVH)** | **Obecnie żywe portfolio na Adobe Portfolio. NIE ruszamy DNS aż do launchu** (sekcja 12, Etap 11) |

**Założenie kosztowe:** preferuj darmowe. Nie kupuj serwera, fonta, drogich narzędzi bez uzasadnienia. Nie komplikuj stacku.

---

## 11. Zasady pracy z Claude Code

- Praca **etapami** — małe, zamknięte kroki. Najpierw plan (Etap 0), potem realizacja. Nie budować całości naraz.
- Każdy etap kończy się: podsumowaniem, listą zmian, listą plików zmienionych/dodanych, „co sprawdzić", sugestią następnego kroku.
- **Git: commit po każdym domkniętym etapie** (i częściej).
- **Deploy wcześnie — ale na subdomenie `*.netlify.app`.** **Nie wolno przepinać michal-stezaly.pl, dopóki nowa strona nie jest gotowa do launchu** — inaczej zdejmiemy żywe obecne portfolio.
- Nie przechodzić do zaawansowanych animacji, dopóki layout, content structure, responsive i performance basics nie są gotowe.
- Budować na realnych grafikach z obecnego portfolio (placeholdery o docelowym ratio), nie na lorem ipsum.

---

## 12. Etapy realizacji

**Tor równoległy (przez cały czas, prowadzi właściciel): content & assety.** Wybór/produkcja coverów (jeden ratio), opisy PL, mono-logotypy, liczby, testimoniale. Build nie wyprzedza treści — min. 4–6 projektów gotowych zanim ruszy Etap 3. (Prawa do prac są już potwierdzone — sekcja 7.)

- **Etap 0 — Audyt i plan (BEZ kodu).** Architektura, struktura folderów, model treści (MDX/TS), lista etapów, ryzyka, rekomendacje.
- **Etap 1 — Setup + wczesny deploy na subdomenie.** Next + TS + Tailwind, struktura folderów, linting, formatowanie, konfiguracja fontów (Clash Display + Switzer, self-hosted), bazowe tokeny kolorów, **podpięcie repo do Netlify + deploy na `*.netlify.app`.** Bez animacji, bez CMS, bez WOW. **Domeny michal-stezaly.pl NIE dotykamy.**
- **Etap 2 — Design system.** Kolory, typografia, spacing, buttony, cards, section wrappers, grid, layout primitives, responsive rules, focus states.
- **Etap 3 — Landing statyczny na realnym contencie (PL).** Hero, credibility strip, selected work, services, AI workflow (1 akapit), numbers, clients, contact. Treść/MDX zamiast Sanity. Cel: storytelling, hierarchia, desktop, mobile.
- **Etap 5 — Strony projektów.** Routing `/projekty/[slug]`, galeria, opis, metadata, next/image, SEO per projekt, OG (na start = cover jako OG), powiązane projekty (manualny tag).
- **Etap 7 — Formularz i kontakt + RODO.** Formularz, Resend, Turnstile, honeypot, rate limiting, walidacja, komunikaty, link Cal.com, mail, telefon, **checkbox zgody + strona polityki prywatności**, minimalny privacy-first baner cookies.
- **Etap 9 — Performance / a11y / SEO.** Lighthouse, Core Web Vitals, semantic HTML, focus states, keyboard nav, alt-texty, aria-labels, sitemap, robots.txt, canonical, JSON-LD, OG, Twitter Cards, **optymalizacja obrazów (resize/kompresja/AVIF-WebP — kluczowe dla LCP)**, bundle analysis, **Cloudflare Web Analytics.** Cele: mobile ≥ 90, desktop ≥ 95.
- **Etap 8 — Lekki motion.** 1 typ wejścia sekcji, hover states, marquee z hover-pause, kinetic text w hero, ewentualnie magnetic CTA (desktop). Respektować `prefers-reduced-motion`. Jeden efekt na raz.
- **Etap 10 — Migracja domeny i deployment (LAUNCH).**
  - Dopiero teraz **przepięcie michal-stezaly.pl (apex + www) z Adobe Portfolio na Netlify** (rekordy DNS w OVH lub delegacja DNS do Netlify), SSL.
  - **Wybór wersji kanonicznej** (apex vs `www`) + 301 dla drugiej.
  - **301 redirecty ze starych adresów Adobe Portfolio** na nowe `/projekty/[slug]`, by nie stracić SEO.
  - Environment variables (Resend, Turnstile, Cal.com), test formularza, test mobile, test SEO, **nowy sitemap zgłoszony w Google Search Console**, backup treści.
  - Zasada: stare portfolio znika dopiero, gdy nowe działa pod docelową domeną.
- **Etap 11 — Final QA.** Chrome, Safari, Firefox, iOS Safari, Android Chrome, desktop/tablet/mobile, formularz, meta, linki, 404, loading/empty states, a11y, performance.

**Fazy po launchu:** **Etap 6 — i18n PL/EN** (next-intl, routing językowy, tłumaczenia naturalne, metadata per język, hreflang, language switcher) → **Etap 4 — CMS Keystatic** (opcjonalnie, jeśli edycja przez pliki uwiera) → **więcej polish/motion** wg pomiarów.

---

## 13. Zasady antyprzeładowania [ZABLOKOWANE]

Limity MVP: max 1 mocny efekt w hero · max 1 marquee · max 1 typ animacji wejścia · **0 importów z 21st.dev na produkcję** · 0 efektów 3D · 0 ciężkiego wideo · 0 nadmiarowego parallaxu · **0 Lenis** · 0 GSAP. Jeśli coś nie poprawia sprzedaży, czytelności, doświadczenia albo jakości prezentacji prac — **usunąć.**

---

## 14. Content guidelines

Ton: profesjonalny, konkretny, pewny siebie; bez korpo-bełkotu, bez hype'u AI, bez infantylnego języka; lekko premium; zrozumiały dla klienta, agencji i HR. Copy podkreśla: doświadczenie, specjalizację (sport + B2B), realnych klientów, visual craft, AI jako przewagę workflow, gotowość do współpracy.

---

## 15. SEO

Frazy/kierunki: graphic designer sport, graphic designer Poland, senior graphic designer, sports graphic designer, event branding designer, social media designer, pitch deck designer, projektant graficzny sport, projektant graficzny Katowice, grafik sportowy, projektowanie social media, portfolio graphic designer. **Nie upychać fraz.** SEO wynika ze struktury, tytułów, opisów i semantyki. **Przy migracji domeny obowiązkowe 301 ze starych URLi** (Etap 10), by zachować dotychczasowe pozycje.

---

## 16. Wersje językowe

Docelowo PL + EN. **MVP startuje jednojęzycznie w PL [ZABLOKOWANE]** (klient lokalny, agencje, kluby, B2B). EN (IBU, SPORTFIVE, kontakty międzynarodowe) jako **Faza 2** zaraz po launchu. Szkielet next-intl stawiamy już w MVP, by retrofit był bezbolesny. EN ma brzmieć naturalnie, nie mechanicznie.

---

## 17. RODO / prywatność [ZABLOKOWANE]

- Strona **polityki prywatności** (`/polityka-prywatnosci`).
- **Checkbox zgody** przy formularzu + informacja o administratorze danych.
- **Baner cookies** minimalny, privacy-first. Analityka cookieless (Cloudflare) → nie wymaga zgody, co upraszcza baner.
- Logi maili Resend hostowane w USA (dla formularza akceptowalne, ujęte w polityce).

---

## 18. Pomiar / analityka [ZABLOKOWANE]

Od launchu śledzimy: odsłony, kliknięcia obu CTA z hero, dojścia do Contact, submit formularza, kliknięcia w Cal.com. Narzędzie: **Cloudflare Web Analytics** (darmowe, cookieless). Pętla „buduję → mierzę → poprawiam".

---

## 19. Rekomendacje kosztowe

**Darmowe i wystarczające:** Netlify Free (~100 GB transferu, 300 min buildów, funkcje serverless — **użycie komercyjne dozwolone**), Resend Free (3 000 maili/mc, 100/dzień, 1 domena), Cloudflare Turnstile, Cal.com Free, Cloudflare Web Analytics, Fontshare/Google Fonts, GitHub Free.

| Pozycja | Koszt |
|---|---|
| Hosting (Netlify Free) | **0 zł** |
| Formularz / antyspam / analityka / Cal.com / fonty / repo | **0 zł** |
| Domena michal-stezaly.pl (OVH, odnowienie) | **~50–170 zł netto/rok** |
| **RAZEM** | **praktycznie tylko koszt odnowienia domeny** |

**Korekta historyczna:** założenie „Vercel Free wystarczy" było błędne (Vercel Hobby zakazuje użycia komercyjnego). Dlatego hosting = Netlify Free. *(Ceny/plany się zmieniają — weryfikować przy starcie.)*

---

## 20. Najważniejsza zasada końcowa

Portfolio ma wyglądać jak projekt za kilka–kilkanaście tysięcy złotych, ale być zbudowane rozsądnie: bez płatnych fontów/grafik/usług, bez zbędnej infrastruktury, bez efektów zabijających performance.

**Najpierw:** treść, prawa, clarity, struktura, mobile, szybkość.
**Dopiero potem:** motion, polish, WOW.

Jeśli element nie podnosi sprzedaży, czytelności, doświadczenia albo jakości prezentacji prac — nie wchodzi do MVP.

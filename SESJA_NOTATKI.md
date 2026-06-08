# Notatki sesji — 2026-06-08

## Stan projektu
Strona działa na https://michal-stezaly.vercel.app (staging).
Launch docelowy na michal-stezaly.pl — wkrótce.

## Ukończone w tej sesji
- Hero: padding, skalowanie tekstów, wyrównanie lewej krawędzi do px-16 (symetria z prawą)
- Stats: wyrównanie liczb do wspólnej linii z hero (64px), usunięcie --hero-left-offset
- Marquee: fix hover-pause tylko na pointer:fine (nie blokuje na mobile/touch)
- LinkedIn: ikonka w nav + "Znajdź mnie na LinkedIn ↗" w kontakcie
- SEO batch: sitemap.ts, canonical, JSON-LD Person+BreadcrumbList, alt hero, title/meta /projekty i case studies
- Cloudflare Web Analytics: skrypt + token w Vercel
- Filtry /projekty: URL query params (?kategoria=), bezpośrednie linki do kategorii
- Usunięto puste wpisy galerii (Koncert, Wydarzenie sportowe)
- Merge gałęzi plakatygks → main (plakaty GKS Katowice)
- Formularz kontaktowy: Turnstile fix (spacja w site key), dodanie domeny w Cloudflare
- Eyebrowy: ujednolicone (Label, lime, jeden styl)
- Tekst eyebrow nad logo: "— Pracowałem min. dla:"
- sameAs JSON-LD: poprawny URL LinkedIn (z myślnikiem), Behance usunięty

## DO ZROBIENIA PRZED LAUNCHEM (techniczne)
1. 301 redirecty ze starych URLi Adobe Portfolio
2. W dniu przepięcia DNS:
   - noindex off w layout.tsx (robots: index, follow)
   - NEXT_PUBLIC_URL=https://michal-stezaly.pl w Vercel
   - vercel --prod --force
   - Zgłoszenie sitemap w Google Search Console
   - Test formularza Resend + SPF/DKIM w OVH
   - Cloudflare Web Analytics aktywne od dnia 1

## DO ZROBIENIA PRZEZ WŁAŚCICIELA
- Dokończyć/usunąć 2 opinie (Gerasimuk IBU, Płaczkowska Superbet)
- Token Cloudflare WA wklejony w Vercel ✅

## PO LAUNCHU (faza 2)
- Strona /o-mnie (E-E-A-T)
- Wersja EN (next-intl, szkielet już w repo)
- Landingi usługowe (/uslugi/branding-sportowy itp.)
- CMS Keystatic — ewentualna rozbudowa
- Więcej motion/polish wg pomiarów

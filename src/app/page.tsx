import Link from "next/link";
import { getFeaturedProjects } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

// Lata doświadczenia liczone DYNAMICZNIE od 2012 — nigdy hardkodowane
// (masterprompt sek. 8.6 [ZABLOKOWANE: rok startu = 2012]).
const YEARS_OF_EXPERIENCE = new Date().getFullYear() - 2012;

export default function Home() {
  const featured = getFeaturedProjects();

  return (
    <>
      <SiteHeader />

      <main>
        {/* HERO */}
        <section className="mx-auto max-w-6xl px-5 pt-20 pb-16">
          <p className="font-display text-lime text-sm tracking-[0.2em] uppercase">
            Portfolio dla sportu i biznesu
          </p>
          <h1 className="font-display text-ink mt-5 max-w-4xl text-5xl leading-[1.05] font-semibold sm:text-6xl">
            Senior Graphic Designer for{" "}
            <span className="text-lime">Sport &amp; Business</span>.
          </h1>
          <p className="text-muted mt-6 max-w-2xl text-lg">
            Projektuję komunikację wizualną dla klubów, federacji, eventów i
            marek B2B — łącząc {YEARS_OF_EXPERIENCE} lat doświadczenia z
            nowoczesnym AI-augmented workflow.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              href="/#kontakt"
              className="bg-lime text-navy rounded-full px-6 py-3 font-medium hover:opacity-90"
            >
              Skontaktuj się
            </Link>
            <Link
              href="/projekty"
              className="border-border text-ink hover:border-muted rounded-full border px-6 py-3 font-medium"
            >
              Zobacz wszystkie projekty
            </Link>
          </div>
        </section>

        {/* SELECTED WORK (featured:true, bez filtrów) */}
        <section className="mx-auto max-w-6xl px-5 py-12">
          <div className="flex items-end justify-between gap-4">
            <h2 className="font-display text-ink text-3xl font-semibold">
              Wybrane projekty
            </h2>
            <Link
              href="/projekty"
              className="text-lime text-sm hover:underline"
            >
              Zobacz wszystkie →
            </Link>
          </div>

          {featured.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {featured.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          ) : (
            <p className="text-muted mt-8">
              Brak projektów oznaczonych jako <code>featured</code>.
            </p>
          )}
        </section>

        {/* KONTAKT — placeholder kotwicy (pełna sekcja: Etap 7) */}
        <section id="kontakt" className="mx-auto max-w-6xl px-5 py-12">
          <h2 className="font-display text-ink text-3xl font-semibold">
            Kontakt
          </h2>
          <p className="text-muted mt-4">
            Sekcja kontaktu (formularz, mail, telefon, Cal.com) powstaje w
            Etapie 7.
          </p>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}

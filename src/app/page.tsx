import Link from "next/link";
import { getFeaturedProjects } from "@/lib/content";
import { ProjectCard } from "@/components/project-card";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { Button } from "@/components/ui/button";
import { H1, H2, H3, Lead, Label, Body } from "@/components/ui/typography";

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
        <Section>
          <Container>
            <Label>Portfolio dla sportu i biznesu</Label>
            <H1 className="mt-5 max-w-4xl">
              Senior Graphic Designer for{" "}
              <span className="text-lime">Sport &amp; Business</span>.
            </H1>
            <Lead className="mt-6 max-w-2xl">
              Projektuję komunikację wizualną dla klubów, federacji, eventów i
              marek B2B — łącząc {YEARS_OF_EXPERIENCE} lat doświadczenia z
              nowoczesnym AI-augmented workflow.
            </Lead>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/#kontakt" variant="primary">
                Skontaktuj się
              </Button>
              <Button href="/projekty" variant="secondary">
                Zobacz wszystkie projekty
              </Button>
            </div>
          </Container>
        </Section>

        {/* SELECTED WORK (featured:true, bez filtrów) */}
        <Section size="sm" tone="section">
          <Container>
            <div className="flex items-end justify-between gap-4">
              <H2>Wybrane projekty</H2>
              <Link
                href="/projekty"
                className="text-caption text-lime shrink-0 hover:underline"
              >
                Zobacz wszystkie →
              </Link>
            </div>

            {featured.length > 0 ? (
              <div className="gap-x-grid mt-10 grid grid-cols-1 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {featured.map((project) => (
                  <ProjectCard key={project.slug} project={project} />
                ))}
              </div>
            ) : (
              <Body className="text-muted mt-8">
                Brak projektów oznaczonych jako featured.
              </Body>
            )}
          </Container>
        </Section>

        {/* KONTAKT — placeholder kotwicy (pełna sekcja: Etap 7) */}
        <Section id="kontakt" size="sm">
          <Container>
            <H3>Kontakt</H3>
            <Body className="text-muted mt-4">
              Sekcja kontaktu (formularz, mail, telefon, Cal.com) powstaje w
              Etapie 7.
            </Body>
          </Container>
        </Section>
      </main>

      <SiteFooter />
    </>
  );
}

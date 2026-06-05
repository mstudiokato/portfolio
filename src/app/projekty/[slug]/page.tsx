import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { categoryLabel } from "@/lib/categories";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";
import { Container, Section } from "@/components/ui/layout";
import { H1, Lead, Label, Caption } from "@/components/ui/typography";

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.client,
    description: project.context || project.description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  const meta: Array<[string, string]> = [
    ["Klient", project.client],
    ["Rok", String(project.year)],
    ["Scope", project.scope],
    ["Deliverables", project.deliverables.join(", ")],
    ["Rola", project.role],
  ];

  return (
    <>
      <SiteHeader />

      <Section size="sm">
        <Container className="max-w-3xl">
          <Link
            href="/projekty"
            className="text-caption text-lime hover:underline"
          >
            ← Wszystkie projekty
          </Link>

          <Link
            href={`/projekty?kategoria=${project.category}`}
            className="mt-6 block hover:underline"
          >
            <Label>{categoryLabel(project.category)}</Label>
          </Link>
          <H1 className="text-h2 mt-2">{project.client}</H1>

          {project.description ? (
            <Lead className="mt-5">{project.description}</Lead>
          ) : null}

          <dl className="border-border mt-8 grid grid-cols-1 gap-x-8 gap-y-3 border-t pt-6 sm:grid-cols-2">
            {meta
              .filter(([, value]) => value)
              .map(([label, value]) => (
                <div key={label} className="flex flex-col">
                  <dt>
                    <Label className="text-muted">{label}</Label>
                  </dt>
                  <dd className="text-ink mt-1">{value}</dd>
                </div>
              ))}
          </dl>

          <Caption className="mt-10">
            Galeria i pełny opis projektu powstają w Etapie 5.
          </Caption>
        </Container>
      </Section>

      <SiteFooter />
    </>
  );
}

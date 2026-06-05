import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug } from "@/lib/content";
import { categoryLabel } from "@/lib/categories";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

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

      <main className="mx-auto max-w-3xl px-5 pt-14 pb-8">
        <Link href="/projekty" className="text-lime text-sm hover:underline">
          ← Wszystkie projekty
        </Link>

        <Link
          href={`/projekty?kategoria=${project.category}`}
          className="font-display text-lime mt-6 block text-sm tracking-widest uppercase hover:underline"
        >
          {categoryLabel(project.category)}
        </Link>
        <h1 className="font-display text-ink mt-2 text-4xl font-semibold">
          {project.client}
        </h1>

        {project.description ? (
          <p className="text-muted mt-5 text-lg">{project.description}</p>
        ) : null}

        <dl className="border-border mt-8 grid grid-cols-1 gap-x-8 gap-y-3 border-t pt-6 sm:grid-cols-2">
          {meta
            .filter(([, value]) => value)
            .map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <dt className="text-muted text-xs tracking-widest uppercase">
                  {label}
                </dt>
                <dd className="text-ink mt-1">{value}</dd>
              </div>
            ))}
        </dl>

        <p className="text-muted mt-10 text-sm">
          Galeria i pełny opis projektu powstają w Etapie 5.
        </p>
      </main>

      <SiteFooter />
    </>
  );
}

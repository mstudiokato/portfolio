import { NextResponse } from "next/server";
import { getAllProjects } from "@/lib/content";

export const dynamic = "force-dynamic";

export function GET() {
  const projects = getAllProjects();
  const list = projects.map((p, i) => ({
    position: i + 1,
    order: p.order ?? null,
    title: p.title,
    client: p.client,
    year: p.year,
    slug: p.slug,
  }));
  return NextResponse.json(list);
}

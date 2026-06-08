import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/content";

// Bazowy URL: po launchu ustaw NEXT_PUBLIC_URL=https://michal-stezaly.pl.
// Na stagingu domyślnie produkcyjny URL Vercela.
const BASE = (
  process.env.NEXT_PUBLIC_URL || "https://michal-stezaly.vercel.app"
).replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  // Slugi case studies z tej samej funkcji co reszta serwisu (bez hardkodowania).
  const projectPages: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${BASE}/projekty/${p.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: `${BASE}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    {
      url: `${BASE}/projekty`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    ...projectPages,
    {
      url: `${BASE}/polityka-prywatnosci`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}

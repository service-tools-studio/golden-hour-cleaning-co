import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.goldenhourcleaningco.com";

/** Public marketing pages — excludes /book (post-schedule utility page). */
const ROUTES: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/residential", changeFrequency: "weekly", priority: 0.9 },
  { path: "/commercial", changeFrequency: "weekly", priority: 0.9 },
  { path: "/residential/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/residential/quote", changeFrequency: "monthly", priority: 0.8 },
  { path: "/residential/instant-quote", changeFrequency: "monthly", priority: 0.7 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path === "/" ? "" : path}`,
    lastModified,
    changeFrequency,
    priority,
  }));
}

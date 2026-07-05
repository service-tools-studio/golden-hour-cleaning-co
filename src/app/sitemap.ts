import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/data/blogPosts";

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
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/careers", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.7 },
  ...BLOG_POSTS.map((post) => ({
    path: `/blog/${post.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.65,
  })),
  { path: "/residential/services", changeFrequency: "monthly", priority: 0.8 },
  { path: "/residential/services/standard", changeFrequency: "monthly", priority: 0.75 },
  { path: "/residential/services/deep", changeFrequency: "monthly", priority: 0.75 },
  { path: "/residential/services/move-out", changeFrequency: "monthly", priority: 0.75 },
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

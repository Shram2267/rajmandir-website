import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { createPublicClient } from "@/lib/supabase/public";
import { storeSlug } from "@/lib/stores";
import { getPublishedPosts } from "@/lib/blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "/", priority: 1.0, changeFrequency: "daily" },
    { path: "/offers", priority: 0.9, changeFrequency: "daily" },
    { path: "/pamphlets", priority: 0.8, changeFrequency: "weekly" },
    { path: "/stores", priority: 0.8, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/about", priority: 0.5, changeFrequency: "yearly" },
    { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
    { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
    { path: "/terms", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
    { path: "/returns", priority: 0.3, changeFrequency: "yearly" },
  ];

  const base: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${SITE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Per-store landing pages (local SEO).
  let storePages: MetadataRoute.Sitemap = [];
  try {
    const supabase = createPublicClient();
    const { data: stores } = await supabase.from("stores").select("n, name");
    storePages = (stores || []).map((s) => ({
      url: `${SITE_URL}/stores/${storeSlug(s)}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch {
    // If the DB is unreachable at build, still emit the static routes.
  }

  // Blog articles.
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getPublishedPosts();
    blogPages = posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));
  } catch {
    // Ignore blog fetch failures at build time.
  }

  return [...base, ...storePages, ...blogPages];
}

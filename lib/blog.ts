import { createPublicClient } from "@/lib/supabase/public";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  cover_url: string | null;
  published: boolean;
  sort_order: number;
  created_at: string;
};

// Turn a title into a URL-safe slug (used when the admin leaves the slug blank).
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

// Published posts, newest curated order first. Safe for static generation.
export async function getPublishedPosts(): Promise<BlogPost[]> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return (data as BlogPost[]) || [];
}

// A single published post by slug (or null if missing / unpublished).
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const supabase = createPublicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as BlogPost) || null;
}

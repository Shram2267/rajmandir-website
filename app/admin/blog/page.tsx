import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import BlogAdminClient from "./BlogAdminClient";
import type { BlogPost } from "@/lib/blog";

export default async function BlogAdminPage() {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { data: posts } = await supabase
    .from("blog_posts")
    .select("*")
    .order("sort_order", { ascending: true });

  return <BlogAdminClient initialPosts={(posts as BlogPost[]) || []} />;
}

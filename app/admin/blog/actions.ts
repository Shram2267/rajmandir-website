"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { slugify } from "@/lib/blog";

// Upload a cover image to the shared "pamphlets" bucket (blog/ folder).
export async function uploadBlogCover(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "No file selected." };
  }

  const timestamp = Date.now();
  const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const storagePath = `blog/${timestamp}_${safeFilename}`;

  const { error: uploadError } = await supabase.storage
    .from("pamphlets")
    .upload(storagePath, file);

  if (uploadError) {
    console.error("Blog cover upload error:", uploadError);
    return { error: `Failed to upload image: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("pamphlets")
    .getPublicUrl(storagePath);

  return { success: true, url: publicUrlData.publicUrl };
}

type SavePayload = {
  id?: number | null;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string;
  published: boolean;
};

// Create a new post or update an existing one (by id).
export async function saveBlogPost(payload: SavePayload) {
  const supabase = await createClient();

  const title = payload.title.trim();
  if (!title) return { error: "Title is required." };

  const slug = (payload.slug.trim() ? slugify(payload.slug) : slugify(title)) || `post-${Date.now()}`;

  const fields = {
    slug,
    title,
    excerpt: payload.excerpt.trim() || null,
    body: payload.body.trim() || null,
    cover_url: payload.cover_url.trim() || null,
    published: payload.published,
    updated_at: new Date().toISOString(),
  };

  if (payload.id) {
    const { error } = await supabase.from("blog_posts").update(fields).eq("id", payload.id);
    if (error) {
      console.error("Blog update error:", error);
      return { error: error.message.includes("duplicate") ? "That slug is already used." : `Failed to save: ${error.message}` };
    }
  } else {
    // Append to the end of the current order.
    const { data: last } = await supabase
      .from("blog_posts")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();
    const nextOrder = (last?.sort_order ?? -1) + 1;

    const { error } = await supabase.from("blog_posts").insert({ ...fields, sort_order: nextOrder });
    if (error) {
      console.error("Blog insert error:", error);
      return { error: error.message.includes("duplicate") ? "That slug is already used." : `Failed to save: ${error.message}` };
    }
  }

  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  return { success: true };
}

export async function deleteBlogPost(id: number, coverUrl: string | null) {
  const supabase = await createClient();

  if (coverUrl) {
    const urlParts = coverUrl.split("/pamphlets/");
    if (urlParts.length === 2) {
      const { error: storageError } = await supabase.storage.from("pamphlets").remove([urlParts[1]]);
      if (storageError) console.error("Blog cover delete error:", storageError);
    }
  }

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) {
    console.error("Blog delete error:", error);
    return { error: "Failed to delete post." };
  }

  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
  return { success: true };
}

export async function togglePublished(id: number, next: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("blog_posts")
    .update({ published: next, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) {
    console.error("Blog publish toggle error:", error);
    return { error: "Failed to update." };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
  return { success: true };
}

// Persist a new order by writing sort_order = position for each id.
export async function reorderBlog(orderedIds: number[]) {
  const supabase = await createClient();
  const updates = orderedIds.map((id, index) =>
    supabase.from("blog_posts").update({ sort_order: index }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error("Blog reorder error:", failed.error);
    return { error: "Failed to save order." };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/");
  revalidatePath("/blog");
  return { success: true };
}

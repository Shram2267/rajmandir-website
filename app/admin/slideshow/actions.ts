"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Upload one banner image to the shared "pamphlets" bucket (slideshow/ folder)
// and create an ordered slideshow row.
export async function uploadSlideshowImage(formData: FormData) {
  const supabase = await createClient();
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "No file selected." };
  }

  const timestamp = Date.now();
  const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const storagePath = `slideshow/${timestamp}_${safeFilename}`;

  const { error: uploadError } = await supabase.storage
    .from("pamphlets")
    .upload(storagePath, file);

  if (uploadError) {
    console.error("Slideshow upload error:", uploadError);
    return { error: `Failed to upload image: ${uploadError.message}` };
  }

  const { data: publicUrlData } = supabase.storage
    .from("pamphlets")
    .getPublicUrl(storagePath);

  // Append to the end of the current order.
  const { data: last } = await supabase
    .from("slideshow_images")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder = (last?.sort_order ?? -1) + 1;

  const { data: inserted, error: dbError } = await supabase
    .from("slideshow_images")
    .insert({
      image_url: publicUrlData.publicUrl,
      file_name: file.name,
      sort_order: nextOrder,
    })
    .select("*")
    .single();

  if (dbError) {
    console.error("Slideshow DB error:", dbError);
    return { error: `Failed to save record: ${dbError.message}` };
  }

  revalidatePath("/admin/slideshow");
  revalidatePath("/");
  return { success: true, image: inserted };
}

export async function deleteSlideshowImage(id: number, imageUrl: string) {
  const supabase = await createClient();

  const urlParts = imageUrl.split("/pamphlets/");
  if (urlParts.length === 2) {
    const storagePath = urlParts[1];
    const { error: storageError } = await supabase.storage
      .from("pamphlets")
      .remove([storagePath]);
    if (storageError) console.error("Slideshow storage delete error:", storageError);
  }

  const { error: dbError } = await supabase
    .from("slideshow_images")
    .delete()
    .eq("id", id);
  if (dbError) {
    console.error("Slideshow DB delete error:", dbError);
    return { error: "Failed to delete record." };
  }

  revalidatePath("/admin/slideshow");
  revalidatePath("/");
  return { success: true };
}

// Persist a new order by writing sort_order = position for each id.
export async function reorderSlideshow(orderedIds: number[]) {
  const supabase = await createClient();

  const updates = orderedIds.map((id, index) =>
    supabase.from("slideshow_images").update({ sort_order: index }).eq("id", id),
  );
  const results = await Promise.all(updates);
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error("Slideshow reorder error:", failed.error);
    return { error: "Failed to save order." };
  }

  revalidatePath("/admin/slideshow");
  revalidatePath("/");
  return { success: true };
}

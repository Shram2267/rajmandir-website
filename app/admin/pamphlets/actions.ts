"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadPamphlet(formData: FormData) {
  const supabase = await createClient();
  const zone = formData.get("zone") as string;
  const file = formData.get("file") as File;

  if (!zone || !file || file.size === 0) {
    return { error: "Missing zone or file." };
  }

  const timestamp = Date.now();
  const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const storagePath = `${zone}/${timestamp}_${safeFilename}`;

  // Upload to Supabase Storage bucket named 'pamphlets'
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("pamphlets")
    .upload(storagePath, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { error: `Failed to upload image: ${uploadError.message}` };
  }

  // Get public URL
  const { data: publicUrlData } = supabase.storage
    .from("pamphlets")
    .getPublicUrl(storagePath);

  const imageUrl = publicUrlData.publicUrl;

  // Insert record into pamphlets table
  const { error: dbError } = await supabase.from("pamphlets").insert({
    zone,
    image_url: imageUrl,
    file_name: file.name,
  });

  if (dbError) {
    console.error("DB error:", dbError);
    return { error: `Failed to save record: ${dbError.message}` };
  }

  revalidatePath("/admin/pamphlets");
  revalidatePath("/pamphlets");
  return { success: true };
}

export async function deletePamphlet(id: number, imageUrl: string) {
  const supabase = await createClient();

  // Extract storage path from the URL.
  // The URL format is something like .../storage/v1/object/public/pamphlets/{path}
  const urlParts = imageUrl.split("/pamphlets/");
  if (urlParts.length === 2) {
    const storagePath = urlParts[1];
    
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("pamphlets")
      .remove([storagePath]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      return { error: "Failed to delete file from storage." };
    }
  }

  // Delete from DB
  const { error: dbError } = await supabase.from("pamphlets").delete().eq("id", id);
  if (dbError) {
    console.error("DB delete error:", dbError);
    return { error: "Failed to delete record from database." };
  }

  revalidatePath("/admin/pamphlets");
  revalidatePath("/pamphlets");
  return { success: true };
}

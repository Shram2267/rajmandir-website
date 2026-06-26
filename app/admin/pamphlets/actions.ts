"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { TextStyle } from "@/lib/pamphletText";

export type ImageItem = { url: string; fileName?: string };

export type Block =
  | { id: string; type: "text"; text: string; style?: TextStyle }
  | { id: string; type: "images"; cols: number; items: (ImageItem | null)[] };

const MAX_COLS = 4;

// Upload one image to the shared "pamphlets" storage bucket and return its URL.
export async function uploadPamphletImage(formData: FormData) {
  const supabase = await createClient();
  const zone = (formData.get("zone") as string) || "shared";
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    return { error: "No file selected." };
  }

  const timestamp = Date.now();
  const safeFilename = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  const storagePath = `${zone}/${timestamp}_${safeFilename}`;

  const { error: uploadError } = await supabase.storage
    .from("pamphlets")
    .upload(storagePath, file);

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return { error: `Failed to upload image: ${uploadError.message}` };
  }

  const { data } = supabase.storage.from("pamphlets").getPublicUrl(storagePath);
  return { success: true, url: data.publicUrl, fileName: file.name };
}

// Save the ordered list of blocks for a zone.
export async function savePamphletPage(zone: string, blocks: Block[]) {
  const supabase = await createClient();
  if (!zone) return { error: "No zone selected." };

  const cleanBlocks = (blocks || [])
    .map((b): Block => {
      if (b.type === "text") {
        return { id: b.id, type: "text", text: b.text ?? "", style: b.style ?? "body" };
      }
      const cols = Math.max(1, Math.min(MAX_COLS, Math.round(b.cols || 1)));
      const items: (ImageItem | null)[] = [];
      for (let i = 0; i < cols; i++) {
        const it = b.items?.[i];
        items.push(it && it.url ? { url: it.url, fileName: it.fileName } : null);
      }
      return { id: b.id, type: "images", cols, items };
    })
    // Drop blocks with no content so the page stays clean.
    .filter((b) =>
      b.type === "text" ? b.text.trim() !== "" : b.items.some((it) => !!it),
    );

  const { error } = await supabase.from("pamphlet_pages").upsert(
    { zone, blocks: cleanBlocks, updated_at: new Date().toISOString() },
    { onConflict: "zone" },
  );

  if (error) {
    console.error("Save error:", error);
    return { error: `Failed to save: ${error.message}` };
  }

  revalidatePath("/admin/pamphlets");
  revalidatePath("/pamphlets");
  return { success: true };
}

import { createClient } from "@/lib/supabase/server";
import SlideshowAdminClient from "./SlideshowAdminClient";
import { redirect } from "next/navigation";

export default async function SlideshowAdminPage() {
  const supabase = await createClient();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/admin/login");
  }

  const { data: images } = await supabase
    .from("slideshow_images")
    .select("*")
    .order("sort_order", { ascending: true });

  return <SlideshowAdminClient initialImages={images || []} />;
}

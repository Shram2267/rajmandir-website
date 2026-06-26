import { createClient } from "@/lib/supabase/server";
import PamphletsAdminClient from "./PamphletsAdminClient";
import { redirect } from "next/navigation";

export default async function PamphletsAdminPage() {
  const supabase = await createClient();

  // Check auth
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    redirect("/admin/login");
  }

  // Fetch unique zones from stores
  const { data: stores } = await supabase.from("stores").select("area");
  
  // Extract unique zones
  const zonesList = Array.from(new Set((stores || []).map(s => s.area || "Other"))).sort();
  
  // If no stores exist, provide default zones to avoid empty state
  const finalZones = zonesList.length > 0 ? zonesList : ["North Delhi", "South Delhi", "East Delhi", "West Delhi", "NIT Faridabad"];

  // Fetch saved pages (one row per zone)
  const { data: pages } = await supabase.from("pamphlet_pages").select("zone, blocks");

  return (
    <PamphletsAdminClient
      zones={finalZones}
      pages={pages || []}
    />
  );
}

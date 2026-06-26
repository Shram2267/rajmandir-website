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

  // Fetch pamphlets
  const { data: pamphlets } = await supabase
    .from("pamphlets")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <PamphletsAdminClient 
      zones={finalZones} 
      initialPamphlets={pamphlets || []} 
    />
  );
}

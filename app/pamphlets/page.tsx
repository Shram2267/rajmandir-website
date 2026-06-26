import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import PamphletOffersView from "@/components/PamphletOffersView";

export const metadata: Metadata = {
  title: "Pamphlet Offers | Rajmandir Hypermarket",
  description: "Browse the latest pamphlet offers and discounts at your nearest Rajmandir Hypermarket store.",
  alternates: { canonical: "/pamphlets" },
};

export const revalidate = 60; // revalidate every 60 seconds

export default async function PamphletsPage() {
  const supabase = await createClient();

  // Fetch unique zones from stores
  const { data: stores } = await supabase.from("stores").select("area");
  const zonesList = Array.from(new Set((stores || []).map(s => s.area || "Other"))).sort();
  const finalZones = zonesList.length > 0 ? zonesList : ["North Delhi", "South Delhi", "East Delhi", "West Delhi", "NIT Faridabad"];

  // Fetch all available pamphlets
  const { data: pamphlets } = await supabase
    .from("pamphlets")
    .select("id, zone, image_url, file_name")
    .order("created_at", { ascending: false });

  return (
    <PamphletOffersView 
      pamphlets={pamphlets || []} 
      zones={finalZones} 
    />
  );
}

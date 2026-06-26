import type { Metadata } from "next";
import { Suspense } from "react";
import OffersView from "@/components/OffersView";

export const metadata: Metadata = {
  title: "Today's Offers | Rajmandir Hypermarket",
  description: "Browse 120+ live deals across groceries, household items, personal care, and more at Rajmandir Hypermarket.",
  alternates: { canonical: "/offers" },
};

export default function OffersPage() {
  return (
    <Suspense fallback={<div className="min-h-[400px]" />}>
      <OffersView />
    </Suspense>
  );
}

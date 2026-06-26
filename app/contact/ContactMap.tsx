"use client";

import { useStore } from "@/components/StoreProvider";
import StoreMap from "@/components/StoreMap";

export default function ContactMap() {
  const { stores } = useStore();
  
  return (
    <div className="absolute inset-0 w-full h-full">
      <StoreMap visibleStores={stores} />
    </div>
  );
}

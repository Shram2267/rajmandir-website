"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "./StoreProvider";
import type { FormattedOffer } from "@/lib/offers";

type OffersContextValue = {
  offers: FormattedOffer[];
  loading: boolean;
};

const OffersContext = createContext<OffersContextValue | null>(null);

/**
 * Fetches the currently-selected store's offers and shares them with the
 * Home, Offers and Search views. Refetches whenever the store changes.
 */
export function OffersProvider({ children }: { children: React.ReactNode }) {
  const { store } = useStore();
  const storeId = store?.id;

  const [offers, setOffers] = useState<FormattedOffer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (storeId == null) {
      setOffers([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/offers?store_id=${storeId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setOffers(data.offers ?? []);
      })
      .catch(() => {
        if (!cancelled) setOffers([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [storeId]);

  return (
    <OffersContext.Provider value={{ offers, loading }}>
      {children}
    </OffersContext.Provider>
  );
}

export function useOffers() {
  const ctx = useContext(OffersContext);
  if (!ctx) throw new Error("useOffers must be used within <OffersProvider>");
  return ctx;
}

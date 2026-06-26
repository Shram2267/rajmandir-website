"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type Store = {
  id?: number;
  n: string;
  name: string;
  area: string;
  addr: string;
  hours: string;
  lat: number;
  lng: number;
  phone: string;
  whatsapp?: string | null;
  store_manager?: string | null;
};

type LocateError = "insecure" | "denied" | "unavailable" | "timeout" | "unsupported" | null;

type StoreContextValue = {
  storeIndex: number;
  store: Store;
  setStoreIndex: (i: number) => void;
  useMyLocation: () => void;
  locating: boolean;
  locateError: LocateError;
  clearLocateError: () => void;
  stores: Store[];
};

const StoreContext = createContext<StoreContextValue | null>(null);

const STORAGE_KEY = "rm-store-index";

/** Great-circle distance in km between two lat/lng points (Haversine). */
function distanceKm(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(bLat - aLat);
  const dLng = toRad(bLng - aLng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(aLat)) * Math.cos(toRad(bLat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function StoreProvider({ children, stores = [] }: { children: React.ReactNode, stores: Store[] }) {
  const [storeIndex, setStoreIndexState] = useState(0);
  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<LocateError>(null);

  const persist = (i: number) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, String(i));
    } catch {
      /* ignore */
    }
  };

  // Explicit (manual) selection — remembered across visits.
  const setStoreIndex = useCallback((i: number) => {
    setStoreIndexState(i);
    persist(i);
  }, []);

  /**
   * Ask the browser for the user's position and pick the closest store.
   * `silent` = startup auto-detect; we don't show an error toast for these,
   * but we do log enough to make troubleshooting easy.
   */
  const detectNearest = useCallback((persistChoice: boolean, silent: boolean) => {
    const set = (e: LocateError) => {
      if (!silent) setLocateError(e);
    };

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      set("unsupported");
      return;
    }
    if (typeof window !== "undefined" && window.isSecureContext === false) {
      set("insecure");
      console.warn(
        "[Rajmandir] Geolocation blocked: page is not a secure context. " +
          "Use http://localhost:3000 (not a LAN IP) or serve over HTTPS.",
      );
      return;
    }

    setLocating(true);
    setLocateError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let best = 0;
        let bestDist = Infinity;
        stores.forEach((s, i) => {
          const d = distanceKm(pos.coords.latitude, pos.coords.longitude, s.lat, s.lng);
          if (d < bestDist) {
            bestDist = d;
            best = i;
          }
        });
        
        setStoreIndexState(best);
        if (persistChoice) persist(best);
        setLocating(false);
      },
      (err) => {
        setLocating(false);
        const code =
          err.code === err.PERMISSION_DENIED
            ? "denied"
            : err.code === err.POSITION_UNAVAILABLE
              ? "unavailable"
              : err.code === err.TIMEOUT
                ? "timeout"
                : "unavailable";
        set(code);
        console.warn(`[Rajmandir] Geolocation failed (${code}): ${err.message}`);
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }, [stores]);

  // On first load: respect a saved choice; otherwise auto-pick the nearest store.
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (saved !== null) {
      const i = Number(saved);
      if (Number.isInteger(i) && i >= 0 && i < stores.length) {
        setStoreIndexState(i);
        return;
      }
    }
    detectNearest(false, true);
  }, [detectNearest]);

  // The "Use my location" buttons — explicit, so the result is remembered AND
  // any error is shown to the user.
  const useMyLocation = useCallback(() => detectNearest(true, false), [detectNearest]);
  const clearLocateError = useCallback(() => setLocateError(null), []);

  return (
    <StoreContext.Provider
      value={{
        storeIndex,
        store: stores[storeIndex],
        setStoreIndex,
        useMyLocation,
        locating,
        locateError,
        clearLocateError,
        stores,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <StoreProvider>");
  return ctx;
}

export const LOCATE_MESSAGES: Record<Exclude<LocateError, null>, string> = {
  insecure:
    "Location needs a secure page (HTTPS). Open the site via http://localhost:3000 or deploy with HTTPS to enable nearby-store detection.",
  denied:
    "Location permission was blocked. Click the lock icon in your browser's address bar and allow location for this site, then try again.",
  unavailable: "Your device couldn't determine its location right now. Please pick a store manually.",
  timeout: "Location lookup took too long. Please try again, or pick a store manually.",
  unsupported: "This browser doesn't support location services. Please pick a store manually.",
};

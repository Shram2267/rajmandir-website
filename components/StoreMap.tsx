"use client";

import { useEffect, useRef, useState } from "react";

type MapStore = {
  lat: number;
  lng: number;
  name: string;
  n: string;
  addr?: string;
  hours?: string;
};

/**
 * StoreMap — Interactive map using Leaflet + OpenStreetMap.
 * Leaflet is dynamically imported client-side only to avoid SSR "window is not defined" errors.
 */
export default function StoreMap({
  visibleStores = [],
  selectedLat,
  selectedLng,
}: {
  visibleStores?: MapStore[];
  selectedLat?: number;
  selectedLng?: number;
  onSelectStore?: (idx: number) => void;
}) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any>(null);
  const leafletRef = useRef<any>(null);
  const [ready, setReady] = useState(false);

  // Dynamically import leaflet only on the client
  useEffect(() => {
    let cancelled = false;

    async function loadLeaflet() {
      const L = (await import("leaflet")).default;
      // @ts-ignore
      await import("leaflet/dist/leaflet.css");

      if (cancelled || !mapContainerRef.current) return;
      leafletRef.current = L;

      const map = L.map(mapContainerRef.current, {
        center: [28.65, 77.15],
        zoom: 11,
        scrollWheelZoom: true,
        zoomControl: true,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      markersRef.current = L.layerGroup().addTo(map);
      mapRef.current = map;

      setTimeout(() => map.invalidateSize(), 200);
      setReady(true);
    }

    loadLeaflet();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers whenever visibleStores or selected store changes
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!L || !map || !markers) return;

    markers.clearLayers();

    const validStores = visibleStores.filter((s) => s.lat && s.lng);
    if (validStores.length === 0) {
      map.setView([28.65, 77.15], 11);
      return;
    }

    const bounds = L.latLngBounds([]);

    validStores.forEach((store) => {
      const isSelected =
        selectedLat !== undefined &&
        selectedLng !== undefined &&
        Math.abs(store.lat - selectedLat) < 0.0001 &&
        Math.abs(store.lng - selectedLng) < 0.0001;

      const icon = isSelected
        ? L.divIcon({
            className: "rm-map-pin-selected",
            html: `<div style="
              width:38px;height:38px;
              background:#E8503A;
              border:4px solid #fff;
              border-radius:50%;
              box-shadow:0 0 0 6px rgba(232,80,58,.25), 0 3px 12px rgba(0,0,0,.35);
              display:flex;align-items:center;justify-content:center;
              animation: rm-bounce 0.5s ease;
            ">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>
            </div>
            <div style="
              width:0;height:0;
              border-left:8px solid transparent;
              border-right:8px solid transparent;
              border-top:12px solid #E8503A;
              margin:-4px auto 0;
              filter:drop-shadow(0 2px 2px rgba(0,0,0,.2));
            "></div>`,
            iconSize: [38, 52],
            iconAnchor: [19, 52],
            popupAnchor: [0, -54],
          })
        : L.divIcon({
            className: "rm-map-pin",
            html: `<div style="
              width:30px;height:30px;
              background:#E8503A;
              border:3px solid #fff;
              border-radius:50%;
              box-shadow:0 2px 8px rgba(0,0,0,.3);
              display:flex;align-items:center;justify-content:center;
            ">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z"/></svg>
            </div>
            <div style="
              width:0;height:0;
              border-left:7px solid transparent;
              border-right:7px solid transparent;
              border-top:10px solid #fff;
              margin:-3px auto 0;
              filter:drop-shadow(0 2px 2px rgba(0,0,0,.15));
            "></div>`,
            iconSize: [30, 42],
            iconAnchor: [15, 42],
            popupAnchor: [0, -44],
          });

      const marker = L.marker([store.lat, store.lng], {
        icon,
        zIndexOffset: isSelected ? 1000 : 0,
      });

      marker.bindPopup(
        `<div style="font-family:var(--font-hanken),sans-serif;min-width:160px">
          <div style="font-weight:800;font-size:14px;margin-bottom:4px;color:#211B17">${store.name}</div>
          ${store.addr ? `<div style="font-size:11px;color:#78716c;margin-bottom:4px;line-height:1.4">${store.addr}</div>` : ""}
          ${store.hours ? `<div style="font-size:11px;color:#16a34a;font-weight:700">🕘 ${store.hours}</div>` : ""}
          <a href="https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}" 
             target="_blank" rel="noopener noreferrer"
             style="display:inline-block;margin-top:6px;font-size:11px;font-weight:700;color:#E8503A;text-decoration:none">
            🧭 Get Directions →
          </a>
        </div>`,
        { closeButton: true, maxWidth: 220 }
      );

      markers.addLayer(marker);
      bounds.extend([store.lat, store.lng]);

      if (isSelected) {
        setTimeout(() => marker.openPopup(), 300);
      }
    });

    // Fit map to show all markers
    if (selectedLat && selectedLng) {
      map.setView([selectedLat, selectedLng], 15, { animate: true });
    } else if (validStores.length === 1) {
      map.setView([validStores[0].lat, validStores[0].lng], 15, { animate: true });
    } else {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14, animate: true });
    }
  }, [visibleStores, selectedLat, selectedLng, ready]);

  // Handle container resize
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      mapRef.current?.invalidateSize();
    });
    if (mapContainerRef.current) observer.observe(mapContainerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .rm-map-pin, .rm-map-pin-selected {
          background: transparent !important;
          border: none !important;
        }
        @keyframes rm-bounce {
          0% { transform: scale(0.5); opacity: 0; }
          60% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          box-shadow: 0 8px 30px rgba(0,0,0,.15) !important;
        }
        .leaflet-popup-tip {
          box-shadow: 0 4px 10px rgba(0,0,0,.1) !important;
        }
      `}</style>
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[300px]"
        style={{ background: "#f5f0eb" }}
      />
      {visibleStores.length > 1 && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow-lg border border-line z-[1000]">
          <div className="text-[11px] font-bold text-stone-600">
            📍 Showing {visibleStores.filter((s) => s.lat && s.lng).length} stores
          </div>
        </div>
      )}
    </>
  );
}

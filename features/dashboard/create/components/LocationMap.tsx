"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

type Position = {
  lat: number;
  lng: number;
};

type Props = {
  value: {
    address?: string;
    latitude?: string | number;
    longitude?: string | number;
  };
  onChange: (data: { address?: string; latitude: string; longitude: string }) => void;
};

function MapClickHandler({
  onPick,
}: {
  onPick: (pos: Position) => void;
}) {
  useMapEvents({
    click(e) {
      onPick({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    },
  });

  return null;
}

function FlyToLocation({ position }: { position: Position | null }) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    map.flyTo([position.lat, position.lng], 15, { duration: 0.8 });
  }, [map, position]);

  return null;
}

export default function LocationMap({ value, onChange }: Props) {
  const initialPosition = useMemo<Position>(() => {
    const lat = Number(value.latitude);
    const lng = Number(value.longitude);

    if (!Number.isNaN(lat) && !Number.isNaN(lng) && value.latitude && value.longitude) {
      return { lat, lng };
    }

    return { lat: 31.5017, lng: 34.4668 };
  }, [value.latitude, value.longitude]);

  const [position, setPosition] = useState<Position>(initialPosition);
  const [search, setSearch] = useState(value.address || "");
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const lat = Number(value.latitude);
    const lng = Number(value.longitude);

    if (!Number.isNaN(lat) && !Number.isNaN(lng) && value.latitude && value.longitude) {
      setPosition({ lat, lng });
    }
  }, [value.latitude, value.longitude]);

  const updateAll = async (pos: Position, shouldReverse = true) => {
    setPosition(pos);

    let nextAddress = value.address || search || "";

    if (shouldReverse) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${pos.lat}&lon=${pos.lng}`
        );
        const data = await res.json();
        nextAddress = data?.display_name || nextAddress;
        setSearch(nextAddress);
      } catch (e) {
        console.error("Reverse geocoding error:", e);
      }
    }

    onChange({
      address: nextAddress,
      latitude: pos.lat.toFixed(6),
      longitude: pos.lng.toFixed(6),
    });
  };

  const handleSearch = async (query?: string) => {
    const q = (query ?? search).trim();
    if (!q) return;

    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(q)}&limit=1`
      );
      const data = await res.json();
      const first = data?.[0];
      if (!first) return;

      const pos = {
        lat: Number(first.lat),
        lng: Number(first.lon),
      };

      setPosition(pos);
      setSearch(first.display_name || q);

      onChange({
        address: first.display_name || q,
        latitude: pos.lat.toFixed(6),
        longitude: pos.lng.toFixed(6),
      });
    } catch (e) {
      console.error("Search geocoding error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressInput = (next: string) => {
    setSearch(next);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      if (next.trim().length >= 4) {
        handleSearch(next);
      }
    }, 500);
  };

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto]">
        <input
          type="text"
          placeholder="Rechercher une adresse ou un lieu"
          value={search}
          onChange={(e) => handleAddressInput(e.target.value)}
          className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-cyan-400/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-400/10"
        />

        <button
          type="button"
          onClick={() => handleSearch()}
          disabled={loading}
          className="rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-bold text-white transition hover:bg-white/[0.1] disabled:opacity-60"
        >
          {loading ? "Recherche..." : "Rechercher"}
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/10">
        <MapContainer
          center={[position.lat, position.lng]}
          zoom={13}
          scrollWheelZoom
          className="h-[320px] w-full"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <FlyToLocation position={position} />

          <MapClickHandler onPick={(pos) => updateAll(pos, true)} />

          <Marker
            position={[position.lat, position.lng]}
            draggable
            eventHandlers={{
              dragend: async (e) => {
                const marker = e.target;
                const latlng = marker.getLatLng();

                await updateAll(
                  {
                    lat: latlng.lat,
                    lng: latlng.lng,
                  },
                  true
                );
              },
            }}
          />
        </MapContainer>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <input
          type="text"
          placeholder="Latitude"
          value={position.lat.toFixed(6)}
          onChange={(e) => {
            const nextLat = Number(e.target.value);
            if (Number.isNaN(nextLat)) return;
            setPosition({ lat: nextLat, lng: position.lng });
            onChange({
              address: search,
              latitude: nextLat.toFixed(6),
              longitude: position.lng.toFixed(6),
            });
          }}
          className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-cyan-400/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-400/10"
        />

        <input
          type="text"
          placeholder="Longitude"
          value={position.lng.toFixed(6)}
          onChange={(e) => {
            const nextLng = Number(e.target.value);
            if (Number.isNaN(nextLng)) return;
            setPosition({ lat: position.lat, lng: nextLng });
            onChange({
              address: search,
              latitude: position.lat.toFixed(6),
              longitude: nextLng.toFixed(6),
            });
          }}
          className="w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-cyan-400/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-400/10"
        />
      </div>
    </div>
  );
}
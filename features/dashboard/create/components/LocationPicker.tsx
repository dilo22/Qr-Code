"use client";

import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("./LocationMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[320px] w-full items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-sm text-white/45">
      Chargement de la carte...
    </div>
  ),
});

type Props = {
  value: {
    address?: string;
    latitude?: string | number;
    longitude?: string | number;
  };
  onChange: (data: { address?: string; latitude: string; longitude: string }) => void;
};

export default function LocationPicker(props: Props) {
  return <LocationMap {...props} />;
}
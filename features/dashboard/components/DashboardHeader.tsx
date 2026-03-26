"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

type Props = {
  profileName: string;
};

export default function DashboardHeader({ profileName }: Props) {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
      <div>
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
          Tableau de Bord
        </h2>
        <p className="text-sm font-medium italic text-white/40">
          Bienvenue {profileName}, voici vos projets QR réels.
        </p>
      </div>

      <Link
        href="/dashboard/create"
        className="group flex items-center gap-3 rounded-2xl bg-cyan-500 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:bg-white"
      >
        <Plus
          className="text-white transition-colors group-hover:text-cyan-500"
          size={16}
          strokeWidth={3}
        />
        <span className="transition-colors group-hover:text-cyan-500">
          Nouveau Projet
        </span>
      </Link>
    </div>
  );
}
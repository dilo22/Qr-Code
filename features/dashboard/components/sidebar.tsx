"use client";

import Link from "next/link";
import {
  QrCode,
  LayoutDashboard,
  PlusCircle,
  Settings,
  LogOut,
} from "lucide-react";

function NavButton({
  href,
  active,
  icon,
  label,
}: {
  href: string;
  active: boolean;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={`group relative flex items-center justify-center w-14 h-14 rounded-2xl border transition-all duration-300 ${
        active
          ? "bg-gradient-to-br from-cyan-400 to-fuchsia-500 text-black border-transparent shadow-[0_0_30px_rgba(34,211,238,0.25)] scale-105"
          : "bg-white/[0.03] border-white/10 text-white/45 hover:text-white hover:bg-white/[0.07] hover:border-white/20 hover:scale-105"
      }`}
    >
      <span className="relative z-10">{icon}</span>

      {!active && (
        <div className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#0a0f1a]/95 px-3 py-2 text-xs font-bold text-white opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 shadow-xl">
          {label}
        </div>
      )}
    </Link>
  );
}

export function Sidebar({
  pathname,
  isSigningOut,
  onLogout,
}: {
  pathname: string;
  isSigningOut: boolean;
  onLogout: () => void;
}) {
  return (
    <aside className="fixed left-0 top-0 bottom-0 z-50 w-28">
      <div className="absolute inset-0 bg-[#050816]/90 backdrop-blur-2xl border-r border-white/10" />
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent" />

      <div className="relative flex h-full flex-col items-center px-4 py-6">
        <Link
          href="/"
          aria-label="Retour à l'accueil"
          className="mb-8 group"
        >
          <div className="relative flex items-center justify-center w-16 h-16 rounded-[1.6rem] bg-gradient-to-br from-cyan-400 via-sky-400 to-fuchsia-500 p-[1px] shadow-[0_0_35px_rgba(34,211,238,0.18)] transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            <div className="flex items-center justify-center w-full h-full rounded-[1.5rem] bg-[#060a14]">
              <QrCode className="w-8 h-8 text-white" />
            </div>
          </div>
        </Link>

        <div className="flex flex-col items-center gap-4">
          <NavButton
            href="/dashboard"
            active={pathname === "/dashboard"}
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Dashboard"
          />

          <NavButton
            href="/dashboard/create"
            active={pathname === "/dashboard/create"}
            icon={<PlusCircle className="w-5 h-5" />}
            label="Nouveau QR"
          />

          <NavButton
            href="/dashboard/settings"
            active={pathname === "/dashboard/settings"}
            icon={<Settings className="w-5 h-5" />}
            label="Paramètres"
          />
        </div>

        <div className="mt-auto w-full flex flex-col items-center gap-4">
          <div className="w-10 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

          <button
            type="button"
            onClick={onLogout}
            disabled={isSigningOut}
            aria-label="Se déconnecter"
            className="group relative flex items-center justify-center w-14 h-14 rounded-2xl border border-white/10 bg-white/[0.03] text-white/45 transition-all duration-300 hover:text-red-400 hover:bg-red-500/10 hover:border-red-400/20 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            <LogOut className="w-5 h-5" />

            <div className="pointer-events-none absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-xl border border-white/10 bg-[#0a0f1a]/95 px-3 py-2 text-xs font-bold text-white opacity-0 translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 shadow-xl">
              {isSigningOut ? "Déconnexion..." : "Se déconnecter"}
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}
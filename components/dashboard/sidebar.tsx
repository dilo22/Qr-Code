"use client";

import Link from "next/link";
import { QrCode, LayoutDashboard, PlusCircle, Settings, LogOut } from "lucide-react";

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
      className={`p-3 rounded-xl transition-all duration-300 flex items-center justify-center ${
        active
          ? "bg-cyan-500 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)]"
          : "text-white/40 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
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
    <aside className="fixed left-0 top-0 bottom-0 w-24 bg-white/[0.02] border-r border-white/5 backdrop-blur-3xl z-50 flex flex-col items-center py-10 gap-8">
      <Link href="/" className="cursor-pointer mb-6" aria-label="Retour à l'accueil">
        <div className="w-12 h-12 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-2xl flex items-center justify-center rotate-12">
          <QrCode className="w-7 h-7 text-white" />
        </div>
      </Link>

      <NavButton
        href="/dashboard"
        active={pathname === "/dashboard"}
        icon={<LayoutDashboard className="w-6 h-6" />}
        label="Dashboard"
      />

      <NavButton
        href="/dashboard/create"
        active={pathname === "/dashboard/create"}
        icon={<PlusCircle className="w-6 h-6" />}
        label="Nouveau QR"
      />

      <NavButton
        href="/dashboard/settings"
        active={pathname === "/dashboard/settings"}
        icon={<Settings className="w-6 h-6" />}
        label="Paramètres"
      />

      <div className="mt-auto">
        <button
          type="button"
          onClick={onLogout}
          disabled={isSigningOut}
          className="p-3 rounded-xl transition-all duration-300 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 disabled:opacity-50"
          aria-label="Se déconnecter"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </div>
    </aside>
  );
}
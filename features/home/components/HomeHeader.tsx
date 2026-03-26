"use client";

import { ChevronRight, QrCode } from "lucide-react";
import { NavLink } from "@/features/home/ui//NavLink";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

type HomeHeaderProps = {
  scrolled: boolean;
  onLogoClick: () => void;
  onAuthClick: () => void;
  onDashboardClick: () => void;
  onScrollToSection: (id: string) => void;
};

export function HomeHeader({
  scrolled,
  onLogoClick,
  onAuthClick,
  onDashboardClick,
  onScrollToSection,
}: HomeHeaderProps) {
  const { user, loading } = useAuthUser();

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-3" : "py-5"
      }`}
    >
      <div
        className={`mx-auto max-w-7xl px-5 flex items-center justify-between transition-all duration-300 ${
          scrolled
            ? "bg-white/5 backdrop-blur-md rounded-full border border-white/10 px-6"
            : ""
        }`}
      >
        <button
          type="button"
          onClick={onLogoClick}
          className="flex items-center gap-3 group cursor-pointer"
          aria-label="Retour à l'accueil"
        >
          <div className="relative w-9 h-9 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500" />
            <QrCode className="relative w-5 h-5 text-white" />
          </div>
          <span className="text-lg md:text-xl font-bold tracking-tighter uppercase">
            My<span className="text-cyan-400">QR</span>
          </span>
        </button>

        <nav className="hidden md:flex items-center gap-7">
          <NavLink onClick={() => onScrollToSection("features")}>
            Technologie
          </NavLink>
          <NavLink onClick={() => onScrollToSection("workflow")}>
            Processus
          </NavLink>
          <NavLink onClick={() => onScrollToSection("analytics")}>
            Analytics
          </NavLink>
        </nav>

        <div className="flex items-center gap-3 min-w-[120px] justify-end">
          {loading ? (
            <div className="h-[36px] w-[108px] rounded-full border border-white/10 bg-white/5 animate-pulse" />
          ) : user ? (
            <button
              type="button"
              onClick={onDashboardClick}
              className="relative group px-5 py-2 overflow-hidden rounded-full bg-cyan-500 text-black font-bold text-xs transition-all hover:pr-8"
            >
              <span className="relative z-10">Compte</span>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onAuthClick}
              className="relative group px-5 py-2 overflow-hidden rounded-full bg-white text-black font-bold text-xs transition-all hover:pr-8"
            >
              <span className="relative z-10">Get Started</span>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
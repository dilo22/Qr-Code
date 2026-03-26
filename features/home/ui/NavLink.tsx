import React from "react";

type NavLinkProps = {
  children: React.ReactNode;
  onClick?: () => void;
};

export function NavLink({ children, onClick }: NavLinkProps) {
  return (
    <button
      onClick={onClick}
      className="relative text-xs font-medium text-white/60 hover:text-white transition-colors group py-2"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-300 group-hover:w-full" />
    </button>
  );
}
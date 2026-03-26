import React from "react";

type GlassCardProps = {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

export function GlassCard({
  children,
  className = "",
  onClick,
}: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative group transition-all duration-500 hover:scale-[1.015] ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className="absolute -inset-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/5 rounded-[1.5rem] z-0" />
      <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl rounded-[1.5rem] z-0" />
      <div className="relative z-10 p-5 h-full">{children}</div>
    </div>
  );
}
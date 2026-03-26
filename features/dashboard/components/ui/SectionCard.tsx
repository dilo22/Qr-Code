import type { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function SectionCard({
  title,
  subtitle,
  children,
  className = "",
}: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border border-white/5 bg-white/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />
      <div className="relative p-6">
        <div className="mb-5">
          <h2 className="text-lg font-black italic uppercase tracking-widest text-white">
            {title}
          </h2>
          {subtitle ? <p className="mt-2 text-sm text-white/45">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}
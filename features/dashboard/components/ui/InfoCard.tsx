import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  hint?: ReactNode;
};

export function InfoCard({ icon, label, value, hint }: Props) {
  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-white/90">{value}</div>
      {hint ? <div className="mt-2 text-xs text-white/45">{hint}</div> : null}
    </div>
  );
}
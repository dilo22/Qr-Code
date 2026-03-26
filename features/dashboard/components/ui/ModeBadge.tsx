type Props = {
  mode: "dynamic" | "static";
};

export function ModeBadge({ mode }: Props) {
  const classes =
    mode === "dynamic"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20"
      : "bg-white/8 text-white/60 border-white/10";

  return (
    <span
      className={`inline-flex items-center rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${classes}`}
    >
      {mode === "dynamic" ? "Dynamique" : "Statique"}
    </span>
  );
}
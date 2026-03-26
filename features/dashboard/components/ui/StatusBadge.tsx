type Props = {
  status: string;
};

export function StatusBadge({ status }: Props) {
  const colors: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-300 border-emerald-500/20",
    paused: "bg-amber-500/20 text-amber-300 border-amber-500/20",
    archived: "bg-white/10 text-white/50 border-white/10",
  };

  return (
    <span
      className={`inline-flex items-center rounded-xl border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] ${
        colors[status] || colors.archived
      }`}
    >
      {status}
    </span>
  );
}
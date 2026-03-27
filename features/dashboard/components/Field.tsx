type FieldProps = {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
};

export default function Field({ label, icon, children }: FieldProps) {
  return (
    <div className="w-full">
      <label className="mb-2 flex items-center gap-2 pl-1 text-[11px] font-black uppercase tracking-[0.1em] text-white/45">
        {icon && <span className="flex shrink-0 items-center justify-center text-cyan-400">{icon}</span>}
        {label}
      </label>
      <div className="w-full">{children}</div>
    </div>
  );
}
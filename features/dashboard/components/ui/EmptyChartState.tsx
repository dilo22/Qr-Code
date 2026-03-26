type Props = {
  text: string;
};

export function EmptyChartState({ text }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-white/45">
      {text}
    </div>
  );
}
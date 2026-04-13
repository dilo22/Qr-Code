import { SectionCard } from "@/features/dashboard/components/ui/SectionCard";
import { getQrDisplaySummary } from "@/features/dashboard/lib/qr-content-display";

type Props = {
  type?: string | null;
  content: unknown;
  qrValue?: string | null;
};

export function QRContentDetails({ type, content, qrValue }: Props) {
  const summary = getQrDisplaySummary(type, content, qrValue);
  const hasContent = Boolean(summary.headline || summary.description || summary.fields.length > 0);

  return (
    <SectionCard
      title="Contenu du QR code"
      subtitle="Résumé lisible des données enregistrées"
    >
      {!hasContent ? (
        <p className="text-sm text-white/45">Aucune donnée disponible.</p>
      ) : (
        <div className="space-y-4">
          {summary.headline ? (
            <div className="rounded-2xl border border-cyan-500/10 bg-cyan-500/[0.06] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300/70">
                Résumé
              </p>
              <p className="mt-2 break-words text-lg font-black text-white">
                {summary.headline}
              </p>
              {summary.description ? (
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-white/65">
                  {summary.description}
                </p>
              ) : null}
            </div>
          ) : null}

          {summary.fields.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {summary.fields.map((field) => (
                <div
                  key={`${field.label}-${field.value}`}
                  className="rounded-2xl border border-white/5 bg-white/[0.02] p-4"
                >
                  <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
                    {field.label}
                  </span>
                  <p className="mt-2 break-words text-sm leading-6 text-white/90">
                    {field.value}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </SectionCard>
  );
}

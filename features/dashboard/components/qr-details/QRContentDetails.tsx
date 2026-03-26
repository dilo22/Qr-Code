import { parseContent } from "@/features/dashboard/lib/qr-details.helpers";
import { SectionCard } from "@/features/dashboard/components/ui/SectionCard";

type Props = {
  content: unknown;
};

export function QRContentDetails({ content }: Props) {
  const parsedContent = parseContent(content);

  const renderContent = () => {
    if (!parsedContent || typeof parsedContent !== "object") {
      return <p className="text-sm text-white/45">Aucune donnée de contenu.</p>;
    }

    const entries = Object.entries(parsedContent).filter(
      ([, value]) => value !== null && value !== undefined && value !== ""
    );

    if (entries.length === 0) {
      return <p className="text-sm text-white/45">Aucune donnée de contenu.</p>;
    }

    return (
      <div className="space-y-3">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className="flex flex-col gap-1 rounded-2xl border border-white/5 bg-white/[0.02] p-4"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
              {key}
            </span>
            <span className="break-words text-sm text-white/90">
              {typeof value === "object"
                ? JSON.stringify(value, null, 2)
                : String(value)}
            </span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <SectionCard
      title="Contenu du QR code"
      subtitle="Données encodées enregistrées"
    >
      {renderContent()}
    </SectionCard>
  );
}
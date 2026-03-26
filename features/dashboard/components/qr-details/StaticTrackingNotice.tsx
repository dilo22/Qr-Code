import { AlertTriangle } from "lucide-react";
import { SectionCard } from "@/features/dashboard/components/ui/SectionCard";

export function StaticTrackingNotice() {
  return (
    <SectionCard
      title="Tracking non disponible"
      subtitle="Ce QR code est enregistré et retéléchargeable, mais les scans ne peuvent pas être mesurés."
    >
      <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.02] p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-white/85">
          <AlertTriangle className="h-4 w-4 text-amber-300" />
          QR code statique
        </div>

        <p className="text-sm leading-6 text-white/60">
          Ce QR code fonctionne normalement et peut être téléchargé, partagé ou imprimé.
          En revanche, comme il est statique, il ne passe pas par une redirection trackée,
          donc aucun scan, appareil ou localisation ne peut être remonté dans le dashboard.
        </p>

        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
            Téléchargement disponible
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/80">
            Édition disponible
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3 text-sm text-white/45">
            Analytics indisponibles
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
"use client";

import { useMemo } from "react";
import {
  Activity,
  CalendarDays,
  CheckCircle2,
  Palette,
  QrCode,
  ScanLine,
  Type,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { useQrDetails } from "@/features/dashboard/hooks/useQrDetails";
import { buildQrAnalytics } from "@/features/dashboard/lib/qr-details.analytics";
import {
  formatDate,
  getDisplayName,
  getPreviewValue,
  getStatus,
} from "@/features/dashboard/lib/qr-details.helpers";

import { InfoCard } from "@/features/dashboard/components/ui/InfoCard";
import { PreviewQR } from "@/features/dashboard/components/qr-details/PreviewQR";
import { QRContentDetails } from "@/features/dashboard/components/qr-details/QRContentDetails";
import { StaticTrackingNotice } from "@/features/dashboard/components/qr-details/StaticTrackingNotice";
import { QrDetailsHeader } from "@/features/dashboard/components/qr-details/QrDetailsHeader";
import { QrDetailsAnalytics } from "@/features/dashboard/components/qr-details/QrDetailsAnalytics";

type Props = {
  qrId: string;
};

export default function QRDetailsView({ qrId }: Props) {
  const router = useRouter();
  const { qr, scans, loading, error, isDeleting, deleteQr } = useQrDetails(qrId);

  const analytics = useMemo(() => buildQrAnalytics(scans), [scans]);
  const qrMode: "dynamic" | "static" = qr?.qr_mode === "static" ? "static" : "dynamic";
  const isDynamic = qrMode === "dynamic";

  const handleDelete = async () => {
    if (!qr) return;

    const confirmed = window.confirm(
      `Supprimer définitivement le QR code "${getDisplayName(qr)}" ?`
    );

    if (!confirmed) return;

    const ok = await deleteQr();

    if (ok) {
      router.replace("/dashboard");
      router.refresh();
    }
  };

  if (loading) {
    return <div className="p-8 text-white/60">Chargement des détails...</div>;
  }

  if (error && !qr) {
    return <div className="p-8 text-red-300">{error}</div>;
  }

  if (!qr) {
    return <div className="p-8 text-red-300">QR introuvable.</div>;
  }

  return (
    <div className="relative w-full min-w-0 animate-in space-y-8 fade-in duration-700">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_22%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_20%),radial-gradient(circle_at_bottom_center,rgba(59,130,246,0.06),transparent_25%)]" />

      <QrDetailsHeader
        qr={qr}
        qrMode={qrMode}
        isDeleting={isDeleting}
        onDelete={handleDelete}
      />

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {isDynamic ? (
        <QrDetailsAnalytics analytics={analytics} scans={scans} />
      ) : (
        <StaticTrackingNotice />
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <PreviewQR qr={qr} />

          <div className="grid grid-cols-1 gap-4">
            <InfoCard
              icon={<Type className="h-4 w-4 text-emerald-400" />}
              label="Type"
              value={qr.type || "—"}
            />
            <InfoCard
              icon={<CheckCircle2 className="h-4 w-4 text-amber-400" />}
              label="Statut"
              value={getStatus(qr)}
            />
            <InfoCard
              icon={<QrCode className="h-4 w-4 text-cyan-400" />}
              label="ID du QR code"
              value={<span className="break-all">{qr.id}</span>}
            />
            <InfoCard
              icon={<Activity className="h-4 w-4 text-white/70" />}
              label="Mode"
              value={qrMode === "dynamic" ? "Dynamique" : "Statique"}
              hint={
                qrMode === "dynamic"
                  ? "Suivi des scans activé"
                  : "Tracking des scans indisponible"
              }
            />
            <InfoCard
              icon={<Palette className="h-4 w-4 text-purple-400" />}
              label="Valeur encodée"
              value={<span className="break-all">{getPreviewValue(qr)}</span>}
            />
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoCard
              icon={<CalendarDays className="h-4 w-4 text-purple-400" />}
              label="Créé le"
              value={formatDate(qr.created_at)}
            />
            <InfoCard
              icon={<Activity className="h-4 w-4 text-emerald-400" />}
              label="Dernière mise à jour"
              value={formatDate(qr.updated_at)}
            />

            {isDynamic ? (
              <>
                <InfoCard
                  icon={<ScanLine className="h-4 w-4 text-cyan-400" />}
                  label="Scans 7 jours"
                  value={analytics.last7}
                />
                <InfoCard
                  icon={<Activity className="h-4 w-4 text-amber-400" />}
                  label="Scans 24h"
                  value={analytics.last24h}
                />
              </>
            ) : (
              <>
                <InfoCard
                  icon={<ScanLine className="h-4 w-4 text-white/45" />}
                  label="Scans 7 jours"
                  value="—"
                  hint="Non disponible sur un QR statique"
                />
                <InfoCard
                  icon={<Activity className="h-4 w-4 text-white/45" />}
                  label="Scans 24h"
                  value="—"
                  hint="Non disponible sur un QR statique"
                />
              </>
            )}
          </div>

          <QRContentDetails content={qr.content} />
        </div>
      </div>
    </div>
  );
}
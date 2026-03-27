import Link from "next/link";
import { ArrowLeft, Pencil, Trash2, Power } from "lucide-react";
import type { QRCodeItem } from "@/features/dashboard/types/qr-details.types";
import {
  getDisplayName,
  getStatus,
} from "@/features/dashboard/lib/qr-details.helpers";
import { StatusBadge } from "@/features/dashboard/components/ui/StatusBadge";
import { ModeBadge } from "@/features/dashboard/components/ui/ModeBadge";

type Props = {
  qr: QRCodeItem;
  qrMode: "dynamic" | "static";
  isDeleting: boolean;
  isTogglingStatus: boolean;
  onDelete: () => void;
  onToggleStatus: () => void;
};

export function QrDetailsHeader({
  qr,
  qrMode,
  isDeleting,
  isTogglingStatus,
  onDelete,
  onToggleStatus,
}: Props) {
  const isDynamic = qrMode === "dynamic";
  const status = getStatus(qr);
  const isActive = status === "active";

  return (
    <div className="flex w-full min-w-0 flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0 flex-1 space-y-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Retour au dashboard
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="break-words text-3xl font-black italic uppercase tracking-tighter text-white">
            {getDisplayName(qr)}
          </h1>
          <StatusBadge status={status} />
          <ModeBadge mode={qrMode} />
        </div>

        <p className="max-w-2xl break-words text-sm text-white/45">
          {isDynamic
            ? "Vue avancée du QR code, de son contenu, de ses scans et de ses tendances."
            : "Vue détaillée du QR code, de son contenu et de ses informations. Ce QR est statique, donc sans suivi des scans."}
        </p>
      </div>

      <div className="flex shrink-0 flex-wrap gap-3">
        <button
          type="button"
          onClick={onToggleStatus}
          disabled={isTogglingStatus}
          className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-[0.18em] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60 ${
            isActive
              ? "border border-amber-500/20 bg-amber-500/10 text-amber-300 hover:scale-[1.02] hover:bg-amber-500/20"
              : "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300 hover:scale-[1.02] hover:bg-emerald-500/20"
          }`}
        >
          <Power size={16} />
          {isTogglingStatus
            ? "Mise à jour..."
            : isActive
            ? "Désactiver"
            : "Activer"}
        </button>

        <Link
          href={`/dashboard/qr/${qr.id}/edit`}
          className="group inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-white shadow-lg shadow-cyan-500/25 transition-all duration-300 hover:scale-[1.02] hover:bg-white"
        >
          <Pencil
            size={16}
            className="text-white transition-colors duration-300 group-hover:text-cyan-500"
          />
          <span className="transition-colors duration-300 group-hover:text-cyan-500">
            Modifier
          </span>
        </Link>

        <button
          type="button"
          onClick={onDelete}
          disabled={isDeleting}
          className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-red-300 transition hover:scale-[1.02] hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={16} />
          {isDeleting ? "Suppression..." : "Supprimer"}
        </button>
      </div>
    </div>
  );
}
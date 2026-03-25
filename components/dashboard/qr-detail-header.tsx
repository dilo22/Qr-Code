"use client";

import Link from "next/link";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

type Props = {
  qrId: string;
  title: string;
  status: string;
  isDeleting: boolean;
  onDelete: () => void;
};

function Badge({ status }: { status: string }) {
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

export function QrDetailHeader({
  qrId,
  title,
  status,
  isDeleting,
  onDelete,
}: Props) {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/50 transition hover:text-white"
        >
          <ArrowLeft size={16} />
          Retour au dashboard
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            {title}
          </h1>
          <Badge status={status} />
          <span className="inline-flex items-center rounded-xl border border-cyan-400/15 bg-cyan-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-cyan-300">
            analytics premium
          </span>
        </div>

        <p className="max-w-2xl text-sm text-white/45">
          Vue avancée du QR code, de son contenu, de ses scans, de ses tendances
          et de ses signaux d’activité.
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href={`/dashboard/qr/${qrId}/edit`}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:scale-[1.02] hover:bg-cyan-400"
        >
          <Pencil size={16} />
          Modifier
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
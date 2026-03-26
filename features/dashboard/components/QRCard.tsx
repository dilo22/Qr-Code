"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Clock, BarChart3, Pencil, Trash2, Info } from "lucide-react";
import type { QRCodeItem } from "@/features/dashboard/types/dashboard.types";
import {
  getProjectDisplayName,
  getProjectStatus,
  formatLastScan,
} from "@/features/dashboard/lib/dashboard.utils";
import MiniQR from "./MiniQR";

type Props = {
  project: QRCodeItem;
  scansCount: number;
  lastScan?: string;
  isDeleting: boolean;
  onDelete: (projectId: string, projectName: string) => void;
};

function Badge({
  children,
  status,
}: {
  children: React.ReactNode;
  status: string;
}) {
  const colors: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400",
    paused: "bg-amber-500/20 text-amber-400",
    archived: "bg-white/10 text-white/40",
  };

  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter ${
        colors[status] || colors.archived
      }`}
    >
      {children}
    </span>
  );
}

function ModeBadge({ mode }: { mode: "dynamic" | "static" }) {
  return (
    <span
      className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-tighter ${
        mode === "dynamic"
          ? "bg-emerald-500/15 text-emerald-300"
          : "bg-white/10 text-white/50"
      }`}
    >
      {mode === "dynamic" ? "dynamique" : "statique"}
    </span>
  );
}

function IconButton({
  icon,
  danger = false,
  label,
}: {
  icon: React.ReactNode;
  danger?: boolean;
  label: string;
}) {
  return (
    <div className="group relative">
      <div
        className={`flex items-center justify-center rounded-xl p-3 transition-all duration-300 ${
          danger
            ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
            : "text-white/40 hover:bg-white/5 hover:text-white"
        }`}
      >
        {icon}
      </div>

      <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-[10px] font-bold uppercase text-white opacity-0 transition-all group-hover:opacity-100">
        {label}
      </div>
    </div>
  );
}

export default function QRCard({
  project,
  scansCount,
  lastScan,
  isDeleting,
  onDelete,
}: Props) {
  const router = useRouter();

  const status = getProjectStatus(project);
  const projectName = getProjectDisplayName(project);
  const qrMode: "dynamic" | "static" =
    project.qr_mode === "static" ? "static" : "dynamic";

  const primaryActionLabel = qrMode === "dynamic" ? "Analyses" : "Infos";
  const primaryActionTitle =
    qrMode === "dynamic" ? "Voir les analyses" : "Voir les informations";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`/dashboard/qr/${project.id}`)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          router.push(`/dashboard/qr/${project.id}`);
        }
      }}
      className="group flex cursor-pointer items-center gap-6 rounded-[2.5rem] border border-white/5 bg-white/[0.03] p-5 transition-all hover:border-white/10 hover:bg-white/[0.06]"
    >
      <MiniQR project={project} />

      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-3">
          <h4 className="truncate text-lg font-black italic uppercase">
            {projectName}
          </h4>
          <Badge status={status}>{status}</Badge>
          <ModeBadge mode={qrMode} />
        </div>

        <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
          {project.type}
        </div>

        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tight text-white/40">
          <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1">
            <Eye className="h-3 w-3 text-cyan-400" />
            {qrMode === "dynamic" ? `${scansCount} Scans` : "Sans tracking"}
          </span>

          <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1">
            <Clock className="h-3 w-3 text-purple-400" />
            {qrMode === "dynamic"
              ? formatLastScan(lastScan)
              : "Retéléchargeable"}
          </span>
        </div>
      </div>

      <div className="flex translate-x-2 gap-6 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
        <Link
          href={`/dashboard/qr/${project.id}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div title={primaryActionTitle}>
            <IconButton
              icon={
                qrMode === "dynamic" ? (
                  <BarChart3 size={18} />
                ) : (
                  <Info size={18} />
                )
              }
              label={primaryActionLabel}
            />
          </div>
        </Link>

        <Link
          href={`/dashboard/qr/${project.id}/edit`}
          onClick={(e) => e.stopPropagation()}
        >
          <div title="Modifier">
            <IconButton icon={<Pencil size={18} />} label="Modifier" />
          </div>
        </Link>

        <button
          type="button"
          disabled={isDeleting}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(project.id, projectName);
          }}
        >
          <div title="Supprimer">
            <IconButton
              danger
              icon={<Trash2 size={18} className={isDeleting ? "animate-pulse" : ""} />}
              label="Supprimer"
            />
          </div>
        </button>
      </div>
    </div>
  );
}
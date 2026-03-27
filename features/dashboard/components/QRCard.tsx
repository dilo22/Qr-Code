"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  Clock,
  BarChart3,
  Pencil,
  Trash2,
  Info,
  ChevronRight,
  Zap,
} from "lucide-react";
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
    active:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20",
    paused:
      "border-amber-500/30 bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20",
    archived: "border-white/10 bg-white/5 text-white/40",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-widest backdrop-blur-md ${
        colors[status] || colors.archived
      }`}
    >
      <span
        className={`mr-1.5 h-1 w-1 rounded-full ${
          status === "active" ? "animate-pulse bg-emerald-400" : "bg-current"
        }`}
      />
      {children}
    </span>
  );
}

function StatChip({
  icon,
  value,
  accent,
}: {
  icon: React.ReactNode;
  value: string;
  accent?: "cyan" | "purple";
}) {
  const theme =
    accent === "purple"
      ? "border-purple-500/15 bg-purple-500/5 text-purple-300"
      : "border-cyan-500/15 bg-cyan-500/5 text-cyan-300";

  return (
    <div
      className={`inline-flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-[10px] font-medium ${theme}`}
    >
      <span className="shrink-0 opacity-90">{icon}</span>
      <span className="truncate text-white/80">{value}</span>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
}) {
  return (
    <div
      className={`group/btn relative flex h-9 w-9 items-center justify-center rounded-xl border transition-all duration-300 active:scale-90 ${
        danger
          ? "border-red-500/20 bg-red-500/5 text-red-400 hover:bg-red-500/20 hover:text-red-300"
          : "border-white/10 bg-white/5 text-white/50 hover:border-cyan-500/30 hover:bg-cyan-500/10 hover:text-cyan-300"
      }`}
    >
      {icon}

      <div className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 scale-95 whitespace-nowrap rounded-md border border-white/10 bg-zinc-900 px-2 py-1 text-[10px] font-bold text-white opacity-0 transition-all group-hover/btn:scale-100 group-hover/btn:opacity-100">
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

  return (
    <div
      onClick={() => router.push(`/dashboard/qr/${project.id}`)}
      className="group relative flex items-center gap-4 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900/50 to-black/50 px-4 py-4 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_50px_-12px_rgba(34,211,238,0.2)]"
    >
      <div className="absolute -left-20 -top-20 h-40 w-40 rounded-full bg-cyan-500/10 blur-[80px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      <div className="relative shrink-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent p-[1px] transition-transform duration-500 group-hover:scale-[1.03]">
        <div className="rounded-2xl bg-zinc-950 p-1.5">
          <MiniQR project={project} />
        </div>

        {qrMode === "dynamic" && (
          <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-black shadow-lg shadow-cyan-500/20">
            <Zap size={10} fill="currentColor" />
          </div>
        )}
      </div>

      <div className="relative min-w-0 flex-1">
        <div className="flex min-w-0 items-center gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <Badge status={status}>{status}</Badge>

              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">
                // {project.type}
              </span>
            </div>

            <h4
              className="truncate text-xl font-black tracking-tighter text-zinc-100 transition-colors group-hover:text-white"
              title={projectName}
            >
              {projectName}
            </h4>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StatChip
                icon={<Eye size={12} />}
                value={qrMode === "dynamic" ? `${scansCount} scans` : "Statique"}
                accent="cyan"
              />

              <StatChip
                icon={<Clock size={12} />}
                value={
                  qrMode === "dynamic"
                    ? formatLastScan(lastScan)
                    : "No tracking"
                }
                accent="purple"
              />
            </div>
          </div>

          <div className="hidden items-center gap-2 opacity-0 transition-all duration-300 group-hover:opacity-100 md:flex">
            <Link
              href={`/dashboard/qr/${project.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <ActionButton
                icon={
                  qrMode === "dynamic" ? (
                    <BarChart3 size={16} />
                  ) : (
                    <Info size={16} />
                  )
                }
                label="Analyses"
              />
            </Link>

            <Link
              href={`/dashboard/qr/${project.id}/edit`}
              onClick={(e) => e.stopPropagation()}
            >
              <ActionButton icon={<Pencil size={16} />} label="Éditer" />
            </Link>

            <button
              disabled={isDeleting}
              onClick={(e) => {
                e.stopPropagation();
                onDelete(project.id, projectName);
              }}
            >
              <ActionButton
                danger
                icon={
                  <Trash2
                    size={16}
                    className={isDeleting ? "animate-bounce" : ""}
                  />
                }
                label="Supprimer"
              />
            </button>
          </div>
        </div>
      </div>

      <div className="relative shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/5 bg-white/5 text-white/20 transition-all duration-500 group-hover:border-cyan-500/50 group-hover:bg-cyan-500 group-hover:text-black group-hover:shadow-[0_0_20px_rgba(34,211,238,0.4)]">
          <ChevronRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-0.5" />
        </div>
      </div>
    </div>
  );
}
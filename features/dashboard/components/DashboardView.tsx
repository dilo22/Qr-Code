"use client";

import { useMemo, useState } from "react";
import { QrCode, RefreshCw, Trash2 } from "lucide-react";
import type { SelectOption, SortOption } from "@/features/dashboard/types/dashboard.types";
import { getProjectDisplayName } from "@/features/dashboard/lib/dashboard.utils";
import { useDashboardData } from "@/features/dashboard/hooks/useDashboardData";
import DashboardHeader from "@/features/dashboard/components/DashboardHeader";
import DashboardFilters from "@/features/dashboard/components/DashboardFilters";
import QRCard from "@/features/dashboard/components/QRCard";

export function DashboardView() {
  const {
    loading,
    error,
    projects,
    scans,
    profileName,
    deletingId,
    deleteProject,
    loadData,
  } = useDashboardData();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const scansByProject = useMemo(() => {
    const countMap = new Map<string, number>();
    const lastScanMap = new Map<string, string>();

    for (const scan of scans) {
      countMap.set(scan.qr_code_id, (countMap.get(scan.qr_code_id) || 0) + 1);

      if (!lastScanMap.has(scan.qr_code_id)) {
        lastScanMap.set(scan.qr_code_id, scan.scanned_at);
      }
    }

    return { countMap, lastScanMap };
  }, [scans]);

  const availableTypes = useMemo(() => {
    const types = Array.from(
      new Set(projects.map((project) => project.type).filter(Boolean))
    );
    return types.sort((a, b) => a.localeCompare(b));
  }, [projects]);

  const typeOptions = useMemo<SelectOption[]>(
    () => [
      { label: "Tous les types", value: "all" },
      ...availableTypes.map((type) => ({
        label: type,
        value: type,
      })),
    ],
    [availableTypes]
  );

  const sortOptions: SelectOption[] = [
    { label: "Plus récents", value: "recent" },
    { label: "Plus anciens", value: "oldest" },
    { label: "Nom A → Z", value: "name" },
    { label: "Plus de scans", value: "scans" },
  ];

  const filteredProjects = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const filtered = projects.filter((project) => {
      const displayName = getProjectDisplayName(project).toLowerCase();
      const type = (project.type || "").toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        displayName.includes(normalizedSearch) ||
        type.includes(normalizedSearch);

      const matchesType =
        selectedType === "all" ||
        (project.type || "").toLowerCase() === selectedType.toLowerCase();

      return matchesSearch && matchesType;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "recent") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }

      if (sortBy === "oldest") {
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      }

      if (sortBy === "name") {
        return getProjectDisplayName(a).localeCompare(getProjectDisplayName(b));
      }

      if (sortBy === "scans") {
        return (
          (scansByProject.countMap.get(b.id) || 0) -
          (scansByProject.countMap.get(a.id) || 0)
        );
      }

      return 0;
    });
  }, [projects, searchQuery, selectedType, sortBy, scansByProject]);

  return (
    <div className="animate-in space-y-10 fade-in duration-700">
      <DashboardHeader profileName={profileName} />

      <div className="space-y-4">
        <DashboardFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          sortBy={sortBy}
          setSortBy={setSortBy}
          typeOptions={typeOptions}
          sortOptions={sortOptions}
        />

        <h3 className="text-lg font-black italic uppercase tracking-widest text-white/40">
          Vos QR Codes ({filteredProjects.length})
        </h3>

        {loading ? (
          <div className="flex animate-pulse items-center gap-3 text-xs font-black uppercase tracking-widest text-white/20">
            <div className="h-2 w-2 rounded-full bg-cyan-500" />
            Chargement des données...
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-4 rounded-[2.5rem] border border-red-500/10 bg-red-500/5 p-12 text-center">
            <p className="text-sm font-bold text-red-400">
              Impossible de charger vos QR codes.
            </p>
            <button
              onClick={() => void loadData()}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-2.5 text-xs font-bold text-white/70 transition hover:bg-white/[0.08]"
            >
              <RefreshCw size={13} /> Réessayer
            </button>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.02] p-12 text-center">
            <QrCode className="mb-4 h-12 w-12 text-white/10" />
            <p className="font-bold italic text-white/30">
              Aucun QR code créé pour le moment.
            </p>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="flex flex-col items-center rounded-[2.5rem] border border-dashed border-white/5 bg-white/[0.02] p-12 text-center">
            <QrCode className="mb-4 h-12 w-12 text-white/10" />
            <p className="font-bold italic text-white/30">
              Aucun résultat pour cette recherche.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <QRCard
                key={project.id}
                project={project}
                scansCount={scansByProject.countMap.get(project.id) || 0}
                lastScan={scansByProject.lastScanMap.get(project.id)}
                isDeleting={deletingId === project.id}
                onDelete={(projectId, projectName) =>
                  setConfirmDelete({ id: projectId, name: projectName })
                }
              />
            ))}
          </div>
        )}
      </div>
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pb-10 sm:items-center">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="relative mx-4 w-full max-w-sm rounded-3xl border border-white/10 bg-[#080d18] p-6 shadow-2xl">
            <div className="mb-1 flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
                <Trash2 size={18} />
              </div>
              <p className="text-sm font-bold text-white/60">Supprimer ce QR code ?</p>
            </div>
            <p className="mb-6 ml-[52px] truncate text-base font-black text-white">
              {confirmDelete.name}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-bold text-white/60 transition hover:bg-white/5"
              >
                Annuler
              </button>
              <button
                onClick={async () => {
                  await deleteProject(confirmDelete.id);
                  setConfirmDelete(null);
                }}
                disabled={deletingId === confirmDelete.id}
                className="flex-1 rounded-xl bg-red-500/90 py-3 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
              >
                {deletingId === confirmDelete.id ? "Suppression..." : "Supprimer"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardView;
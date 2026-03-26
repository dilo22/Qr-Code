"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Eye,
  Clock,
  QrCode,
  BarChart3,
  Settings,
  Plus,
  Search,
  Trash2,
  Filter,
  ArrowUpDown,
  ChevronDown,
  Check,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import QRCodeStyling from "qr-code-styling";
import { buildQrOptions } from "@/components/dashboard/qr-utils";
import type { QrDesignData } from "@/components/dashboard/create-qr-design";

type QRCodeItem = {
  id: string;
  name: string | null;
  title?: string | null;
  type: string;
  status?: string | null;
  created_at: string;
  qr_value?: string | null;
  design?: Partial<QrDesignData> | null;
  content?: any;
};

type QRScanItem = {
  qr_code_id: string;
  scanned_at: string;
};

type SortOption = "recent" | "oldest" | "name" | "scans";

type SelectOption = {
  label: string;
  value: string;
};

function getProjectDisplayName(project: QRCodeItem) {
  return project.name || project.title || "Sans titre";
}

function getProjectStatus(project: QRCodeItem) {
  return (project.status || "active").toLowerCase();
}

function getPreviewValue(project: QRCodeItem) {
  if (project.qr_value) return project.qr_value;
  if (project.content?.url) return project.content.url;
  if (project.content?.text) return project.content.text;
  return project.id;
}

function MiniQR({ project }: { project: QRCodeItem }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const value = getPreviewValue(project);

    const design: Partial<QrDesignData> = {
      foreground: "#000000",
      background: "#ffffff",
      useGradient: false,
      gradientColor2: "#3b82f6",
      margin: 8,
      dotsStyle: "square",
      cornersStyle: "square",
      errorCorrectionLevel: "M",
      logoUrl: "",
      logoSize: 0.4,
      ...(project.design || {}),
    };

    const options = buildQrOptions(value, design, 96);
    options.imageOptions = {
      ...options.imageOptions,
      margin: 2,
    };

    const qrCode = new QRCodeStyling(options);

    ref.current.innerHTML = "";
    qrCode.append(ref.current);

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [project]);

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-lg">
      <div ref={ref} className="flex h-full w-full items-center justify-center" />
    </div>
  );
}

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

function IconButton({
  icon,
  danger = false,
}: {
  icon: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-xl p-3 transition-all duration-300 ${
        danger
          ? "text-red-400 hover:bg-red-500/10 hover:text-red-300"
          : "text-white/40 hover:bg-white/5 hover:text-white"
      }`}
    >
      {icon}
    </div>
  );
}

function formatLastScan(date?: string) {
  if (!date) return "Jamais";

  const now = new Date().getTime();
  const scan = new Date(date).getTime();
  const diffMin = Math.floor((now - scan) / 1000 / 60);

  if (diffMin < 1) return "À l’instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;

  return `Il y a ${Math.floor(diffHours / 24)} j`;
}

function CustomSelect({
  icon,
  value,
  options,
  onChange,
  placeholder,
  minWidthClass = "min-w-[180px]",
}: {
  icon?: React.ReactNode;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  minWidthClass?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className={`relative ${minWidthClass}`}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-left text-sm text-white outline-none transition hover:border-white/20 hover:bg-white/[0.05] focus:border-cyan-500/40"
      >
        <div className="flex min-w-0 items-center gap-3">
          {icon && <span className="shrink-0 text-white/30">{icon}</span>}
          <span className="truncate">
            {selectedOption?.label || placeholder || "Sélectionner"}
          </span>
        </div>

        <ChevronDown
          size={16}
          className={`shrink-0 text-white/40 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute left-0 top-[calc(100%+8px)] z-50 w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d]/95 shadow-2xl backdrop-blur-xl">
          <div className="max-h-64 overflow-y-auto p-2">
            {options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition-all ${
                    active
                      ? "bg-white text-black"
                      : "text-white/70 hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {active && <Check size={14} className="shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function DashboardView() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<QRCodeItem[]>([]);
  const [scans, setScans] = useState<QRScanItem[]>([]);
  const [profileName, setProfileName] = useState("Utilisateur");

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        router.push("/auth");
      }
    };

    checkSession();
  }, [router]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const [{ data: profile }, { data: qrCodes }, { data: qrScans }] =
          await Promise.all([
            supabase
              .from("profiles")
              .select("full_name")
              .eq("id", user.id)
              .maybeSingle(),
            supabase
              .from("qr_codes")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false }),
            supabase
              .from("qr_scans")
              .select("qr_code_id, scanned_at")
              .order("scanned_at", { ascending: false }),
          ]);

        if (profile?.full_name) {
          setProfileName(profile.full_name);
        }

        const safeQrCodes = (qrCodes || []) as QRCodeItem[];
        setProjects(safeQrCodes);

        const userQrIds = new Set(safeQrCodes.map((q) => q.id));
        setScans(
          ((qrScans || []) as QRScanItem[]).filter((s) =>
            userQrIds.has(s.qr_code_id)
          )
        );
      } catch (error) {
        console.error("Erreur dashboard :", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
        project.type.toLowerCase() === selectedType.toLowerCase();

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

  const handleDelete = async (projectId: string, projectName: string) => {
    const confirmed = window.confirm(
      `Supprimer définitivement "${projectName}" ? Cette action est irréversible.`
    );

    if (!confirmed) return;

    try {
      setDeletingId(projectId);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Utilisateur non connecté.");

      const { error } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", projectId)
        .eq("user_id", user.id);

      if (error) throw error;

      setProjects((prev) =>
        prev.filter((project) => project.id !== projectId)
      );
      setScans((prev) => prev.filter((scan) => scan.qr_code_id !== projectId));
    } catch (error) {
      console.error("Erreur suppression QR code :", error);
      window.alert("Impossible de supprimer ce QR code.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="animate-in space-y-10 fade-in duration-700">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Tableau de Bord
          </h2>
          <p className="text-sm font-medium italic text-white/40">
            Bienvenue {profileName}, voici vos projets QR réels.
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="group flex items-center gap-3 rounded-2xl bg-cyan-500 px-8 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-cyan-500/20 transition-all duration-300 hover:scale-105 hover:bg-white"
        >
          <Plus
            className="text-white transition-colors group-hover:text-cyan-500"
            size={16}
            strokeWidth={3}
          />
          <span className="transition-colors group-hover:text-cyan-500">
            Nouveau Projet
          </span>
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher par nom ou type..."
              className="w-full rounded-2xl border border-white/10 bg-black/30 py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/25 focus:border-cyan-500/40"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <CustomSelect
              icon={<Filter size={16} />}
              value={selectedType}
              options={typeOptions}
              onChange={setSelectedType}
              placeholder="Tous les types"
            />

            <CustomSelect
              icon={<ArrowUpDown size={16} />}
              value={sortBy}
              options={sortOptions}
              onChange={(value) => setSortBy(value as SortOption)}
              placeholder="Tri"
            />
          </div>
        </div>

        <h3 className="text-lg font-black italic uppercase tracking-widest text-white/40">
          Vos QR Codes ({filteredProjects.length})
        </h3>

        {loading ? (
          <div className="flex animate-pulse items-center gap-3 text-xs font-black uppercase tracking-widest text-white/20">
            <div className="h-2 w-2 rounded-full bg-cyan-500" />
            Chargement des données...
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
            {filteredProjects.map((project) => {
              const status = getProjectStatus(project);
              const projectName = getProjectDisplayName(project);
              const isDeleting = deletingId === project.id;

              return (
                <div
                  key={project.id}
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
                    </div>

                    <div className="mb-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/25">
                      {project.type}
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-tight text-white/40">
                      <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1">
                        <Eye className="h-3 w-3 text-cyan-400" />
                        {scansByProject.countMap.get(project.id) || 0} Scans
                      </span>

                      <span className="flex items-center gap-1.5 rounded-lg bg-white/5 px-2 py-1">
                        <Clock className="h-3 w-3 text-purple-400" />
                        {formatLastScan(scansByProject.lastScanMap.get(project.id))}
                      </span>
                    </div>
                  </div>

                  <div className="flex translate-x-2 gap-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                    <Link
                      href={`/dashboard/qr/${project.id}`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton icon={<BarChart3 size={18} />} />
                    </Link>

                    <Link
                      href={`/dashboard/qr/${project.id}/edit`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <IconButton icon={<Settings size={18} />} />
                    </Link>

                    <button
                      type="button"
                      disabled={isDeleting}
                      onClick={(e) => {
                        e.stopPropagation();
                        void handleDelete(project.id, projectName);
                      }}
                    >
                      <IconButton
                        danger
                        icon={
                          <Trash2
                            size={18}
                            className={isDeleting ? "animate-pulse" : ""}
                          />
                        }
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
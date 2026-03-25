"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  Eye,
  Pencil,
  QrCode,
  Activity,
  Palette,
  Type,
  CheckCircle2,
  Smartphone,
  Monitor,
  Tablet,
  Globe,
  TrendingUp,
  TrendingDown,
  Sparkles,
  MapPin,
  ScanLine,
  AlertTriangle,
  Trash2,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import QRCodeStyling from "qr-code-styling";
import { buildQrOptions } from "@/components/dashboard/qr-utils";
import type { QrDesignData } from "@/components/dashboard/create-qr-design";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Props = {
  qrId: string;
};

type QRCodeItem = {
  id: string;
  name: string | null;
  title?: string | null;
  type: string;
  status?: string | null;
  created_at: string | null;
  updated_at?: string | null;
  qr_value?: string | null;
  design?: Partial<QrDesignData> | null;
  content?: unknown;
  color?: string | null;
};

type QRScanItem = {
  id?: string;
  qr_code_id: string;
  scanned_at: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
};

type DeviceType = "mobile" | "desktop" | "tablet" | "other";

type ScanSeriesPoint = {
  date: string;
  label: string;
  scans: number;
};

type DeviceBreakdownItem = {
  name: DeviceType;
  value: number;
  percentage: number;
};

type GeoBreakdownItem = {
  country: string;
  city: string | null;
  count: number;
};

function parseContent(content: unknown) {
  if (!content) return null;
  if (typeof content === "object") return content;

  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch {
      return null;
    }
  }

  return null;
}

function getDisplayName(qr: QRCodeItem) {
  return qr.name || qr.title || "Sans titre";
}

function getStatus(qr: QRCodeItem) {
  return (qr.status || "active").toLowerCase();
}

function getPreviewValue(qr: QRCodeItem) {
  if (qr.qr_value) return qr.qr_value;

  const parsedContent = parseContent(qr.content);

  if (parsedContent && typeof parsedContent === "object") {
    const contentObj = parsedContent as Record<string, unknown>;
    if (typeof contentObj.url === "string") return contentObj.url;
    if (typeof contentObj.text === "string") return contentObj.text;
    if (typeof contentObj.value === "string") return contentObj.value;
  }

  return qr.id;
}

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatCompactDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function formatLastScan(date?: string | null) {
  if (!date) return "Jamais";

  const now = new Date().getTime();
  const scan = new Date(date).getTime();
  const diffMin = Math.floor((now - scan) / 1000 / 60);

  if (diffMin < 1) return "À l’instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Il y a ${diffDays} j`;

  return formatDate(date);
}

function getDaysSince(date?: string | null) {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getGrowth(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

function normalizeDevice(device?: string | null): DeviceType {
  const value = (device || "").toLowerCase().trim();

  if (value.includes("mobile") || value.includes("iphone") || value.includes("android")) {
    return "mobile";
  }

  if (value.includes("tablet") || value.includes("ipad")) {
    return "tablet";
  }

  if (
    value.includes("desktop") ||
    value.includes("mac") ||
    value.includes("windows") ||
    value.includes("linux")
  ) {
    return "desktop";
  }

  return "other";
}

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

function InfoCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/8 bg-white/[0.04] p-5 backdrop-blur-xl">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-white/90">{value}</div>
      {hint ? <div className="mt-2 text-xs text-white/45">{hint}</div> : null}
    </div>
  );
}

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-[2rem] border border-white/8 bg-white/[0.04] backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.08),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.10),transparent_30%)]" />
      <div className="relative p-6">
        <div className="mb-5">
          <h2 className="text-lg font-black italic uppercase tracking-widest text-white">
            {title}
          </h2>
          {subtitle ? <p className="mt-2 text-sm text-white/45">{subtitle}</p> : null}
        </div>
        {children}
      </div>
    </div>
  );
}

function PreviewQR({ qr }: { qr: QRCodeItem }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const value = getPreviewValue(qr);

    const design: Partial<QrDesignData> = {
      foreground: "#000000",
      background: "#ffffff",
      useGradient: false,
      gradientColor2: "#3b82f6",
      margin: 8,
      dotsStyle: "square",
      cornersStyle: "square",
      errorCorrectionLevel: "M",
      logoUrl: null,
      logoSize: 0.4,
      ...(qr.design || {}),
    };

    const options = buildQrOptions(value, design, 220);

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
  }, [qr]);

  return (
    <div className="flex items-center justify-center rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl">
      <div ref={ref} className="flex min-h-[220px] min-w-[220px] items-center justify-center" />
    </div>
  );
}

function renderContentDetails(content: unknown) {
  const parsedContent = parseContent(content);

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
            {typeof value === "object" ? JSON.stringify(value, null, 2) : String(value)}
          </span>
        </div>
      ))}
    </div>
  );
}

function DeviceIcon({ device }: { device: DeviceType }) {
  if (device === "mobile") return <Smartphone className="h-4 w-4" />;
  if (device === "tablet") return <Tablet className="h-4 w-4" />;
  if (device === "desktop") return <Monitor className="h-4 w-4" />;
  return <ScanLine className="h-4 w-4" />;
}

function EmptyChartState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-white/45">
      {text}
    </div>
  );
}

const PIE_COLORS = ["#22d3ee", "#a855f7", "#22c55e", "#f59e0b"];

export default function QrDetailsView({ qrId }: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [qr, setQr] = useState<QRCodeItem | null>(null);
  const [scans, setScans] = useState<QRScanItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQrDetails = async () => {
      if (!qrId) {
        setError("ID du QR code manquant.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setError("Utilisateur non connecté.");
          setLoading(false);
          return;
        }

        const { data: qrData, error: qrError } = await supabase
          .from("qr_codes")
          .select("*")
          .eq("id", qrId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (qrError) throw qrError;
        if (!qrData) throw new Error("QR introuvable ou accès refusé.");

        const { data: scansData, error: scansError } = await supabase
          .from("qr_scans")
          .select("id, qr_code_id, scanned_at, country, city, device")
          .eq("qr_code_id", qrId)
          .order("scanned_at", { ascending: false });

        if (scansError) throw scansError;

        setQr(qrData as QRCodeItem);
        setScans((scansData || []) as QRScanItem[]);
      } catch (err: any) {
        console.error("DETAIL ERROR:", err);
        setError(err?.message || "Impossible de charger ce QR code.");
      } finally {
        setLoading(false);
      }
    };

    loadQrDetails();
  }, [qrId]);

  const handleDelete = async () => {
    if (!qr) return;

    const confirmed = window.confirm(
      `Supprimer définitivement le QR code "${getDisplayName(qr)}" ?`
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Utilisateur non connecté.");

      const { error: scansDeleteError } = await supabase
        .from("qr_scans")
        .delete()
        .eq("qr_code_id", qr.id);

      if (scansDeleteError) throw scansDeleteError;

      const { data: deletedQr, error: qrDeleteError } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", qr.id)
        .eq("user_id", user.id)
        .select("id");

      if (qrDeleteError) throw qrDeleteError;

      if (!deletedQr || deletedQr.length === 0) {
        throw new Error(
          "Suppression refusée ou impossible. Vérifie les policies DELETE dans Supabase."
        );
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Impossible de supprimer ce QR code.");
      setIsDeleting(false);
    }
  };

  const analytics = useMemo(() => {
    const safeScans = scans.filter((scan) => scan.scanned_at);

    const totalScans = safeScans.length;
    const lastScan = safeScans[0]?.scanned_at || null;

    const now = new Date();
    const start30 = new Date();
    start30.setDate(now.getDate() - 29);
    start30.setHours(0, 0, 0, 0);

    const scansByDay = new Map<string, number>();
    for (let i = 0; i < 30; i++) {
      const date = new Date(start30);
      date.setDate(start30.getDate() + i);
      const key = date.toISOString().slice(0, 10);
      scansByDay.set(key, 0);
    }

    safeScans.forEach((scan) => {
      const key = new Date(scan.scanned_at as string).toISOString().slice(0, 10);
      if (scansByDay.has(key)) {
        scansByDay.set(key, (scansByDay.get(key) || 0) + 1);
      }
    });

    const scansSeries: ScanSeriesPoint[] = Array.from(scansByDay.entries()).map(
      ([date, value]) => ({
        date,
        label: formatCompactDate(date),
        scans: value,
      })
    );

    const last7 = safeScans.filter((scan) => {
      const d = new Date(scan.scanned_at as string).getTime();
      return d >= Date.now() - 7 * 24 * 60 * 60 * 1000;
    }).length;

    const prev7 = safeScans.filter((scan) => {
      const d = new Date(scan.scanned_at as string).getTime();
      return (
        d < Date.now() - 7 * 24 * 60 * 60 * 1000 &&
        d >= Date.now() - 14 * 24 * 60 * 60 * 1000
      );
    }).length;

    const last24h = safeScans.filter((scan) => {
      const d = new Date(scan.scanned_at as string).getTime();
      return d >= Date.now() - 24 * 60 * 60 * 1000;
    }).length;

    const growth7d = getGrowth(last7, prev7);

    const deviceMap = new Map<DeviceType, number>();
    safeScans.forEach((scan) => {
      const device = normalizeDevice(scan.device);
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    const deviceBreakdown: DeviceBreakdownItem[] = Array.from(deviceMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        percentage: totalScans ? Number(((value / totalScans) * 100).toFixed(1)) : 0,
      }))
      .sort((a, b) => b.value - a.value);

    const geoMap = new Map<string, GeoBreakdownItem>();
    safeScans.forEach((scan) => {
      const country = scan.country || "Inconnu";
      const city = scan.city || null;
      const key = `${country}::${city || ""}`;

      geoMap.set(key, {
        country,
        city,
        count: (geoMap.get(key)?.count || 0) + 1,
      });
    });

    const geoBreakdown = Array.from(geoMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);

    const daysSinceLastScan = getDaysSince(lastScan);
    const inactivityScore =
      lastScan === null
        ? 100
        : Math.min(
            100,
            Math.max(0, Math.round((daysSinceLastScan || 0) * 4 + (last7 === 0 ? 25 : 0)))
          );

    const insights: Array<{
      title: string;
      description: string;
      tone: "positive" | "warning" | "neutral";
    }> = [];

    if (totalScans === 0) {
      insights.push({
        tone: "neutral",
        title: "Aucun scan détecté",
        description:
          "Ce QR n’a pas encore généré d’activité. Dès les premiers scans, les tendances apparaîtront ici.",
      });
    } else {
      if (growth7d > 0) {
        insights.push({
          tone: "positive",
          title: `Croissance de +${growth7d}%`,
          description:
            "Les scans des 7 derniers jours sont supérieurs à ceux de la période précédente.",
        });
      } else if (growth7d < 0) {
        insights.push({
          tone: "warning",
          title: `${growth7d}% sur 7 jours`,
          description:
            "L’activité ralentit. Ce QR mérite peut-être une relance ou un meilleur placement.",
        });
      }

      const dominantDevice = deviceBreakdown[0];
      if (dominantDevice && dominantDevice.percentage >= 60) {
        insights.push({
          tone: "neutral",
          title: `${dominantDevice.percentage}% via ${dominantDevice.name}`,
          description:
            "La majorité des scans provient du même type d’appareil. Optimise la destination pour ce support.",
        });
      }

      if ((daysSinceLastScan || 0) >= 7) {
        insights.push({
          tone: "warning",
          title: "QR potentiellement inactif",
          description: `Aucun scan récent depuis ${daysSinceLastScan} jours.`,
        });
      }

      if (last24h > 0) {
        insights.push({
          tone: "positive",
          title: `${last24h} scan${last24h > 1 ? "s" : ""} sur 24h`,
          description:
            "Le QR reste actif très récemment, ce qui est un bon signal d’engagement.",
        });
      }
    }

    return {
      totalScans,
      lastScan,
      last24h,
      last7,
      prev7,
      growth7d,
      scansSeries,
      deviceBreakdown,
      geoBreakdown,
      daysSinceLastScan,
      inactivityScore,
      insights: insights.slice(0, 4),
      recentScans: safeScans.slice(0, 12),
    };
  }, [scans]);

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
    <div className="relative animate-in space-y-8 fade-in duration-700">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_22%),radial-gradient(circle_at_top_right,rgba(168,85,247,0.08),transparent_20%),radial-gradient(circle_at_bottom_center,rgba(59,130,246,0.06),transparent_25%)]" />

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
              {getDisplayName(qr)}
            </h1>
            <Badge status={getStatus(qr)} />
          </div>

          <p className="max-w-2xl text-sm text-white/45">
            Vue avancée du QR code, de son contenu, de ses scans et de ses tendances.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={`/dashboard/qr/${qr.id}/edit`}
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:scale-[1.02] hover:bg-cyan-400"
          >
            <Pencil size={16} />
            Modifier
          </Link>

          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-5 py-3 text-xs font-black uppercase tracking-[0.18em] text-red-300 transition hover:scale-[1.02] hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Trash2 size={16} />
            {isDeleting ? "Suppression..." : "Supprimer"}
          </button>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-4">
        <InfoCard
          icon={<Eye className="h-4 w-4 text-cyan-400" />}
          label="Total scans"
          value={<span className="text-2xl">{analytics.totalScans}</span>}
          hint={`${analytics.last24h} sur les dernières 24h`}
        />
        <InfoCard
          icon={<Activity className="h-4 w-4 text-purple-400" />}
          label="Croissance 7 jours"
          value={
            <span
              className={`inline-flex items-center gap-2 text-2xl ${
                analytics.growth7d >= 0 ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {analytics.growth7d >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {analytics.growth7d >= 0 ? "+" : ""}
              {analytics.growth7d}%
            </span>
          }
          hint={`${analytics.last7} scans vs ${analytics.prev7} la période précédente`}
        />
        <InfoCard
          icon={<Clock className="h-4 w-4 text-amber-400" />}
          label="Dernier scan"
          value={formatLastScan(analytics.lastScan)}
          hint={
            analytics.daysSinceLastScan !== null
              ? `${analytics.daysSinceLastScan} jour(s) d’écart`
              : "Aucun scan enregistré"
          }
        />
        <InfoCard
          icon={<AlertTriangle className="h-4 w-4 text-rose-400" />}
          label="Score d’inactivité"
          value={<span className="text-2xl">{analytics.inactivityScore}/100</span>}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {analytics.insights.length === 0 ? (
          <div className="xl:col-span-4">
            <EmptyChartState text="Aucun insight disponible pour le moment." />
          </div>
        ) : (
          analytics.insights.map((insight, index) => {
            const toneClasses =
              insight.tone === "positive"
                ? "border-emerald-400/15 bg-emerald-500/10"
                : insight.tone === "warning"
                ? "border-amber-400/15 bg-amber-500/10"
                : "border-cyan-400/15 bg-cyan-500/10";

            return (
              <div
                key={`${insight.title}-${index}`}
                className={`rounded-[2rem] border p-5 ${toneClasses}`}
              >
                <div className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-white/85">
                  <Sparkles className="h-4 w-4" />
                  Insight
                </div>
                <p className="text-sm font-semibold text-white">{insight.title}</p>
                <p className="mt-2 text-sm leading-6 text-white/55">{insight.description}</p>
              </div>
            );
          })
        )}
      </div>

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
          </div>

          <SectionCard
            title="Évolution des scans"
            subtitle="Tendance quotidienne sur les 30 derniers jours"
          >
            {analytics.scansSeries.length === 0 ? (
              <EmptyChartState text="Pas encore assez de données pour afficher la courbe." />
            ) : (
              <div className="min-w-0">
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={analytics.scansSeries}>
                    <defs>
                      <linearGradient id="scanGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.45} />
                        <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
                    <XAxis
                      dataKey="label"
                      tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "rgba(10,10,20,0.95)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 16,
                        color: "white",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="scans"
                      stroke="#22d3ee"
                      strokeWidth={2.5}
                      fill="url(#scanGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}
          </SectionCard>

          <div className="grid gap-6 xl:grid-cols-2">
            <SectionCard title="Devices" subtitle="Répartition des appareils détectés">
              {analytics.deviceBreakdown.length === 0 ? (
                <EmptyChartState text="Aucune donnée device disponible." />
              ) : (
                <div className="grid min-w-0 items-center gap-6 md:grid-cols-[220px_minmax(0,1fr)]">
                  <div className="min-w-0">
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart>
                        <Pie
                          data={analytics.deviceBreakdown}
                          dataKey="value"
                          nameKey="name"
                          innerRadius={58}
                          outerRadius={84}
                          paddingAngle={4}
                        >
                          {analytics.deviceBreakdown.map((_, index) => (
                            <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            background: "rgba(10,10,20,0.95)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: 16,
                            color: "white",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-3">
                    {analytics.deviceBreakdown.map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                          />
                          <div className="flex items-center gap-2 text-sm text-white/85">
                            <DeviceIcon device={item.name} />
                            <span className="capitalize">{item.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold text-white">{item.value}</div>
                          <div className="text-xs text-white/45">{item.percentage}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </SectionCard>

            <SectionCard
              title="Répartition géographique"
              subtitle="Pays et villes les plus actifs"
            >
              {analytics.geoBreakdown.length === 0 ? (
                <EmptyChartState text="Aucune donnée géographique disponible." />
              ) : (
                <div className="space-y-3">
                  {analytics.geoBreakdown.map((item, index) => (
                    <div
                      key={`${item.country}-${item.city}-${index}`}
                      className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 text-sm font-semibold text-white">
                          <Globe className="h-4 w-4 text-cyan-300" />
                          <span className="truncate">{item.country}</span>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-xs text-white/45">
                          <MapPin className="h-3.5 w-3.5" />
                          {item.city || "Ville inconnue"}
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-white">{item.count}</div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>
          </div>

          <SectionCard
            title="Historique récent des scans"
            subtitle="Feed live des derniers scans enregistrés"
          >
            {analytics.recentScans.length === 0 ? (
              <p className="text-sm text-white/45">Aucun scan pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {analytics.recentScans.map((scan, index) => {
                  const device = normalizeDevice(scan.device);

                  return (
                    <div
                      key={`${scan.scanned_at}-${index}`}
                      className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-white">
                          Scan #{analytics.totalScans - index}
                        </div>
                        <div className="mt-1 text-xs text-white/45">
                          {[scan.city, scan.country].filter(Boolean).join(", ") ||
                            "Localisation inconnue"}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs uppercase tracking-[0.16em] text-white/35">
                          {device}
                        </div>
                        <div className="mt-1 text-xs font-semibold text-white/55">
                          {formatDate(scan.scanned_at)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </SectionCard>

          <SectionCard
            title="Contenu du QR code"
            subtitle="Données encodées enregistrées"
          >
            {renderContentDetails(qr.content)}
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
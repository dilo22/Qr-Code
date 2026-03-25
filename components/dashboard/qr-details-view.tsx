"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import QRCodeStyling from "qr-code-styling";
import { buildQrOptions } from "@/components/dashboard/qr-utils";
import type { QrDesignData } from "@/components/dashboard/create-qr-design";

type Props = {
  qrId: string;
};

type QRCodeItem = {
  id: string;
  name: string | null;
  title?: string | null;
  type: string;
  status?: string | null;
  created_at: string;
  updated_at?: string | null;
  qr_value?: string | null;
  design?: Partial<QrDesignData> | null;
  content?: any;
};

type QRScanItem = {
  qr_code_id: string;
  scanned_at: string;
};

function getDisplayName(qr: QRCodeItem) {
  return qr.name || qr.title || "Sans titre";
}

function getStatus(qr: QRCodeItem) {
  return (qr.status || "active").toLowerCase();
}

function getPreviewValue(qr: QRCodeItem) {
  if (qr.qr_value) return qr.qr_value;
  if (qr.content?.url) return qr.content.url;
  if (qr.content?.text) return qr.content.text;
  return qr.id;
}

function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
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

function Badge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/20",
    paused: "bg-amber-500/20 text-amber-400 border-amber-500/20",
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
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-5">
      <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
        {icon}
        {label}
      </div>
      <div className="text-sm font-semibold text-white/90">{value}</div>
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
      logoUrl: "",
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
    <div className="flex items-center justify-center rounded-[2rem] border border-white/10 bg-white p-6 shadow-xl">
      <div ref={ref} className="flex min-h-[220px] min-w-[220px] items-center justify-center" />
    </div>
  );
}

function renderContentDetails(content: any) {
  if (!content || typeof content !== "object") {
    return <p className="text-sm text-white/45">Aucune donnée de contenu.</p>;
  }

  const entries = Object.entries(content).filter(
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

export default function QrDetailsView({ qrId }: Props) {
  const [loading, setLoading] = useState(true);
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
          return;
        }

        const { data: qrData, error: qrError } = await supabase
          .from("qr_codes")
          .select("*")
          .eq("id", qrId)
          .eq("user_id", user.id)
          .single();

        if (qrError) throw qrError;

        const { data: scansData, error: scansError } = await supabase
          .from("qr_scans")
          .select("qr_code_id, scanned_at")
          .eq("qr_code_id", qrId)
          .order("scanned_at", { ascending: false });

        if (scansError) throw scansError;

        setQr(qrData as QRCodeItem);
        setScans((scansData || []) as QRScanItem[]);
      } catch (err: any) {
        setError(err?.message || "Impossible de charger ce QR code.");
      } finally {
        setLoading(false);
      }
    };

    loadQrDetails();
  }, [qrId]);

  const stats = useMemo(() => {
    const totalScans = scans.length;
    const lastScan = scans[0]?.scanned_at || null;

    return {
      totalScans,
      lastScan,
    };
  }, [scans]);

  if (loading) {
    return <div className="p-8 text-white/60">Chargement des détails...</div>;
  }

  if (error || !qr) {
    return <div className="p-8 text-red-300">{error || "QR introuvable."}</div>;
  }

  const status = getStatus(qr);

  return (
    <div className="animate-in space-y-8 fade-in duration-700">
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
            <Badge status={status} />
          </div>

          <p className="text-sm text-white/45">
            Vue complète du QR code, de son contenu et de ses performances.
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
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <div className="space-y-6">
          <PreviewQR qr={qr} />

          <div className="grid grid-cols-1 gap-4">
            <InfoCard
              icon={<Eye className="h-4 w-4 text-cyan-400" />}
              label="Nombre total de scans"
              value={stats.totalScans}
            />
            <InfoCard
              icon={<Clock className="h-4 w-4 text-purple-400" />}
              label="Dernier scan"
              value={formatLastScan(stats.lastScan || undefined)}
            />
            <InfoCard
              icon={<Type className="h-4 w-4 text-emerald-400" />}
              label="Type"
              value={qr.type || "—"}
            />
            <InfoCard
              icon={<CheckCircle2 className="h-4 w-4 text-amber-400" />}
              label="Statut"
              value={status}
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoCard
              icon={<QrCode className="h-4 w-4 text-cyan-400" />}
              label="ID du QR code"
              value={<span className="break-all">{qr.id}</span>}
            />
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
              icon={<Palette className="h-4 w-4 text-amber-400" />}
              label="Valeur encodée"
              value={<span className="break-all">{getPreviewValue(qr)}</span>}
            />
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-lg font-black italic uppercase tracking-widest text-white">
              Contenu du QR code
            </h2>
            {renderContentDetails(qr.content)}
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-lg font-black italic uppercase tracking-widest text-white">
              Design appliqué
            </h2>

            {!qr.design || Object.keys(qr.design).length === 0 ? (
              <p className="text-sm text-white/45">Aucune donnée de design enregistrée.</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(qr.design).map(([key, value]) => (
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
            )}
          </div>

          <div className="rounded-[2rem] border border-white/5 bg-white/[0.03] p-6">
            <h2 className="mb-4 text-lg font-black italic uppercase tracking-widest text-white">
              Historique récent des scans
            </h2>

            {scans.length === 0 ? (
              <p className="text-sm text-white/45">Aucun scan pour le moment.</p>
            ) : (
              <div className="space-y-3">
                {scans.slice(0, 10).map((scan, index) => (
                  <div
                    key={`${scan.scanned_at}-${index}`}
                    className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] px-4 py-3"
                  >
                    <span className="text-sm text-white/85">Scan #{scans.length - index}</span>
                    <span className="text-xs font-semibold text-white/45">
                      {formatDate(scan.scanned_at)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
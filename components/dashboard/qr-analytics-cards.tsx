"use client";

import {
  Eye,
  Activity,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Sparkles,
} from "lucide-react";

type Insight = {
  title: string;
  description: string;
  tone: "positive" | "warning" | "neutral";
};

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

export function QrAnalyticsCards({
  totalScans,
  last24h,
  growth7d,
  last7,
  prev7,
  lastScanLabel,
  daysSinceLastScan,
  inactivityScore,
  insights,
}: {
  totalScans: number;
  last24h: number;
  growth7d: number;
  last7: number;
  prev7: number;
  lastScanLabel: string;
  daysSinceLastScan: number | null;
  inactivityScore: number;
  insights: Insight[];
}) {
  return (
    <>
      <div className="grid gap-4 xl:grid-cols-4">
        <InfoCard
          icon={<Eye className="h-4 w-4 text-cyan-400" />}
          label="Total scans"
          value={<span className="text-2xl">{totalScans}</span>}
          hint={`${last24h} sur les dernières 24h`}
        />

        <InfoCard
          icon={<Activity className="h-4 w-4 text-purple-400" />}
          label="Croissance 7 jours"
          value={
            <span
              className={`inline-flex items-center gap-2 text-2xl ${
                growth7d >= 0 ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {growth7d >= 0 ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {growth7d >= 0 ? "+" : ""}
              {growth7d}%
            </span>
          }
          hint={`${last7} scans vs ${prev7} la période précédente`}
        />

        <InfoCard
          icon={<Clock className="h-4 w-4 text-amber-400" />}
          label="Dernier scan"
          value={lastScanLabel}
          hint={
            daysSinceLastScan !== null
              ? `${daysSinceLastScan} jour(s) d’écart`
              : "Aucun scan enregistré"
          }
        />

        <InfoCard
          icon={<AlertTriangle className="h-4 w-4 text-rose-400" />}
          label="Score d’inactivité"
          value={<span className="text-2xl">{inactivityScore}/100</span>}
          hint={
            inactivityScore >= 70
              ? "Signal critique"
              : inactivityScore >= 40
              ? "À surveiller"
              : "Sain"
          }
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        {insights.length === 0 ? (
          <div className="xl:col-span-4 rounded-[2rem] border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-white/45">
            Aucun insight disponible pour le moment.
          </div>
        ) : (
          insights.map((insight, index) => {
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
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {insight.description}
                </p>
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
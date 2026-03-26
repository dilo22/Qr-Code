import {
  Activity,
  AlertTriangle,
  Clock,
  Eye,
  Globe,
  MapPin,
  Monitor,
  ScanLine,
  Smartphone,
  Sparkles,
  Tablet,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
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

import { InfoCard } from "@/features/dashboard/components/ui/InfoCard";
import { SectionCard } from "@/features/dashboard/components/ui/SectionCard";
import { EmptyChartState } from "@/features/dashboard/components/ui/EmptyChartState";
import type {
  DeviceType,
  QRScanItem,
} from "@/features/dashboard/types/qr-details.types";
import {
  formatDate,
  formatLastScan,
  getDeviceLabel,
  normalizeDevice,
} from "@/features/dashboard/lib/qr-details.helpers";

const PIE_COLORS = ["#22d3ee", "#a855f7", "#22c55e", "#f59e0b"];

type Analytics = ReturnType<
  typeof import("@/features/dashboard/lib/qr-details.analytics").buildQrAnalytics
>;

type Props = {
  analytics: Analytics;
  scans: QRScanItem[];
};

function DeviceIcon({ device }: { device: DeviceType }) {
  if (device === "mobile") return <Smartphone className="h-4 w-4" />;
  if (device === "tablet") return <Tablet className="h-4 w-4" />;
  if (device === "desktop") return <Monitor className="h-4 w-4" />;
  return <ScanLine className="h-4 w-4" />;
}

export function QrDetailsAnalytics({ analytics }: Props) {
  return (
    <>
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
                <p className="mt-2 text-sm leading-6 text-white/55">
                  {insight.description}
                </p>
              </div>
            );
          })
        )}
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

      <div className="grid gap-6 2xl:grid-cols-2">
        <SectionCard title="Devices" subtitle="Répartition des appareils détectés">
          {analytics.deviceBreakdown.length === 0 ? (
            <EmptyChartState text="Aucune donnée device disponible." />
          ) : (
            <div className="grid min-w-0 gap-6">
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
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number, _name: string, props: any) => [
                        `${value} scan${value > 1 ? "s" : ""}`,
                        getDeviceLabel(props.payload.name),
                      ]}
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
                    className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <span
                      className="h-2.5 w-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    />

                    <div className="flex min-w-0 items-center gap-2">
                      <span className="shrink-0 text-white/85">
                        <DeviceIcon device={item.name} />
                      </span>
                      <span className="truncate text-sm font-medium text-white/85">
                        {getDeviceLabel(item.name)}
                      </span>
                    </div>

                    <div className="shrink-0 text-right leading-tight">
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
                  className="flex items-center justify-between gap-4 rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-semibold text-white">
                      <Globe className="h-4 w-4 shrink-0 text-cyan-300" />
                      <span className="truncate">{item.country}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2 text-xs text-white/45">
                      <MapPin className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{item.city || "Ville inconnue"}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold text-white">
                    {item.count}
                  </div>
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

                  <div className="shrink-0 text-right">
                    <div className="text-xs uppercase tracking-[0.16em] text-white/35">
                      {getDeviceLabel(device)}
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
    </>
  );
}
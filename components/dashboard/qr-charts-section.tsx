"use client";

import {
  Smartphone,
  Monitor,
  Tablet,
  ScanLine,
  Globe,
  MapPin,
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
          {subtitle ? (
            <p className="mt-2 text-sm text-white/45">{subtitle}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-6 text-sm text-white/45">
      {text}
    </div>
  );
}

function DeviceIcon({ device }: { device: DeviceType }) {
  if (device === "mobile") return <Smartphone className="h-4 w-4" />;
  if (device === "tablet") return <Tablet className="h-4 w-4" />;
  if (device === "desktop") return <Monitor className="h-4 w-4" />;
  return <ScanLine className="h-4 w-4" />;
}

const PIE_COLORS = ["#22d3ee", "#a855f7", "#22c55e", "#f59e0b"];

export function QrChartsSection({
  totalScans,
  scansSeries,
  deviceBreakdown,
  geoBreakdown,
}: {
  totalScans: number;
  scansSeries: ScanSeriesPoint[];
  deviceBreakdown: DeviceBreakdownItem[];
  geoBreakdown: GeoBreakdownItem[];
}) {
  return (
    <>
      <SectionCard
        title="Évolution des scans"
        subtitle="Tendance quotidienne sur les 30 derniers jours"
      >
        {totalScans === 0 ? (
          <EmptyState text="Pas encore assez de données pour afficher la courbe." />
        ) : (
          <div className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={scansSeries}>
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
        <SectionCard
          title="Devices"
          subtitle="Répartition des appareils détectés"
        >
          {deviceBreakdown.length === 0 ? (
            <EmptyState text="Aucune donnée device disponible." />
          ) : (
            <div className="grid items-center gap-6 md:grid-cols-[220px_1fr]">
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={deviceBreakdown}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={58}
                      outerRadius={84}
                      paddingAngle={4}
                    >
                      {deviceBreakdown.map((_, index) => (
                        <Cell
                          key={index}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
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
                {deviceBreakdown.map((item, index) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{
                          backgroundColor: PIE_COLORS[index % PIE_COLORS.length],
                        }}
                      />
                      <div className="flex items-center gap-2 text-sm text-white/85">
                        <DeviceIcon device={item.name} />
                        <span className="capitalize">{item.name}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-white">
                        {item.value}
                      </div>
                      <div className="text-xs text-white/45">
                        {item.percentage}%
                      </div>
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
          {geoBreakdown.length === 0 ? (
            <EmptyState text="Aucune donnée géographique disponible." />
          ) : (
            <div className="space-y-3">
              {geoBreakdown.map((item, index) => (
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
                  <div className="text-sm font-semibold text-white">
                    {item.count}
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>
      </div>
    </>
  );
}
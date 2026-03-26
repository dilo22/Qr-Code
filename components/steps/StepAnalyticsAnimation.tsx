"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Eye,
  TrendingUp,
  Clock3,
  AlertTriangle,
  Smartphone,
} from "lucide-react";

export default function StepAnalyticsAnimation() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  const [highlightCard, setHighlightCard] = useState<
    "growth" | "devices" | "chart" | null
  >(null);
  const [scanCount, setScanCount] = useState(1);
  const [growth, setGrowth] = useState(100);
  const [lastScan, setLastScan] = useState("Il y a 4 h");
  const [deviceShare, setDeviceShare] = useState(100);
  const [chartPulse, setChartPulse] = useState(false);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  };

  const moveCursor = (x: number, y: number, scale = 1) => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    cursor.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  const clickCursor = (x: number, y: number) => {
    moveCursor(x, y, 0.88);
    schedule(() => moveCursor(x, y, 1), 120);
  };

  useEffect(() => {
    const runLoop = () => {
      clearAllTimeouts();

      setHighlightCard(null);
      setScanCount(1);
      setGrowth(100);
      setLastScan("Il y a 4 h");
      setDeviceShare(100);
      setChartPulse(false);
      moveCursor(560, 360, 1);

      schedule(() => moveCursor(205, 120), 500);
      schedule(() => clickCursor(205, 120), 900);
      schedule(() => setHighlightCard("growth"), 1080);
      schedule(() => setGrowth(128), 1240);

      schedule(() => moveCursor(520, 300), 2200);
      schedule(() => clickCursor(520, 300), 2550);
      schedule(() => {
        setHighlightCard("chart");
        setChartPulse(true);
      }, 2730);
      schedule(() => setChartPulse(false), 3600);

      schedule(() => moveCursor(250, 430), 4500);
      schedule(() => clickCursor(250, 430), 4850);
      schedule(() => {
        setHighlightCard("devices");
        setDeviceShare(82);
      }, 5030);

      schedule(() => moveCursor(98, 120), 6200);
      schedule(() => clickCursor(98, 120), 6550);
      schedule(() => {
        setHighlightCard(null);
        setScanCount(3);
        setLastScan("Il y a 12 min");
      }, 6730);

      schedule(runLoop, 8600);
    };

    runLoop();

    return () => clearAllTimeouts();
  }, []);

  const chartData = useMemo(() => [0, 0, 0, 1, 1, 2, 1, 3, 2, 4, 3], []);
  const pathD = chartData
    .map((value, index) => {
      const x = 16 + index * 24;
      const y = 132 - value * 18;
      return `${index === 0 ? "M" : "L"} ${x} ${y}`;
    })
    .join(" ");

  return (
    <div className="relative w-full max-w-[660px] overflow-hidden rounded-[22px] border border-white/10 bg-[#060810] p-3 shadow-[0_18px_60px_rgba(0,0,0,0.36)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.05),transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.05),transparent_24%)]" />

      <div className="relative">
        <div className="mb-3">
          <button className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-white/65">
            <ArrowLeft className="h-3.5 w-3.5" />
            Retour au dashboard
          </button>

          <div className="mb-1 flex items-center gap-2.5">
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Google
            </h2>
            <span className="rounded-full border border-emerald-400/15 bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-[0.18em] text-emerald-400">
              Active
            </span>
          </div>

          <p className="max-w-[340px] text-[12px] text-white/38">
            Vue rapide de l’activité récente et des performances.
          </p>
        </div>

        <div className="mb-3 grid grid-cols-4 gap-2">
          <MetricCard
            title="Total scans"
            value={String(scanCount)}
            sub="sur 24h"
            icon={<Eye className="h-3.5 w-3.5" />}
            accent="cyan"
            active={highlightCard === null}
          />
          <MetricCard
            title="Croissance"
            value={`+${growth}%`}
            sub="sur 7 jours"
            icon={<TrendingUp className="h-3.5 w-3.5" />}
            accent="emerald"
            active={highlightCard === "growth"}
          />
          <MetricCard
            title="Dernier scan"
            value={lastScan}
            sub="activité"
            icon={<Clock3 className="h-3.5 w-3.5" />}
            accent="yellow"
            active={false}
          />
          <MetricCard
            title="Inactivité"
            value="0/100"
            sub="RAS"
            icon={<AlertTriangle className="h-3.5 w-3.5" />}
            accent="rose"
            active={false}
          />
        </div>

        <div className="grid grid-cols-[170px_1fr] gap-2.5">
          <div
            className={`rounded-[18px] border bg-[linear-gradient(180deg,rgba(7,10,19,0.96),rgba(6,8,16,0.98))] p-3 transition-all duration-300 ${
              highlightCard === "devices"
                ? "border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                : "border-white/10"
            }`}
          >
            <div className="mb-1 text-base font-black uppercase tracking-tight text-white">
              Devices
            </div>
            <div className="mb-2 text-xs text-white/35">Répartition</div>

            <div className="flex items-center justify-center pt-2">
              <div className="relative h-24 w-24">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(rgb(34,211,238) 0 ${deviceShare}%, rgba(255,255,255,0.08) ${deviceShare}% 100%)`,
                  }}
                />
                <div className="absolute inset-[12px] rounded-full bg-[#060810]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <Smartphone className="mb-1 h-4 w-4 text-cyan-400" />
                  <div className="text-xl font-black text-white">{deviceShare}%</div>
                  <div className="text-[9px] uppercase tracking-[0.16em] text-white/35">
                    Mobile
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`rounded-[18px] border bg-[linear-gradient(180deg,rgba(7,10,19,0.96),rgba(6,8,16,0.98))] p-3 transition-all duration-300 ${
              highlightCard === "chart"
                ? "border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
                : "border-white/10"
            }`}
          >
            <h3 className="mb-1 text-lg font-black uppercase tracking-tight text-white">
              Évolution des scans
            </h3>
            <p className="mb-2 text-xs text-white/35">Tendance quotidienne</p>

            <svg viewBox="0 0 290 155" className="h-[145px] w-full">
              {[0, 1, 2, 3, 4].map((line) => (
                <line
                  key={line}
                  x1="16"
                  x2="274"
                  y1={132 - line * 24}
                  y2={132 - line * 24}
                  stroke="rgba(255,255,255,0.06)"
                  strokeWidth="1"
                />
              ))}

              <path
                d={pathD}
                fill="none"
                stroke="rgb(34,211,238)"
                strokeWidth="3"
                strokeLinecap="round"
                className={chartPulse ? "opacity-100" : "opacity-90"}
              />

              {chartData.map((value, index) => {
                const x = 16 + index * 24;
                const y = 132 - value * 18;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3.5"
                    fill="rgb(34,211,238)"
                  />
                );
              })}
            </svg>
          </div>
        </div>
      </div>

      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-50 h-5 w-5 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.45)] transition-transform duration-500 ease-in-out"
      />
    </div>
  );
}

function MetricCard({
  title,
  value,
  sub,
  icon,
  accent,
  active,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: "cyan" | "emerald" | "yellow" | "rose";
  active?: boolean;
}) {
  const accentClass =
    accent === "cyan"
      ? "text-cyan-400"
      : accent === "emerald"
      ? "text-emerald-400"
      : accent === "yellow"
      ? "text-yellow-400"
      : "text-rose-400";

  return (
    <div
      className={`rounded-[16px] border bg-[linear-gradient(180deg,rgba(8,12,22,0.9),rgba(6,8,16,0.95))] p-3 transition-all duration-300 ${
        active
          ? "border-cyan-400/20 shadow-[0_0_20px_rgba(34,211,238,0.08)]"
          : "border-white/10"
      }`}
    >
      <div
        className={`mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.16em] ${accentClass}`}
      >
        {icon}
        {title}
      </div>
      <div
        className={`mb-1 text-xl font-black ${
          accent === "emerald" ? "text-emerald-400" : "text-white"
        }`}
      >
        {value}
      </div>
      <div className="text-xs text-white/35">{sub}</div>
    </div>
  );
}
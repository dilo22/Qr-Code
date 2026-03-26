import type { QRScanItem, DeviceType } from "@/features/dashboard/types/qr-details.types";
import { normalizeDevice } from "@/features/dashboard/lib/qr-details.helpers";

type InsightTone = "positive" | "warning" | "neutral";

type Insight = {
  title: string;
  description: string;
  tone: InsightTone;
};

type ScanSeriesItem = {
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
  city: string;
  count: number;
};

type ScanHistoryItem = QRScanItem & {
  isUniqueVisitor: boolean | null;
  visitIndex: number | null;
};

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatDayLabel(date: Date) {
  return date.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export function buildQrAnalytics(scans: QRScanItem[]) {
  const now = new Date();
  const totalScans = scans.length;

  const last24h = scans.filter((scan) => {
    const diff = now.getTime() - new Date(scan.scanned_at).getTime();
    return diff <= 24 * 60 * 60 * 1000;
  }).length;

  const last7 = scans.filter((scan) => {
    const diff = now.getTime() - new Date(scan.scanned_at).getTime();
    return diff <= 7 * 24 * 60 * 60 * 1000;
  }).length;

  const prev7 = scans.filter((scan) => {
    const diff = now.getTime() - new Date(scan.scanned_at).getTime();
    return diff > 7 * 24 * 60 * 60 * 1000 && diff <= 14 * 24 * 60 * 60 * 1000;
  }).length;

  const growth7d =
    prev7 === 0 ? (last7 > 0 ? 100 : 0) : Math.round(((last7 - prev7) / prev7) * 100);

  const lastScan = scans.length > 0 ? scans[0].scanned_at : null;

  const daysSinceLastScan = lastScan
    ? Math.floor((now.getTime() - new Date(lastScan).getTime()) / (24 * 60 * 60 * 1000))
    : null;

  function toDayKey(dateLike: string | Date) {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

const scansByDay = new Map<string, number>();

for (const scan of scans) {
  const key = toDayKey(scan.scanned_at);
  if (!key) continue;
  scansByDay.set(key, (scansByDay.get(key) || 0) + 1);
}

const scansSeries: ScanSeriesItem[] = [];

for (let i = 29; i >= 0; i--) {
  const day = new Date();
  day.setHours(0, 0, 0, 0);
  day.setDate(day.getDate() - i);

  const key = toDayKey(day);
  const count = key ? scansByDay.get(key) || 0 : 0;

  scansSeries.push({
    label: formatDayLabel(day),
    scans: count,
  });
}

  const deviceMap = new Map<DeviceType, number>();
  for (const scan of scans) {
    const device = normalizeDevice(scan.device);
    deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
  }

  const deviceBreakdown: DeviceBreakdownItem[] = Array.from(deviceMap.entries())
    .map(([name, value]) => ({
      name,
      value,
      percentage: totalScans > 0 ? Math.round((value / totalScans) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value);

  const geoMap = new Map<string, GeoBreakdownItem>();
  for (const scan of scans) {
    const country = scan.country || "Pays inconnu";
    const city = scan.city || "Ville inconnue";
    const key = `${country}__${city}`;
    const existing = geoMap.get(key);

    if (existing) {
      existing.count += 1;
    } else {
      geoMap.set(key, { country, city, count: 1 });
    }
  }

  const geoBreakdown = Array.from(geoMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const scansAsc = [...scans].sort(
    (a, b) => new Date(a.scanned_at).getTime() - new Date(b.scanned_at).getTime()
  );

  const visitorSeenCount = new Map<string, number>();
  let uniqueScans = 0;
  let repeatScans = 0;

  const historyWithFlagsAsc: ScanHistoryItem[] = scansAsc.map((scan) => {
    const key = scan.visitor_key?.trim();

    if (!key) {
      return {
        ...scan,
        isUniqueVisitor: null,
        visitIndex: null,
      };
    }

    const seen = visitorSeenCount.get(key) || 0;
    const nextCount = seen + 1;
    visitorSeenCount.set(key, nextCount);

    if (nextCount === 1) uniqueScans += 1;
    else repeatScans += 1;

    return {
      ...scan,
      isUniqueVisitor: nextCount === 1,
      visitIndex: nextCount,
    };
  });

  const scansHistory = historyWithFlagsAsc.reverse();

  const insights: Insight[] = [];

  if (totalScans === 0) {
    insights.push({
      title: "Aucun scan pour le moment",
      description: "Le QR code est prêt, mais aucun scan n’a encore été enregistré.",
      tone: "warning",
    });
  } else {
    if (last24h > 0) {
      insights.push({
        title: "Activité récente détectée",
        description: `${last24h} scan${last24h > 1 ? "s" : ""} sur les dernières 24h.`,
        tone: "positive",
      });
    }

    if (growth7d > 0) {
      insights.push({
        title: "Croissance positive",
        description: `Les scans progressent de ${growth7d}% sur 7 jours.`,
        tone: "positive",
      });
    } else if (growth7d < 0) {
      insights.push({
        title: "Ralentissement récent",
        description: `Les scans reculent de ${Math.abs(growth7d)}% sur 7 jours.`,
        tone: "warning",
      });
    }

    if (daysSinceLastScan !== null && daysSinceLastScan >= 7) {
      insights.push({
        title: "QR moins actif récemment",
        description: `Aucun scan depuis ${daysSinceLastScan} jour(s).`,
        tone: "warning",
      });
    }
  }

  return {
    totalScans,
    uniqueScans,
    repeatScans,
    hasVisitorTracking: scans.some((scan) => Boolean(scan.visitor_key)),
    last24h,
    last7,
    prev7,
    growth7d,
    lastScan,
    daysSinceLastScan,
    scansSeries,
    deviceBreakdown,
    geoBreakdown,
    insights,
    scansHistory,
  };
}
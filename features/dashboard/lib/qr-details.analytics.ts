import type {
  DeviceBreakdownItem,
  DeviceType,
  GeoBreakdownItem,
  QRScanItem,
  ScanSeriesPoint,
} from "@/features/dashboard/types/qr-details.types";
import {
  formatCompactDate,
  getDaysSince,
  getDeviceLabel,
  getGrowth,
  normalizeDevice,
} from "./qr-details.helpers";

export function buildQrAnalytics(scans: QRScanItem[]) {
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

  const scansSeries: ScanSeriesPoint[] = Array.from(scansByDay.entries()).map(([date, value]) => ({
    date,
    label: formatCompactDate(date),
    scans: value,
  }));

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
        title: `${dominantDevice.percentage}% via ${getDeviceLabel(dominantDevice.name)}`,
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
        description: "Le QR reste actif très récemment, ce qui est un bon signal d’engagement.",
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
}
import type { DeviceType, QRCodeItem } from "@/features/dashboard/types/qr-details.types";
import { getAppUrl } from "@/features/dashboard/lib/app-url";

/**
 * Parse le contenu du QR (JSON ou objet)
 */
export function parseContent(content: unknown) {
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

/**
 * Nom affiché du QR
 */
export function getDisplayName(qr: QRCodeItem) {
  return qr.name || qr.title || "Sans titre";
}

/**
 * Statut normalisé
 */
export function getStatus(qr: QRCodeItem) {
  return (qr.status || "active").toLowerCase();
}

/**
 * Valeur encodée dans le QR
 */
export function getPreviewValue(qr: QRCodeItem) {
  // ✅ PRIORITÉ ABSOLUE : QR dynamique (tracking)
  if (qr.qr_mode === "dynamic") {
    return `${getAppUrl()}/s/${qr.id}`;
  }

  // ✅ valeur brute si définie
  if (qr.qr_value) return qr.qr_value;

  const parsedContent = parseContent(qr.content);

  // ✅ extraction intelligente du contenu
  if (parsedContent && typeof parsedContent === "object") {
    const contentObj = parsedContent as Record<string, unknown>;

    if (typeof contentObj.url === "string") return contentObj.url;
    if (typeof contentObj.text === "string") return contentObj.text;
    if (typeof contentObj.value === "string") return contentObj.value;
  }

  // fallback minimal
  return qr.id;
}

/**
 * Format date complet
 */
export function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * Format compact (graphes)
 */
export function formatCompactDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

/**
 * Format relatif (dernier scan)
 */
export function formatLastScan(date?: string | null) {
  if (!date) return "Jamais";

  const now = Date.now();
  const scan = new Date(date).getTime();

  if (Number.isNaN(scan)) return "—";

  const diffMin = Math.floor((now - scan) / 1000 / 60);

  if (diffMin < 1) return "À l’instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;

  const diffHours = Math.floor(diffMin / 60);
  if (diffHours < 24) return `Il y a ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `Il y a ${diffDays} j`;

  return formatDate(date);
}

/**
 * Nombre de jours depuis une date
 */
export function getDaysSince(date?: string | null) {
  if (!date) return null;

  const time = new Date(date).getTime();
  if (Number.isNaN(time)) return null;

  const diff = Date.now() - time;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

/**
 * Croissance %
 */
export function getGrowth(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;

  return Number((((current - previous) / previous) * 100).toFixed(1));
}

/**
 * Normalisation device
 */
export function normalizeDevice(device?: string | null): DeviceType {
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

/**
 * Label device
 */
export function getDeviceLabel(device: DeviceType) {
  const labels: Record<DeviceType, string> = {
    mobile: "Mobile",
    desktop: "Desktop",
    tablet: "Tablet",
    other: "Autre",
  };

  return labels[device];
}
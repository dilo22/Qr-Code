import type { DeviceType, QRCodeItem } from "./qr-details.types";

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

export function getDisplayName(qr: QRCodeItem) {
  return qr.name || qr.title || "Sans titre";
}

export function getStatus(qr: QRCodeItem) {
  return (qr.status || "active").toLowerCase();
}

export function getPreviewValue(qr: QRCodeItem) {
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

export function formatDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleString("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatCompactDate(date?: string | null) {
  if (!date) return "—";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

export function formatLastScan(date?: string | null) {
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

export function getDaysSince(date?: string | null) {
  if (!date) return null;
  const diff = Date.now() - new Date(date).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function getGrowth(current: number, previous: number) {
  if (previous === 0 && current === 0) return 0;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

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

export function getDeviceLabel(device: DeviceType) {
  const labels: Record<DeviceType, string> = {
    mobile: "Mobile",
    desktop: "Desktop",
    tablet: "Tablet",
    other: "Autre",
  };

  return labels[device];
}
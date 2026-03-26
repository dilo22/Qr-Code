import type { QRCodeItem } from "@/features/dashboard/types/dashboard.types";

export function getProjectDisplayName(project: QRCodeItem) {
  return project.name || project.title || "Sans titre";
}

export function getProjectStatus(project: QRCodeItem) {
  return (project.status || "active").toLowerCase();
}

export function getPreviewValue(project: QRCodeItem) {
  if (project.qr_value) return project.qr_value;
  if (project.content?.url) return project.content.url;
  if (project.content?.text) return project.content.text;
  return project.id;
}

export function formatLastScan(date?: string) {
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
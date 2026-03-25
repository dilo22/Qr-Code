export type QRCodeItem = {
  id: string;
  name: string | null;
  title?: string | null;
  type: string;
  status?: string | null;
  created_at: string | null;
  updated_at?: string | null;
  qr_value?: string | null;
  design?: Record<string, unknown> | null;
  content?: unknown;
  color?: string | null;
};

export type QRScanItem = {
  id?: string;
  qr_code_id: string;
  scanned_at: string | null;
  country?: string | null;
  city?: string | null;
  device?: string | null;
};

export type DeviceType = "mobile" | "desktop" | "tablet" | "other";

export type ScanSeriesPoint = {
  date: string;
  label: string;
  scans: number;
};

export type DeviceBreakdownItem = {
  name: DeviceType;
  value: number;
  percentage: number;
};

export type GeoBreakdownItem = {
  country: string;
  city: string | null;
  count: number;
};
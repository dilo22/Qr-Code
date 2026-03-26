export type DeviceType = "mobile" | "tablet" | "desktop" | "unknown";

export type QRScanItem = {
  id: string;
  qr_code_id: string;
  scanned_at: string;
  country: string | null;
  city: string | null;
  device: string | null;
  visitor_key?: string | null;
};

export type QRCodeItem = {
  id: string;
  user_id: string;
  name?: string | null;
  type?: string | null;
  qr_mode?: "dynamic" | "static" | null;
  status?: string | null;
  content?: unknown;
  design?: unknown;
  created_at: string;
  updated_at: string;
};

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
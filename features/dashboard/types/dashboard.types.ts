import type { QrDesignData } from "@/features/dashboard/create/create-qr-design";

export type QRCodeItem = {
  id: string;
  name: string | null;
  title?: string | null;
  type: string;
  status?: string | null;
  created_at: string;
  qr_value?: string | null;
  design?: Partial<QrDesignData> | null;
  content?: any;
};

export type QRScanItem = {
  qr_code_id: string;
  scanned_at: string;
};

export type SortOption = "recent" | "oldest" | "name" | "scans";

export type SelectOption = {
  label: string;
  value: string;
};
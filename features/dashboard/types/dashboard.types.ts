import type { QrDesignData } from "@/features/dashboard/create/create-qr-design";

export type QRContentValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: QRContentValue }
  | QRContentValue[];

export type QRCodeItem = {
  id: string;
  name: string | null;
  title?: string | null;
  type: string;
  status?: string | null;
  created_at: string;
  qr_value?: string | null;
  qr_mode?: "dynamic" | "static" | null;
  design?: Partial<QrDesignData> | null;
  content?: QRContentValue;
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

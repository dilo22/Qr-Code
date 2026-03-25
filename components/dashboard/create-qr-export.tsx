"use client";

import { useMemo, useState } from "react";
import { Download, Sparkles, ArrowLeft, LayoutDashboard } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import Link from "next/link"; // Ajout pour la navigation
import type { QrDesignData } from "./create-qr-design";
import { buildQrOptions, buildQrValue, QR_RENDER_SIZE } from "./qr-utils";

type Props = {
  type: string;
  qrData: Record<string, any>;
  qrDesign: Partial<QrDesignData>;
  onBack: () => void;
};

type DownloadFormat = "png" | "jpeg" | "webp" | "svg";

export default function CreateQrExport({
  type,
  qrData,
  qrDesign,
  onBack,
}: Props) {
  const [isDownloading, setIsDownloading] = useState<DownloadFormat | null>(null);

  const qrValue = useMemo(() => buildQrValue(type, qrData), [type, qrData]);

  const handleDownload = async (extension: DownloadFormat) => {
    setIsDownloading(extension);

    const exportInstance = new QRCodeStyling(
      buildQrOptions(qrValue, qrDesign, QR_RENDER_SIZE)
    );

    try {
      await exportInstance.download({
        name: `qr-pro-${type}`,
        extension,
      });
    } finally {
      setIsDownloading(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-xl py-10">
      <div className="space-y-8">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            <Sparkles size={12} />
            Design prêt pour l'export
          </div>

          <h2 className="text-3xl font-black italic tracking-tighter text-white">
            VÉRIFIER & TÉLÉCHARGER
          </h2>

          <p className="text-sm text-white/40">
            Le QR téléchargé reprend exactement la même donnée et le même rendu.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {(["png", "svg", "jpeg", "webp"] as DownloadFormat[]).map((fmt) => (
            <button
              key={fmt}
              onClick={() => handleDownload(fmt)}
              disabled={!!isDownloading}
              className="group flex flex-col items-center justify-center rounded-[32px] border border-white/5 bg-white/[0.03] p-8 transition-all duration-300 hover:bg-white hover:text-black disabled:opacity-50"
            >
              <Download className="mb-2 transition-transform group-hover:translate-y-1" />
              <span className="text-xs font-black uppercase">
                {isDownloading === fmt ? "Téléchargement..." : fmt}
              </span>
            </button>
          ))}
        </div>

        {/* --- NOUVEAU BOUTON DASHBOARD --- */}
        <Link 
          href="/dashboard"
          className="flex w-full items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-white/5 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-white/10 hover:border-white/20"
        >
          <LayoutDashboard size={18} />
          Retour au Dashboard
        </Link>

        <button
          onClick={onBack}
          className="w-full rounded-3xl py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 transition-all hover:text-white"
        >
          <ArrowLeft size={14} className="mr-2 inline" />
          Retour à l'édition
        </button>
      </div>
    </div>
  );
}
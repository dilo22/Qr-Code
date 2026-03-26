"use client";

import { useEffect, useRef, useState } from "react";
import { Download, FileImage, FileCode2 } from "lucide-react";
import QRCodeStyling from "qr-code-styling";
import { buildQrOptions } from "@/features/dashboard/lib/qr-utils";
import type { QrDesignData } from "@/features/dashboard/create/create-qr-design";
import type { QRCodeItem } from "@/features/dashboard/types/qr-details.types";
import { getPreviewValue } from "@/features/dashboard/lib/qr-details.helpers";

type Props = {
  qr: QRCodeItem;
};

export function PreviewQR({ qr }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<QRCodeStyling | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!ref.current) return;

    const value = getPreviewValue(qr);

    const design: Partial<QrDesignData> = {
      foreground: "#000000",
      background: "#ffffff",
      useGradient: false,
      gradientColor2: "#3b82f6",
      margin: 8,
      dotsStyle: "square",
      cornersStyle: "square",
      errorCorrectionLevel: "M",
      logoUrl: null,
      logoSize: 0.4,
      ...(qr.design || {}),
    };

    const options = buildQrOptions(value, design, 260);

    options.imageOptions = {
      ...options.imageOptions,
      margin: 2,
    };

    const qrCode = new QRCodeStyling(options);
    qrCodeRef.current = qrCode;

    ref.current.innerHTML = "";
    qrCode.append(ref.current);

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [qr]);

  const handleDownload = async (extension: "png" | "svg") => {
    if (!qrCodeRef.current) return;

    try {
      setIsDownloading(true);
      await qrCodeRef.current.download({
        extension,
        name: `qr-${qr.id}`,
      });
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="border-b border-white/8 px-5 py-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/35">
              Aperçu du QR code
            </p>
            <p className="mt-1 text-sm text-white/65">
              Téléchargement direct depuis la preview
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleDownload("png")}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-white/85 transition hover:bg-white hover:text-slate-900 disabled:opacity-60"
            >
              <FileImage className="h-4 w-4" />
              PNG
            </button>

            <button
              type="button"
              onClick={() => handleDownload("svg")}
              disabled={isDownloading}
              className="inline-flex items-center gap-2 rounded-2xl border border-cyan-500/20 bg-cyan-500/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-cyan-300 transition hover:bg-cyan-400 hover:text-slate-950 disabled:opacity-60"
            >
              <FileCode2 className="h-4 w-4" />
              SVG
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-8">
        <div
          ref={ref}
          className="flex min-h-[260px] min-w-[260px] max-w-full items-center justify-center"
        />
      </div>

      <div className="border-t border-white/8 px-5 py-4">
        <div className="inline-flex items-center gap-2 text-xs text-white/50">
          <Download className="h-4 w-4" />
          Export propre pour web, print et partage
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useRef } from "react";
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

    const options = buildQrOptions(value, design, 220);

    options.imageOptions = {
      ...options.imageOptions,
      margin: 2,
    };

    const qrCode = new QRCodeStyling(options);

    ref.current.innerHTML = "";
    qrCode.append(ref.current);

    return () => {
      if (ref.current) ref.current.innerHTML = "";
    };
  }, [qr]);

  return (
    <div className="flex items-center justify-center rounded-[2rem] border border-white/10 bg-white p-6 shadow-2xl">
      <div
        ref={ref}
        className="flex min-h-[220px] min-w-[220px] max-w-full items-center justify-center"
      />
    </div>
  );
}
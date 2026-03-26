"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import { buildQrOptions } from "@/features/dashboard/lib/qr-utils";
import type { QrDesignData } from "@/features/dashboard/create/create-qr-design";
import type { QRCodeItem } from "@/features/dashboard/types/dashboard.types";
import { getPreviewValue } from "@/features/dashboard/lib/dashboard.utils";

type Props = {
  project: QRCodeItem;
};

export default function MiniQR({ project }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const value = getPreviewValue(project);

    const design: Partial<QrDesignData> = {
      foreground: "#000000",
      background: "#ffffff",
      useGradient: false,
      gradientColor2: "#3b82f6",
      margin: 8,
      dotsStyle: "square",
      cornersStyle: "square",
      errorCorrectionLevel: "M",
      logoUrl: "",
      logoSize: 0.4,
      ...(project.design || {}),
    };

    const options = buildQrOptions(value, design, 96);
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
  }, [project]);

  return (
    <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-white shadow-lg">
      <div ref={ref} className="flex h-full w-full items-center justify-center" />
    </div>
  );
}
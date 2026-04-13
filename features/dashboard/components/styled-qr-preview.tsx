"use client";

import { useDeferredValue, useEffect, useMemo, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import type { QrDesignData } from "@/features/dashboard/create/create-qr-design";
import {
  buildQrOptions,
  getEffectiveBackgroundColor,
  QR_RENDER_SIZE,
} from "@/features/dashboard/lib/qr-utils";

type StyledQrPreviewProps = {
  data: string;
  design: QrDesignData;
};

export default function StyledQrPreview({
  data,
  design,
}: StyledQrPreviewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);

  const deferredData = useDeferredValue(data);
  const deferredDesign = useDeferredValue(design);

  const qrOptions = useMemo(() => {
    return buildQrOptions(deferredData, deferredDesign, QR_RENDER_SIZE);
  }, [deferredData, deferredDesign]);

  const previewBackground = useMemo(
    () => getEffectiveBackgroundColor(deferredDesign),
    [deferredDesign]
  );

  useEffect(() => {
    if (!containerRef.current) return;

    if (!qrInstanceRef.current) {
      qrInstanceRef.current = new QRCodeStyling(qrOptions);
      containerRef.current.innerHTML = "";
      qrInstanceRef.current.append(containerRef.current);
    } else {
      qrInstanceRef.current.update(qrOptions);
    }

    const applyFullSize = () => {
      if (!containerRef.current) return;

      const svg = containerRef.current.querySelector("svg");
      if (svg) {
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.style.width = "100%";
        svg.style.height = "100%";
        svg.style.display = "block";
      }

      const canvas = containerRef.current.querySelector("canvas");
      if (canvas) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
      }
    };

    applyFullSize();
    const frame = requestAnimationFrame(applyFullSize);
    return () => cancelAnimationFrame(frame);
  }, [qrOptions]);

  useEffect(() => {
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      qrInstanceRef.current = null;
    };
  }, []);

  return (
    <div
      className="relative mx-auto h-[300px] w-[300px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#f8fafc",
          backgroundImage:
            "linear-gradient(45deg, rgba(15,23,42,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(15,23,42,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(15,23,42,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(15,23,42,0.08) 75%)",
          backgroundSize: "24px 24px",
          backgroundPosition: "0 0, 0 12px, 12px -12px, -12px 0",
        }}
      />
      <div
        className="absolute inset-0"
        style={{ backgroundColor: previewBackground === "transparent" ? "transparent" : previewBackground }}
      />
      <div
        ref={containerRef}
        className="absolute inset-0"
        aria-label="Aperçu du QR code"
      />
    </div>
  );
}

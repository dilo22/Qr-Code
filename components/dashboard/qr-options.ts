import type { QrDesignData } from "./create-qr-design";

export const QR_RENDER_SIZE = 1024;

export function getSafeMargin(design: Partial<QrDesignData>) {
  const raw = Number.isFinite(design.margin) ? Number(design.margin) : 60;
  return Math.max(40, Math.min(raw, 80));
}

export function buildQrOptions(
  data: string,
  design: Partial<QrDesignData>,
  size: number = QR_RENDER_SIZE
) {
  const hasLogo = Boolean(design.logoUrl);
  const hasGradient = Boolean(design.useGradient);
  const safeMargin = getSafeMargin(design);

  return {
    width: size,
    height: size,
    type: "svg" as const,
    data: data?.trim() || " ",
    image: hasLogo ? design.logoUrl : undefined,
    margin: safeMargin,

    qrOptions: {
      typeNumber: 0,
      errorCorrectionLevel: hasLogo ? "H" : (design.errorCorrectionLevel || "M"),
    },

    backgroundOptions: {
      color: design.background || "#ffffff",
    },

    dotsOptions: {
      type: (design.dotsStyle as any) || "square",
      color: hasGradient ? undefined : design.foreground || "#000000",
      gradient: hasGradient
        ? {
            type: "linear" as const,
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color: design.foreground || "#000000" },
              { offset: 1, color: design.gradientColor2 || "#3b82f6" },
            ],
          }
        : undefined,
      roundSize: false,
    },

    cornersSquareOptions: {
      type: (design.cornersStyle as any) || "square",
      color: design.foreground || "#000000",
    },

    cornersDotOptions: {
      type: (design.cornersStyle as any) || "square",
      color: design.foreground || "#000000",
    },

    imageOptions: {
      hideBackgroundDots: true,
      imageSize: hasLogo
        ? Math.min(Math.max(design.logoSize || 0.4, 0.1), 0.45)
        : 0,
      margin: hasLogo ? 4 : 0,
      crossOrigin: "anonymous" as const,
      saveAsBlob: true,
    },
  };
}
import type { QrDesignData } from "@/features/dashboard/create/create-qr-design";

export const QR_RENDER_SIZE = 1024;

/**
 * Nettoie une chaîne simple.
 */
function clean(value: any) {
  return String(value || "").trim();
}

/**
 * Nettoie une URL.
 */
function cleanUrl(url: string) {
  return clean(url);
}

/**
 * Échappe les caractères spéciaux pour vCard.
 */
function escapeVCard(value: string) {
  return clean(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/**
 * Construit la chaîne brute du QR Code selon le type.
 */
export function buildQrValue(type: string, qrData: Record<string, any>) {
  if (!qrData) return "";

  switch (type) {
    case "url":
    case "instagram":
    case "facebook":
    case "tiktok":
    case "linkedin":
    case "twitter":
    case "youtube":
    case "app":
    case "review":
    case "menu":
      return cleanUrl(qrData.url);

    case "pdf":
case "image":
case "audio":
case "video":
  return cleanUrl(
    qrData.url ||
    qrData.fileUrl ||
    qrData.publicUrl ||
    qrData.hostedUrl
  );

    case "vcard":
      return clean(
        qrData.displayName ||
          qrData.name ||
          [qrData.firstName, qrData.lastName].filter(Boolean).join(" ") ||
          qrData.headline ||
          "Carte profil"
      );

    case "wifi":
      return `WIFI:T:${qrData.encryption || "WPA"};S:${clean(qrData.ssid)};P:${clean(
        qrData.password
      )};H:${qrData.hidden ? "true" : "false"};;`;

    case "text":
      return clean(qrData.text);

    case "email":
      return `mailto:${clean(qrData.email)}?subject=${encodeURIComponent(
        clean(qrData.subject)
      )}&body=${encodeURIComponent(clean(qrData.body))}`;

    case "phone":
      return `tel:${clean(qrData.phone)}`;

    case "sms":
      return `sms:${clean(qrData.phone)}${
        qrData.message ? `?body=${encodeURIComponent(clean(qrData.message))}` : ""
      }`;

    case "contact": {
      const firstName = clean(qrData.firstName);
      const lastName = clean(qrData.lastName);
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      const company = clean(qrData.company);
      const jobTitle = clean(qrData.jobTitle);
      const phone = clean(qrData.phone);
      const email = clean(qrData.email);
      const address = clean(qrData.address);
      const website = clean(qrData.website);

      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${escapeVCard(lastName)};${escapeVCard(firstName)};;;`,
        `FN:${escapeVCard(fullName)}`,
        company ? `ORG:${escapeVCard(company)}` : "",
        jobTitle ? `TITLE:${escapeVCard(jobTitle)}` : "",
        phone ? `TEL:${escapeVCard(phone)}` : "",
        email ? `EMAIL:${escapeVCard(email)}` : "",
        address ? `ADR:;;${escapeVCard(address)};;;;` : "",
        website ? `URL:${escapeVCard(website)}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }

    case "location": {
      const latitude = clean(qrData.latitude);
      const longitude = clean(qrData.longitude);
      const address = clean(qrData.address);

      if (latitude && longitude) {
        return `geo:${latitude},${longitude}`;
      }

      return address;
    }

    case "event": {
      const title = clean(qrData.title);
      const location = clean(qrData.location);
      const startDate = clean(qrData.startDate).replace(/-/g, "");
      const startTime = clean(qrData.startTime).replace(/:/g, "");

      return [
        "BEGIN:VEVENT",
        title ? `SUMMARY:${title}` : "",
        startDate && startTime ? `DTSTART:${startDate}T${startTime}00` : "",
        location ? `LOCATION:${location}` : "",
        "END:VEVENT",
      ]
        .filter(Boolean)
        .join("\n");
    }

    case "payment": {
      const payee = clean(qrData.payee);
      const amount = clean(qrData.amount);
      const currency = clean(qrData.currency || "EUR");

      return [
        "PAYMENT",
        payee ? `NAME:${payee}` : "",
        amount ? `AMOUNT:${amount}` : "",
        currency ? `CURRENCY:${currency}` : "",
      ]
        .filter(Boolean)
        .join("\n");
    }

    default:
      return typeof qrData === "string" ? qrData : JSON.stringify(qrData);
  }
}

/**
 * Calcule une marge de sécurité.
 */
export function getSafeMargin(
  design: Partial<QrDesignData>,
  size: number = QR_RENDER_SIZE
) {
  const raw = Number.isFinite(design.margin) ? Number(design.margin) : 20;
  const clamped = Math.max(4, Math.min(raw, 100));

  if (size <= 120) {
    return Math.min(clamped, 8);
  }

  if (size <= 200) {
    return Math.min(clamped, 12);
  }

  return clamped;
}

/**
 * Génère la config complète pour qr-code-styling.
 */
export function buildQrOptions(
  data: string,
  design: Partial<QrDesignData>,
  size: number = QR_RENDER_SIZE
) {
  const image = design.logoUrl || undefined;
  const hasLogo = Boolean(image);
  const hasGradient = Boolean(design.useGradient);
  const safeMargin = getSafeMargin(design, size);

  const foregroundColor = design.foreground || "#000000";
  const eyeOuterColor =
    design.useCustomEyeColors && design.eyeOuterColor
      ? design.eyeOuterColor
      : foregroundColor;
  const eyeInnerColor =
    design.useCustomEyeColors && design.eyeInnerColor
      ? design.eyeInnerColor
      : foregroundColor;

  return {
    width: size,
    height: size,
    type: "svg" as const,
    data: data || " ",
    image,
    margin: safeMargin,

    qrOptions: {
      typeNumber: 0 as any,
      mode: "Byte" as const,
      errorCorrectionLevel: hasLogo ? "H" : design.errorCorrectionLevel || "M",
    },

    backgroundOptions: {
      color: design.background || "#ffffff",
    },

    dotsOptions: {
      type: (design.dotsStyle as any) || "square",
      color: hasGradient ? undefined : foregroundColor,
      gradient: hasGradient
        ? {
            type: "linear" as const,
            rotation: Math.PI / 4,
            colorStops: [
              { offset: 0, color: foregroundColor },
              { offset: 1, color: design.gradientColor2 || "#3b82f6" },
            ],
          }
        : undefined,
    },

    cornersSquareOptions: {
      type: (design.cornersStyle as any) || "square",
      color: eyeOuterColor,
    },

    cornersDotOptions: {
      type: (design.cornersStyle as any) || "square",
      color: eyeInnerColor,
    },

    imageOptions: {
      hideBackgroundDots: true,
      imageSize: hasLogo
        ? Math.min(Math.max(design.logoSize || 0.4, 0.1), 0.45)
        : 0,
      margin: hasLogo ? (size <= 120 ? 3 : 10) : 0,
      crossOrigin: "anonymous" as const,
      saveAsBlob: true,
    },
  };
}
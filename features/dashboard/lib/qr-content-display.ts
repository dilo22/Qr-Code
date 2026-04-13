type DisplayField = {
  label: string;
  value: string;
};

type QrDisplaySummary = {
  headline: string | null;
  description: string | null;
  fields: DisplayField[];
};

function parseContent(content: unknown): Record<string, unknown> | null {
  if (!content) return null;
  if (typeof content === "object" && !Array.isArray(content)) {
    return content as Record<string, unknown>;
  }

  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed as Record<string, unknown>;
      }
    } catch {
      return null;
    }
  }

  return null;
}

function toText(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text || null;
}

function normalizeUrl(url: string | null) {
  if (!url) return null;
  return url.replace(/^https?:\/\//i, "");
}

function createField(label: string, value: unknown): DisplayField | null {
  const text = toText(value);
  return text ? { label, value: text } : null;
}

function getMenuSummary(content: Record<string, unknown>): QrDisplaySummary {
  const menuData =
    content.menuData && typeof content.menuData === "object"
      ? (content.menuData as Record<string, unknown>)
      : content;
  const restaurant =
    menuData.restaurant && typeof menuData.restaurant === "object"
      ? (menuData.restaurant as Record<string, unknown>)
      : null;
  const sections = Array.isArray(menuData.sections) ? menuData.sections : [];
  const sectionNames = sections
    .map((section) =>
      section && typeof section === "object" ? toText((section as Record<string, unknown>).title) : null
    )
    .filter(Boolean) as string[];
  const dishesCount = sections.reduce((total, section) => {
    if (!section || typeof section !== "object") return total;
    const items = (section as Record<string, unknown>).items;
    return total + (Array.isArray(items) ? items.length : 0);
  }, 0);

  return {
    headline: toText(restaurant?.name) || "Menu digital",
    description: toText(restaurant?.bio) || null,
    fields: [
      createField("Téléphone", restaurant?.phone),
      createField("Site web", normalizeUrl(toText(restaurant?.website))),
      createField("Adresse", restaurant?.address),
      createField("Sections", sections.length > 0 ? String(sections.length) : null),
      createField("Plats", dishesCount > 0 ? String(dishesCount) : null),
      createField(
        "Noms des sections",
        sectionNames.length > 0 ? sectionNames.slice(0, 5).join(", ") : null
      ),
    ].filter(Boolean) as DisplayField[],
  };
}

function getCardSummary(content: Record<string, unknown>): QrDisplaySummary {
  const displayName =
    toText(content.displayName) ||
    toText(content.name) ||
    [toText(content.firstName), toText(content.lastName)].filter(Boolean).join(" ") ||
    "Carte profil";

  return {
    headline: displayName,
    description: toText(content.bio) || null,
    fields: [
      createField("Entreprise", content.company),
      createField("Poste", content.jobTitle || content.headline),
      createField("Téléphone", content.phone),
      createField("Email", content.email),
      createField("Site web", normalizeUrl(toText(content.website))),
      createField("Adresse", content.address),
    ].filter(Boolean) as DisplayField[],
  };
}

function getUrlSummary(content: Record<string, unknown>, qrValue?: string | null): QrDisplaySummary {
  const url =
    toText(content.url) ||
    toText(content.fileUrl) ||
    toText(content.publicUrl) ||
    toText(content.hostedUrl) ||
    toText(qrValue);

  return {
    headline: url ? normalizeUrl(url) : "Lien",
    description: null,
    fields: [createField("URL", url)].filter(Boolean) as DisplayField[],
  };
}

function getEmailSummary(content: Record<string, unknown>): QrDisplaySummary {
  return {
    headline: toText(content.email) || "Email",
    description: toText(content.body) || null,
    fields: [
      createField("Email", content.email),
      createField("Sujet", content.subject),
    ].filter(Boolean) as DisplayField[],
  };
}

function getPhoneSummary(content: Record<string, unknown>): QrDisplaySummary {
  return {
    headline: toText(content.phone) || "Téléphone",
    description: null,
    fields: [createField("Numéro", content.phone)].filter(Boolean) as DisplayField[],
  };
}

function getSmsSummary(content: Record<string, unknown>): QrDisplaySummary {
  const message = toText(content.message) || toText(content.body);

  return {
    headline: toText(content.phone) || "SMS",
    description: message || null,
    fields: [
      createField("Numéro", content.phone),
      createField("Message", message),
    ].filter(Boolean) as DisplayField[],
  };
}

function getLocationSummary(content: Record<string, unknown>): QrDisplaySummary {
  const latitude = toText(content.latitude);
  const longitude = toText(content.longitude);
  const coordinates = latitude && longitude ? `${latitude}, ${longitude}` : null;

  return {
    headline: toText(content.address) || coordinates || "Localisation",
    description: null,
    fields: [
      createField("Adresse", content.address),
      createField("Coordonnées", coordinates),
    ].filter(Boolean) as DisplayField[],
  };
}

function getFileSummary(content: Record<string, unknown>, type?: string | null): QrDisplaySummary {
  const fileName =
    toText(content.fileName) ||
    toText(content.name) ||
    toText(content.title) ||
    "Fichier";

  return {
    headline: fileName,
    description: null,
    fields: [
      createField("Type", type),
      createField("Format", content.mimeType),
      createField("Source", normalizeUrl(toText(content.publicUrl) || toText(content.hostedUrl))),
    ].filter(Boolean) as DisplayField[],
  };
}

function getFallbackSummary(
  content: Record<string, unknown> | null,
  type?: string | null,
  qrValue?: string | null
): QrDisplaySummary {
  if (!content) {
    return {
      headline: qrValue ? normalizeUrl(qrValue) : type || "QR code",
      description: null,
      fields: qrValue ? [{ label: "Valeur", value: qrValue }] : [],
    };
  }

  const fields = Object.entries(content)
    .map(([key, value]) => createField(key, Array.isArray(value) ? `${value.length} élément(s)` : value))
    .filter(Boolean) as DisplayField[];

  return {
    headline: type || "QR code",
    description: null,
    fields: fields.slice(0, 6),
  };
}

export function getQrDisplaySummary(
  type: string | null | undefined,
  content: unknown,
  qrValue?: string | null
): QrDisplaySummary {
  const normalizedType = (type || "").toLowerCase();
  const parsedContent = parseContent(content);

  switch (normalizedType) {
    case "menu":
      return parsedContent ? getMenuSummary(parsedContent) : getFallbackSummary(parsedContent, type, qrValue);
    case "vcard":
    case "card":
    case "contact":
      return parsedContent ? getCardSummary(parsedContent) : getFallbackSummary(parsedContent, type, qrValue);
    case "url":
    case "instagram":
    case "facebook":
    case "tiktok":
    case "linkedin":
    case "twitter":
    case "youtube":
    case "app":
    case "review":
      return getUrlSummary(parsedContent || {}, qrValue);
    case "email":
      return parsedContent ? getEmailSummary(parsedContent) : getFallbackSummary(parsedContent, type, qrValue);
    case "phone":
      return parsedContent ? getPhoneSummary(parsedContent) : getFallbackSummary(parsedContent, type, qrValue);
    case "sms":
      return parsedContent ? getSmsSummary(parsedContent) : getFallbackSummary(parsedContent, type, qrValue);
    case "location":
      return parsedContent ? getLocationSummary(parsedContent) : getFallbackSummary(parsedContent, type, qrValue);
    case "file":
    case "pdf":
    case "image":
    case "audio":
    case "video":
      return parsedContent ? getFileSummary(parsedContent, type) : getFallbackSummary(parsedContent, type, qrValue);
    default:
      return getFallbackSummary(parsedContent, type, qrValue);
  }
}

export function getQrDisplayPrimaryValue(
  type: string | null | undefined,
  content: unknown,
  qrValue?: string | null
) {
  const summary = getQrDisplaySummary(type, content, qrValue);
  return summary.headline || summary.fields[0]?.value || "Informations non renseignées";
}

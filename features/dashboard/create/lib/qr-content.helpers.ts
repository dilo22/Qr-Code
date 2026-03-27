import type { MenuData, MenuItem, MenuSection } from "../types/qr-content.types";

export function formatFileSize(size?: number) {
  if (!size || Number.isNaN(size)) return "";
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} Go`;
}

export function createMenuItem(order = 0): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    price: "",
    imagePath: "",
    imageFileName: "",
    imageMimeType: "",
    imageSize: undefined,
    order,
  };
}

export function createMenuSection(order = 0): MenuSection {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    order,
    items: [],
  };
}

export function createEmptyMenuData(): MenuData {
  return {
    restaurant: {
      name: "",
      bio: "",
      phone: "",
      website: "",
      address: "",
      coverImagePath: "",
      coverImageFileName: "",
      coverImageMimeType: "",
      coverImageSize: undefined,
    },
    featuredItems: [],
    sections: [],
  };
}

export function normalizeInitialForm(initialData: Record<string, any>) {
  const normalized = {
    links: [],
    ...initialData,
  };

  if (normalized.menuData) return normalized;

  return {
    ...normalized,
    menuData: createEmptyMenuData(),
  };
}
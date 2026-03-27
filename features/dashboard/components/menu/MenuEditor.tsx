import { Building2, FileText, Globe, Hash, Image as ImageIcon, Phone, Plus, Star, Trash2, UtensilsCrossed, MapPinned } from "lucide-react";
import { useMemo } from "react";
import Field from "../Field";
import MenuItemCard from "./MenuItemCard";
import { createEmptyMenuData, createMenuItem, createMenuSection, formatFileSize } from "@/features/dashboard/create/lib/qr-content.helpers";
import { inputClass, textareaClass } from "@/features/dashboard/create/lib/qr-content.styles";
import { uploadQrFile } from "@/features/dashboard/create/lib/qr-content.upload";
import type { MenuData, MenuRestaurant, MenuSection } from "@/features/dashboard/create/types/qr-content.types";

type Props = {
  value: MenuData;
  onChange: (next: MenuData) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  uploadError: string | null;
  setUploadError: (value: string | null) => void;
};

export default function MenuEditor({
  value,
  onChange,
  isUploading,
  setIsUploading,
  uploadError,
  setUploadError,
}: Props) {
  const menuData = useMemo(() => value || createEmptyMenuData(), [value]);

  const updateRestaurantField = (field: keyof MenuRestaurant, newValue: any) => {
    onChange({
      ...menuData,
      restaurant: {
        ...menuData.restaurant,
        [field]: newValue,
      },
    });
  };

  const uploadRestaurantCover = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadQrFile(file, "menu");
      onChange({
        ...menuData,
        restaurant: {
          ...menuData.restaurant,
          coverImagePath: uploaded.storagePath,
          coverImageFileName: uploaded.fileName,
          coverImageMimeType: uploaded.mimeType,
          coverImageSize: uploaded.size,
        },
      });
    } catch (error: any) {
      console.error("UPLOAD MENU COVER ERROR:", error);
      setUploadError(error?.message || "Erreur lors de l’upload de l’image du restaurant.");
    } finally {
      setIsUploading(false);
    }
  };

  const addFeaturedItem = () => {
    onChange({
      ...menuData,
      featuredItems: [...menuData.featuredItems, createMenuItem(menuData.featuredItems.length)],
    });
  };

  const updateFeaturedItem = (itemId: string, patch: any) => {
    onChange({
      ...menuData,
      featuredItems: menuData.featuredItems.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item
      ),
    });
  };

  const removeFeaturedItem = (itemId: string) => {
    onChange({
      ...menuData,
      featuredItems: menuData.featuredItems.filter((item) => item.id !== itemId),
    });
  };

  const addSection = () => {
    onChange({
      ...menuData,
      sections: [...menuData.sections, createMenuSection(menuData.sections.length)],
    });
  };

  const updateSection = (sectionId: string, patch: Partial<MenuSection>) => {
    onChange({
      ...menuData,
      sections: menuData.sections.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section
      ),
    });
  };

  const removeSection = (sectionId: string) => {
    onChange({
      ...menuData,
      sections: menuData.sections.filter((section) => section.id !== sectionId),
    });
  };

  const addItemToSection = (sectionId: string) => {
    onChange({
      ...menuData,
      sections: menuData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: [...section.items, createMenuItem(section.items.length)],
            }
          : section
      ),
    });
  };

  const updateSectionItem = (sectionId: string, itemId: string, patch: any) => {
    onChange({
      ...menuData,
      sections: menuData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
            }
          : section
      ),
    });
  };

  const removeSectionItem = (sectionId: string, itemId: string) => {
    onChange({
      ...menuData,
      sections: menuData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section
      ),
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-cyan-400" />
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white/70">Restaurant</h3>
        </div>

        <div className="space-y-5">
          <Field label="Photo principale / couverture" icon={<ImageIcon size={14} />}>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await uploadRestaurantCover(file);
              }}
              className={inputClass}
            />
          </Field>

          {isUploading && (
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
              Upload de l’image en cours...
            </div>
          )}

          {uploadError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {uploadError}
            </div>
          )}

          {menuData.restaurant.coverImageFileName && (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
              <div className="font-medium text-white/90">{menuData.restaurant.coverImageFileName}</div>
              <div className="mt-1 text-xs text-white/45">
                {menuData.restaurant.coverImageMimeType || "Type inconnu"}
                {menuData.restaurant.coverImageSize ? ` • ${formatFileSize(menuData.restaurant.coverImageSize)}` : ""}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Nom du restaurant" icon={<UtensilsCrossed size={14} />}>
              <input type="text" placeholder="Ex: Le Palmier" value={menuData.restaurant.name} onChange={(e) => updateRestaurantField("name", e.target.value)} className={inputClass} />
            </Field>

            <Field label="Téléphone" icon={<Phone size={14} />}>
              <input type="text" placeholder="+33 6 12 34 56 78" value={menuData.restaurant.phone} onChange={(e) => updateRestaurantField("phone", e.target.value)} className={inputClass} />
            </Field>
          </div>

          <Field label="Bio / description" icon={<FileText size={14} />}>
            <textarea rows={4} placeholder="Cuisine maison, brunch, spécialités..." value={menuData.restaurant.bio} onChange={(e) => updateRestaurantField("bio", e.target.value)} className={textareaClass} />
          </Field>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Site web" icon={<Globe size={14} />}>
              <input type="text" placeholder="https://monresto.com" value={menuData.restaurant.website} onChange={(e) => updateRestaurantField("website", e.target.value)} className={inputClass} />
            </Field>

            <Field label="Adresse" icon={<MapPinned size={14} />}>
              <input type="text" placeholder="10 rue de Paris, Lyon" value={menuData.restaurant.address} onChange={(e) => updateRestaurantField("address", e.target.value)} className={inputClass} />
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white/70">Plats mis en avant</h3>
          </div>

          <button
            type="button"
            onClick={addFeaturedItem}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
          >
            <Plus size={14} />
            Ajouter un plat
          </button>
        </div>

        {menuData.featuredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
            Aucun plat mis en avant pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {menuData.featuredItems.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                index={index}
                titlePrefix="Plat"
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                setUploadError={setUploadError}
                onChange={(patch) => updateFeaturedItem(item.id, patch)}
                onDelete={() => removeFeaturedItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={16} className="text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white/70">Sections / blocs</h3>
          </div>

          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
          >
            <Plus size={14} />
            Ajouter une section
          </button>
        </div>

        {menuData.sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
            Aucune section ajoutée pour le moment.
          </div>
        ) : (
          <div className="space-y-5">
            {menuData.sections.map((section, sectionIndex) => (
              <div key={section.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="w-full">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field label={`Titre du bloc ${sectionIndex + 1}`} icon={<Hash size={14} />}>
                        <input type="text" placeholder="Ex: Petit déjeuner" value={section.title} onChange={(e) => updateSection(section.id, { title: e.target.value })} className={inputClass} />
                      </Field>

                      <Field label="Ordre" icon={<Hash size={14} />}>
                        <input type="number" placeholder="0" value={section.order} onChange={(e) => updateSection(section.id, { order: Number(e.target.value || 0) })} className={inputClass} />
                      </Field>
                    </div>

                    <div className="mt-4">
                      <Field label="Description du bloc" icon={<FileText size={14} />}>
                        <textarea rows={3} placeholder="Ex: Disponible jusqu’à 11h30" value={section.description} onChange={(e) => updateSection(section.id, { description: e.target.value })} className={textareaClass} />
                      </Field>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSection(section.id)}
                    className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-red-300 transition hover:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-[0.1em] text-white/45">
                    Plats du bloc
                  </div>

                  <button
                    type="button"
                    onClick={() => addItemToSection(section.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
                  >
                    <Plus size={14} />
                    Ajouter un plat
                  </button>
                </div>

                {section.items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
                    Aucun plat dans ce bloc.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        index={itemIndex}
                        titlePrefix="Plat"
                        isUploading={isUploading}
                        setIsUploading={setIsUploading}
                        setUploadError={setUploadError}
                        onChange={(patch) => updateSectionItem(section.id, item.id, patch)}
                        onDelete={() => removeSectionItem(section.id, item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
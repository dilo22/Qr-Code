import { FileText, Hash, Image as ImageIcon, Trash2, UtensilsCrossed, Wallet } from "lucide-react";
import Field from "../Field";
import { uploadQrFile } from "@/features/dashboard/create/lib/qr-content.upload";
import { formatFileSize } from "@/features/dashboard/create/lib/qr-content.helpers";
import { inputClass, textareaClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { MenuItem } from "@/features/dashboard/create/types/qr-content.types";

type Props = {
  item: MenuItem;
  index: number;
  titlePrefix: string;
  onChange: (patch: Partial<MenuItem>) => void;
  onDelete: () => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  setUploadError: (value: string | null) => void;
};

export default function MenuItemCard({
  item,
  index,
  titlePrefix,
  onChange,
  onDelete,
  isUploading,
  setIsUploading,
  setUploadError,
}: Props) {
  const uploadItemImage = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadQrFile(file, "menu");
      onChange({
        imagePath: uploaded.storagePath,
        imageFileName: uploaded.fileName,
        imageMimeType: uploaded.mimeType,
        imageSize: uploaded.size,
      });
    } catch (error: any) {
      console.error("UPLOAD MENU ITEM IMAGE ERROR:", error);
      setUploadError(error?.message || "Erreur lors de l’upload de l’image du plat.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-white/85">
          {titlePrefix} {index + 1}
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-[42px] items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-red-300 transition hover:bg-red-500/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <Field label="Photo du plat (facultatif)" icon={<ImageIcon size={14} />}>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await uploadItemImage(file);
            }}
            className={inputClass}
          />
        </Field>

        {isUploading && (
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
            Upload de l’image en cours...
          </div>
        )}

        {item.imageFileName && (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
            <div className="font-medium text-white/90">{item.imageFileName}</div>
            <div className="mt-1 text-xs text-white/45">
              {item.imageMimeType || "Type inconnu"}
              {item.imageSize ? ` • ${formatFileSize(item.imageSize)}` : ""}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nom du plat" icon={<UtensilsCrossed size={14} />}>
            <input type="text" placeholder="Ex: Burger du chef" value={item.name} onChange={(e) => onChange({ name: e.target.value })} className={inputClass} />
          </Field>

          <Field label="Prix" icon={<Wallet size={14} />}>
            <input type="text" placeholder="Ex: 14.90" value={item.price} onChange={(e) => onChange({ price: e.target.value })} className={inputClass} />
          </Field>
        </div>

        <Field label="Description" icon={<FileText size={14} />}>
          <textarea rows={3} placeholder="Décrivez le plat..." value={item.description} onChange={(e) => onChange({ description: e.target.value })} className={textareaClass} />
        </Field>

        <Field label="Ordre" icon={<Hash size={14} />}>
          <input type="number" placeholder="0" value={item.order} onChange={(e) => onChange({ order: Number(e.target.value || 0) })} className={inputClass} />
        </Field>
      </div>
    </div>
  );
}
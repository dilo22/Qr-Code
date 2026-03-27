import { Image as ImageIcon } from "lucide-react";
import Field from "./Field";
import { uploadQrFile } from "@/features/dashboard/create/lib/qr-content.upload";
import { formatFileSize } from "@/features/dashboard/create/lib/qr-content.helpers";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";

type Props = {
  form: Record<string, any>;
  onFormUpdate: (updated: Record<string, any>) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  uploadError: string | null;
  setUploadError: (value: string | null) => void;
};

export default function AvatarUploadField({
  form,
  onFormUpdate,
  isUploading,
  setIsUploading,
  uploadError,
  setUploadError,
}: Props) {
  return (
    <div className="space-y-5">
      <Field label="Photo de profil" icon={<ImageIcon size={14} />}>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploadError(null);
            setIsUploading(true);

            try {
              const uploaded = await uploadQrFile(file, "vcard");
              onFormUpdate({
                ...form,
                avatarPath: uploaded.storagePath,
                avatarFileName: uploaded.fileName,
                avatarMimeType: uploaded.mimeType,
                avatarSize: uploaded.size,
              });
            } catch (error: any) {
              console.error("UPLOAD AVATAR ERROR:", error);
              setUploadError(error?.message || "Erreur lors de l’upload de l’image.");
            } finally {
              setIsUploading(false);
            }
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

      {form.avatarFileName && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
          <div className="font-medium text-white/90">{form.avatarFileName}</div>
          <div className="mt-1 text-xs text-white/45">
            {form.avatarMimeType || "Type inconnu"}
            {form.avatarSize ? ` • ${formatFileSize(form.avatarSize)}` : ""}
          </div>
        </div>
      )}
    </div>
  );
}
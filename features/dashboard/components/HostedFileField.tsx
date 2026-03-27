import Field from "./Field";
import { formatFileSize } from "@/features/dashboard/create/lib/qr-content.helpers";
import { getAcceptedTypes, getTypeMeta } from "@/features/dashboard/create/lib/qr-content.config";
import { uploadQrFile } from "@/features/dashboard/create/lib/qr-content.upload";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";

type Props = {
  type: string;
  form: Record<string, any>;
  onFormUpdate: (updated: Record<string, any>) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  uploadError: string | null;
  setUploadError: (value: string | null) => void;
};

export default function HostedFileField({
  type,
  form,
  onFormUpdate,
  isUploading,
  setIsUploading,
  uploadError,
  setUploadError,
}: Props) {
  const meta = getTypeMeta(type);

  return (
    <div className="space-y-5">
      <Field label="Fichier" icon={meta.icon}>
        <input
          type="file"
          accept={getAcceptedTypes(type)}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploadError(null);
            setIsUploading(true);

            try {
              const uploaded = await uploadQrFile(file, type);
              onFormUpdate({ ...form, ...uploaded });
            } catch (error: any) {
              console.error("UPLOAD FILE ERROR:", error);
              setUploadError(error?.message || "Erreur lors de l’upload du fichier.");
            } finally {
              setIsUploading(false);
            }
          }}
          className={inputClass}
        />
      </Field>

      {isUploading && (
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
          Upload du fichier en cours...
        </div>
      )}

      {uploadError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {uploadError}
        </div>
      )}

      {form.fileName && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
          <div className="font-medium text-white/90">{form.fileName}</div>
          <div className="mt-1 text-xs text-white/45">
            {form.mimeType || "Type inconnu"}
            {form.size ? ` • ${formatFileSize(form.size)}` : ""}
          </div>
        </div>
      )}
    </div>
  );
}
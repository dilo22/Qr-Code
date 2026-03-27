import { Globe } from "lucide-react";
import Field from "../Field";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function UrlForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <Field label="Lien de redirection" icon={<Globe size={14} />}>
      <input
        type="text"
        placeholder="https://neonpulseqr.vercel.app/"
        value={form.url || ""}
        onChange={(e) => handleChange("url", e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}
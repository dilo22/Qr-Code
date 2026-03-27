import { Type } from "lucide-react";
import Field from "../Field";
import { textareaClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function TextForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <Field label="Texte à afficher" icon={<Type size={14} />}>
      <textarea
        rows={7}
        placeholder="Écrivez votre texte ici..."
        value={form.text || ""}
        onChange={(e) => handleChange("text", e.target.value)}
        className={textareaClass}
      />
    </Field>
  );
}
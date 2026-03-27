import { Phone } from "lucide-react";
import Field from "../Field";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function PhoneForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <Field label="Numéro de téléphone" icon={<Phone size={14} />}>
      <input
        type="text"
        placeholder="+33 6 12 34 56 78"
        value={form.phone || ""}
        onChange={(e) => handleChange("phone", e.target.value)}
        className={inputClass}
      />
    </Field>
  );
}
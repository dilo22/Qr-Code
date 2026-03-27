import { MessageSquare, Phone } from "lucide-react";
import Field from "../Field";
import { inputClass, textareaClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function SmsForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <div className="space-y-5">
      <Field label="Numéro" icon={<Phone size={14} />}>
        <input type="text" placeholder="+33 6 12 34 56 78" value={form.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass} />
      </Field>

      <Field label="Message" icon={<MessageSquare size={14} />}>
        <textarea rows={6} placeholder="Votre message..." value={form.message || ""} onChange={(e) => handleChange("message", e.target.value)} className={textareaClass} />
      </Field>
    </div>
  );
}
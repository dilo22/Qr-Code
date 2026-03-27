import { FileText, Mail, MessageSquare } from "lucide-react";
import Field from "../Field";
import { inputClass, textareaClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function EmailForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <div className="space-y-5">
      <Field label="Destinataire" icon={<Mail size={14} />}>
        <input type="email" placeholder="contact@pro.com" value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} className={inputClass} />
      </Field>

      <Field label="Objet" icon={<FileText size={14} />}>
        <input type="text" placeholder="Demande d'information" value={form.subject || ""} onChange={(e) => handleChange("subject", e.target.value)} className={inputClass} />
      </Field>

      <Field label="Message" icon={<MessageSquare size={14} />}>
        <textarea rows={6} placeholder="Bonjour..." value={form.body || ""} onChange={(e) => handleChange("body", e.target.value)} className={textareaClass} />
      </Field>
    </div>
  );
}
import { Building2, Briefcase, Globe, Mail, MapPinned, Phone, User, UserSquare2 } from "lucide-react";
import Field from "../Field";
import { inputClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function ContactForm({ form, handleChange }: BaseQrFormProps) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Prénom" icon={<User size={14} />}>
          <input type="text" placeholder="John" value={form.firstName || ""} onChange={(e) => handleChange("firstName", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Nom" icon={<UserSquare2 size={14} />}>
          <input type="text" placeholder="Doe" value={form.lastName || ""} onChange={(e) => handleChange("lastName", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Téléphone" icon={<Phone size={14} />}>
          <input type="text" placeholder="+33 6 12 34 56 78" value={form.phone || ""} onChange={(e) => handleChange("phone", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Email" icon={<Mail size={14} />}>
          <input type="email" placeholder="contact@entreprise.com" value={form.email || ""} onChange={(e) => handleChange("email", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Entreprise" icon={<Building2 size={14} />}>
          <input type="text" placeholder="Nom de l’entreprise" value={form.company || ""} onChange={(e) => handleChange("company", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Poste" icon={<Briefcase size={14} />}>
          <input type="text" placeholder="Fonction" value={form.jobTitle || ""} onChange={(e) => handleChange("jobTitle", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Adresse" icon={<MapPinned size={14} />}>
          <input type="text" placeholder="Adresse complète" value={form.address || ""} onChange={(e) => handleChange("address", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Site web" icon={<Globe size={14} />}>
          <input type="text" placeholder="https://monsite.com" value={form.website || ""} onChange={(e) => handleChange("website", e.target.value)} className={inputClass} />
        </Field>
      </div>
    </div>
  );
}
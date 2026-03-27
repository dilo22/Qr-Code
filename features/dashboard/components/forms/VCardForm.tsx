import { Briefcase, Building2, FileText, Globe, Mail, MapPinned, Phone, UserSquare2 } from "lucide-react";
import AvatarUploadField from "../AvatarUploadField";
import Field from "../Field";
import LinksEditor from "../LinksEditor";
import { inputClass, textareaClass } from "@/features/dashboard/create/lib/qr-content.styles";
import type { BaseQrFormProps } from "@/features/dashboard/create/types/qr-content.types";

export default function VCardForm(props: BaseQrFormProps) {
  const {
    form,
    handleChange,
    handleFormUpdate,
    isUploading = false,
    setIsUploading = () => {},
    uploadError = null,
    setUploadError = () => {},
  } = props;

  return (
    <div className="space-y-6">
      <AvatarUploadField
        form={form}
        onFormUpdate={handleFormUpdate}
        isUploading={isUploading}
        setIsUploading={setIsUploading}
        uploadError={uploadError}
        setUploadError={setUploadError}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <Field label="Nom affiché" icon={<UserSquare2 size={14} />}>
          <input type="text" placeholder="Ex: Sophie Martin" value={form.displayName ?? ""} onChange={(e) => handleChange("displayName", e.target.value)} className={inputClass} />
        </Field>

        <Field label="Titre / accroche" icon={<Briefcase size={14} />}>
          <input type="text" placeholder="Ex: Designer produit" value={form.headline || ""} onChange={(e) => handleChange("headline", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <Field label="Bio / description" icon={<FileText size={14} />}>
        <textarea rows={5} placeholder="Présentez-vous en quelques lignes..." value={form.bio || ""} onChange={(e) => handleChange("bio", e.target.value)} className={textareaClass} />
      </Field>

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

        <Field label="Site principal" icon={<Globe size={14} />}>
          <input type="text" placeholder="https://monsite.com" value={form.website || ""} onChange={(e) => handleChange("website", e.target.value)} className={inputClass} />
        </Field>
      </div>

      <LinksEditor
        links={form.links || []}
        onChange={(links) => handleFormUpdate({ ...form, links })}
      />
    </div>
  );
}
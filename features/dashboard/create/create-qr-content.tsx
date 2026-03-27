"use client";

import { supabase } from "@/lib/supabase/client";
import { useState } from "react";
import {
  ArrowRight,
  Link as LinkIcon,
  Wifi,
  FileText,
  UserSquare2,
  Mail,
  MessageSquare,
  Phone,
  Instagram,
  Facebook,
  Video,
  Linkedin,
  Twitter,
  Youtube,
  File,
  Image as ImageIcon,
  Music2,
  MapPin,
  CalendarDays,
  CreditCard,
  Smartphone,
  Star,
  UtensilsCrossed,
  ShieldCheck,
  Lock,
  Globe,
  ChevronDown,
  User,
  Building2,
  Briefcase,
  Hash,
  MapPinned,
  Clock3,
  Wallet,
  Type,
} from "lucide-react";

type Props = {
  type: string;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  onLiveChange?: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
};

function getTypeMeta(type: string) {
  const metas: Record<string, any> = {
    url: { icon: <LinkIcon size={22} />, title: "Lien web", description: "Redirigez vers une URL." },
    wifi: { icon: <Wifi size={22} />, title: "Wi-Fi", description: "Connexion rapide à un réseau." },
    text: { icon: <FileText size={22} />, title: "Texte", description: "Affichez un texte simple après scan." },
    vcard: { icon: <UserSquare2 size={22} />, title: "Carte de visite", description: "Partagez vos coordonnées complètes." },
    email: { icon: <Mail size={22} />, title: "Email", description: "Préparez un email avec objet et message." },
    sms: { icon: <MessageSquare size={22} />, title: "SMS", description: "Envoyez un message à un numéro." },
    phone: { icon: <Phone size={22} />, title: "Téléphone", description: "Lancez un appel directement." },
    instagram: { icon: <Instagram size={22} />, title: "Instagram", description: "Lien vers votre profil Instagram." },
    facebook: { icon: <Facebook size={22} />, title: "Facebook", description: "Lien vers votre page Facebook." },
    tiktok: { icon: <Video size={22} />, title: "TikTok", description: "Lien vers votre profil TikTok." },
    linkedin: { icon: <Linkedin size={22} />, title: "LinkedIn", description: "Lien vers votre profil LinkedIn." },
    twitter: { icon: <Twitter size={22} />, title: "X / Twitter", description: "Lien vers votre profil X." },
    youtube: { icon: <Youtube size={22} />, title: "YouTube", description: "Lien vers votre chaîne ou vidéo." },
    pdf: { icon: <File size={22} />, title: "PDF", description: "Importez un document PDF." },
    image: { icon: <ImageIcon size={22} />, title: "Image", description: "Importez une image." },
    audio: { icon: <Music2 size={22} />, title: "Audio", description: "Importez un fichier audio." },
    location: { icon: <MapPin size={22} />, title: "Localisation", description: "Adresse ou coordonnées GPS." },
    event: { icon: <CalendarDays size={22} />, title: "Événement", description: "Créez un QR pour un événement." },
    payment: { icon: <CreditCard size={22} />, title: "Paiement", description: "Préparez un paiement simple." },
    app: { icon: <Smartphone size={22} />, title: "Application", description: "Lien vers une application ou un store." },
    menu: { icon: <UtensilsCrossed size={22} />, title: "Menu", description: "Partagez votre menu en ligne." },
    review: { icon: <Star size={22} />, title: "Avis", description: "Lien vers votre page d’avis." },
  };

  return metas[type] || {
    icon: <FileText size={22} />,
    title: "Contenu",
    description: "Configurez votre QR code.",
  };
}

function getAcceptedTypes(type: string) {
  switch (type) {
    case "pdf":
      return "application/pdf";
    case "image":
      return "image/*";
    case "audio":
      return "audio/*";
    default:
      return "*/*";
  }
}

function formatFileSize(size?: number) {
  if (!size || Number.isNaN(size)) return "";
  if (size < 1024) return `${size} o`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} Go`;
}

async function uploadQrFile(file: File, type: string) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) throw userError;
  if (!user) throw new Error("Utilisateur non connecté.");

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "";
  const safeExt = extension ? `.${extension}` : "";
  const filePath = `${user.id}/${crypto.randomUUID()}${safeExt}`;

  const { error: uploadError } = await supabase.storage
    .from("qr-files")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  return {
    storagePath: filePath,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    fileCategory: type,
    kind: "hosted_file",
  };
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-white/25 focus:border-cyan-400/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-400/10";

const textareaClass = `${inputClass} min-h-[120px] resize-y leading-6`;
const nativeInputClass = `${inputClass} appearance-none`;

export default function CreateQrContent({
  type,
  onNext,
  onBack,
  onLiveChange,
  initialData = {},
}: Props) {
  const [form, setForm] = useState<Record<string, any>>(initialData);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleChange = (field: string, newValue: any) => {
    const updated = { ...form, [field]: newValue };
    setForm(updated);
    onLiveChange?.(updated);
  };

  const meta = getTypeMeta(type);

  const renderUrlField = (
    label = "Lien de redirection",
    placeholder = "https://neonpulseqr.vercel.app/",
    field = "url"
  ) => (
    <Field label={label} icon={<Globe size={14} />}>
      <input
        type="text"
        placeholder={placeholder}
        value={form[field] || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        className={inputClass}
      />
    </Field>
  );

  const renderHostedFileField = () => (
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
              const updated = {
                ...form,
                ...uploaded,
              };

              setForm(updated);
              onLiveChange?.(updated);
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

  const renderFields = () => {
    switch (type) {
      case "wifi":
        return (
          <div className="space-y-5">
            <Field label="Nom du réseau (SSID)" icon={<Wifi size={14} />}>
              <input
                type="text"
                placeholder="Ex: MaBox_Guest"
                value={form.ssid || ""}
                onChange={(e) => handleChange("ssid", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Mot de passe" icon={<Lock size={14} />}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password || ""}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Sécurité" icon={<ShieldCheck size={14} />}>
                <div className="relative">
                  <select
                    value={form.encryption || "WPA"}
                    onChange={(e) => handleChange("encryption", e.target.value)}
                    className={`${inputClass} appearance-none pr-12`}
                  >
                    <option value="WPA">WPA / WPA2</option>
                    <option value="WEP">WEP</option>
                    <option value="nopass">Ouvert</option>
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40"
                    size={16}
                  />
                </div>
              </Field>
            </div>
          </div>
        );

      case "text":
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

      case "vcard":
        return (
          <div className="space-y-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Prénom" icon={<User size={14} />}>
                <input
                  type="text"
                  placeholder="John"
                  value={form.firstName || ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Nom" icon={<UserSquare2 size={14} />}>
                <input
                  type="text"
                  placeholder="Doe"
                  value={form.lastName || ""}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Téléphone" icon={<Phone size={14} />}>
                <input
                  type="text"
                  placeholder="+33 6 12 34 56 78"
                  value={form.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Email" icon={<Mail size={14} />}>
                <input
                  type="email"
                  placeholder="contact@entreprise.com"
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Entreprise" icon={<Building2 size={14} />}>
                <input
                  type="text"
                  placeholder="Nom de l’entreprise"
                  value={form.company || ""}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Poste" icon={<Briefcase size={14} />}>
                <input
                  type="text"
                  placeholder="Fonction"
                  value={form.jobTitle || ""}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Adresse" icon={<MapPinned size={14} />}>
                <input
                  type="text"
                  placeholder="Adresse complète"
                  value={form.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Site web" icon={<Globe size={14} />}>
                <input
                  type="text"
                  placeholder="https://monsite.com"
                  value={form.website || ""}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        );

      case "email":
        return (
          <div className="space-y-5">
            <Field label="Destinataire" icon={<Mail size={14} />}>
              <input
                type="email"
                placeholder="contact@pro.com"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Objet" icon={<FileText size={14} />}>
              <input
                type="text"
                placeholder="Demande d'information"
                value={form.subject || ""}
                onChange={(e) => handleChange("subject", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Message" icon={<MessageSquare size={14} />}>
              <textarea
                rows={6}
                placeholder="Bonjour..."
                value={form.body || ""}
                onChange={(e) => handleChange("body", e.target.value)}
                className={textareaClass}
              />
            </Field>
          </div>
        );

      case "sms":
        return (
          <div className="space-y-5">
            <Field label="Numéro" icon={<Phone size={14} />}>
              <input
                type="text"
                placeholder="+33 6 12 34 56 78"
                value={form.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Message" icon={<MessageSquare size={14} />}>
              <textarea
                rows={6}
                placeholder="Votre message..."
                value={form.message || ""}
                onChange={(e) => handleChange("message", e.target.value)}
                className={textareaClass}
              />
            </Field>
          </div>
        );

      case "phone":
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

      case "location":
        return (
          <div className="space-y-5">
            <Field label="Adresse ou lieu" icon={<MapPin size={14} />}>
              <input
                type="text"
                placeholder="10 rue de Paris, Lyon"
                value={form.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Latitude" icon={<MapPinned size={14} />}>
                <input
                  type="text"
                  placeholder="48.8566"
                  value={form.latitude || ""}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Longitude" icon={<MapPinned size={14} />}>
                <input
                  type="text"
                  placeholder="2.3522"
                  value={form.longitude || ""}
                  onChange={(e) => handleChange("longitude", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        );

      case "event":
        return (
          <div className="space-y-5">
            <Field label="Titre de l’événement" icon={<CalendarDays size={14} />}>
              <input
                type="text"
                placeholder="Conférence annuelle"
                value={form.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Date de début" icon={<CalendarDays size={14} />}>
                <input
                  type="date"
                  value={form.startDate || ""}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className={nativeInputClass}
                />
              </Field>

              <Field label="Heure de début" icon={<Clock3 size={14} />}>
                <input
                  type="time"
                  value={form.startTime || ""}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className={nativeInputClass}
                />
              </Field>
            </div>

            <Field label="Lieu" icon={<MapPin size={14} />}>
              <input
                type="text"
                placeholder="Salle / Adresse"
                value={form.location || ""}
                onChange={(e) => handleChange("location", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        );

      case "payment":
        return (
          <div className="space-y-5">
            <Field label="Nom du bénéficiaire" icon={<User size={14} />}>
              <input
                type="text"
                placeholder="Nom ou entreprise"
                value={form.payee || ""}
                onChange={(e) => handleChange("payee", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Montant" icon={<Wallet size={14} />}>
                <input
                  type="text"
                  placeholder="49.99"
                  value={form.amount || ""}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Devise" icon={<Hash size={14} />}>
                <input
                  type="text"
                  placeholder="EUR"
                  value={form.currency || ""}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>
        );

      case "pdf":
      case "image":
      case "audio":
        return renderHostedFileField();

      case "instagram":
      case "facebook":
      case "tiktok":
      case "linkedin":
      case "twitter":
      case "youtube":
      case "app":
      case "menu":
      case "review":
      case "url":
        return renderUrlField();

      default:
        return renderUrlField();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-5 xl:max-w-[920px]">
      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,#070914_0%,#05060f_100%)] p-5 shadow-[0_10px_32px_rgba(0,0,0,0.24)] md:p-7">
        <div className="mb-6 flex items-start gap-4 md:mb-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[18px] border border-white/10 bg-white/[0.04] text-white md:h-16 md:w-16">
            {meta.icon}
          </div>

          <div>
            <span className="mb-2 inline-block rounded-full bg-cyan-400/10 px-2.5 py-1 text-[9px] font-black tracking-[0.16em] text-cyan-400">
              QR CONTENT
            </span>
            <h1 className="text-2xl font-black leading-none text-white md:text-4xl">
              {meta.title}
            </h1>
            <p className="mt-2 max-w-xl text-xs leading-5 text-white/45 md:text-sm">
              {meta.description}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <Field label="Nom du projet" icon={<FileText size={14} />}>
            <input
              type="text"
              placeholder="Ex: Menu restaurant, WiFi bureau..."
              value={form.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              className={`${inputClass} border-dashed`}
            />
          </Field>

          <div className="h-px w-full bg-white/5" />

          {renderFields()}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={onBack}
          className="rounded-xl border border-white/10 bg-transparent px-6 py-3 text-sm font-bold text-white transition hover:bg-white/5"
        >
          ← Retour
        </button>

        <button
          onClick={() => onNext(form)}
          disabled={isUploading}
          className="flex items-center justify-center gap-2.5 rounded-xl bg-white px-7 py-3 text-sm font-black text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.14)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          Continuer <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="w-full">
      <label className="mb-2 flex items-center gap-2 pl-1 text-[11px] font-black uppercase tracking-[0.1em] text-white/45">
        {icon && <span className="flex shrink-0 items-center justify-center text-cyan-400">{icon}</span>}
        {label}
      </label>
      <div className="w-full">{children}</div>
    </div>
  );
}
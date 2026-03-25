"use client";

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
    url: { icon: <LinkIcon size={24} />, title: "Lien web", description: "Redirigez vers une URL." },
    wifi: { icon: <Wifi size={24} />, title: "Wi-Fi", description: "Connexion rapide à un réseau." },
    text: { icon: <FileText size={24} />, title: "Texte", description: "Affichez un texte simple après scan." },
    vcard: { icon: <UserSquare2 size={24} />, title: "Carte de visite", description: "Partagez vos coordonnées complètes." },
    email: { icon: <Mail size={24} />, title: "Email", description: "Préparez un email avec objet et message." },
    sms: { icon: <MessageSquare size={24} />, title: "SMS", description: "Envoyez un message à un numéro." },
    phone: { icon: <Phone size={24} />, title: "Téléphone", description: "Lancez un appel directement." },
    instagram: { icon: <Instagram size={24} />, title: "Instagram", description: "Lien vers votre profil Instagram." },
    facebook: { icon: <Facebook size={24} />, title: "Facebook", description: "Lien vers votre page Facebook." },
    tiktok: { icon: <Video size={24} />, title: "TikTok", description: "Lien vers votre profil TikTok." },
    linkedin: { icon: <Linkedin size={24} />, title: "LinkedIn", description: "Lien vers votre profil LinkedIn." },
    twitter: { icon: <Twitter size={24} />, title: "X / Twitter", description: "Lien vers votre profil X." },
    youtube: { icon: <Youtube size={24} />, title: "YouTube", description: "Lien vers votre chaîne ou vidéo." },
    pdf: { icon: <File size={24} />, title: "PDF", description: "Lien vers un document PDF." },
    image: { icon: <ImageIcon size={24} />, title: "Image", description: "Lien vers une image." },
    audio: { icon: <Music2 size={24} />, title: "Audio", description: "Lien vers un audio." },
    location: { icon: <MapPin size={24} />, title: "Localisation", description: "Adresse ou coordonnées GPS." },
    event: { icon: <CalendarDays size={24} />, title: "Événement", description: "Créez un QR pour un événement." },
    payment: { icon: <CreditCard size={24} />, title: "Paiement", description: "Préparez un paiement simple." },
    app: { icon: <Smartphone size={24} />, title: "Application", description: "Lien vers une application ou un store." },
    menu: { icon: <UtensilsCrossed size={24} />, title: "Menu", description: "Partagez votre menu en ligne." },
    review: { icon: <Star size={24} />, title: "Avis", description: "Lien vers votre page d’avis." },
  };

  return metas[type] || {
    icon: <FileText size={24} />,
    title: "Contenu",
    description: "Configurez votre QR code.",
  };
}

const inputClass =
  "w-full rounded-2xl border border-white/10 bg-white/[0.05] px-5 py-4 text-base text-white outline-none transition-all placeholder:text-white/25 focus:border-cyan-400/70 focus:bg-white/[0.08] focus:ring-4 focus:ring-cyan-400/10";
const textareaClass =
  `${inputClass} min-h-[150px] resize-y leading-7`;
const nativeInputClass =
  `${inputClass} appearance-none`;

export default function CreateQrContent({
  type,
  onNext,
  onBack,
  onLiveChange,
  initialData = {},
}: Props) {
  const [form, setForm] = useState<Record<string, any>>(initialData);

  const handleChange = (field: string, newValue: any) => {
    const updated = { ...form, [field]: newValue };
    setForm(updated);
    onLiveChange?.(updated);
  };

  const meta = getTypeMeta(type);

  const renderUrlField = (
    label = "Lien de redirection",
    placeholder = "https://ton-lien.com",
    field = "url"
  ) => (
    <Field label={label} icon={<Globe size={15} />}>
      <input
        type="text"
        placeholder={placeholder}
        value={form[field] || ""}
        onChange={(e) => handleChange(field, e.target.value)}
        className={inputClass}
      />
    </Field>
  );

  const renderFields = () => {
    switch (type) {
      case "wifi":
        return (
          <div className="space-y-6">
            <Field label="Nom du réseau (SSID)" icon={<Wifi size={15} />}>
              <input
                type="text"
                placeholder="Ex: MaBox_Guest"
                value={form.ssid || ""}
                onChange={(e) => handleChange("ssid", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Mot de passe" icon={<Lock size={15} />}>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={form.password || ""}
                  onChange={(e) => handleChange("password", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Sécurité" icon={<ShieldCheck size={15} />}>
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
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                </div>
              </Field>
            </div>
          </div>
        );

      case "text":
        return (
          <Field label="Texte à afficher" icon={<Type size={15} />}>
            <textarea
              rows={8}
              placeholder="Écrivez votre texte ici..."
              value={form.text || ""}
              onChange={(e) => handleChange("text", e.target.value)}
              className={textareaClass}
            />
          </Field>
        );

      case "vcard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Prénom" icon={<User size={15} />}>
                <input
                  type="text"
                  placeholder="John"
                  value={form.firstName || ""}
                  onChange={(e) => handleChange("firstName", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Nom" icon={<UserSquare2 size={15} />}>
                <input
                  type="text"
                  placeholder="Doe"
                  value={form.lastName || ""}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Téléphone" icon={<Phone size={15} />}>
                <input
                  type="text"
                  placeholder="+33 6 12 34 56 78"
                  value={form.phone || ""}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Email" icon={<Mail size={15} />}>
                <input
                  type="email"
                  placeholder="contact@entreprise.com"
                  value={form.email || ""}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Entreprise" icon={<Building2 size={15} />}>
                <input
                  type="text"
                  placeholder="Nom de l’entreprise"
                  value={form.company || ""}
                  onChange={(e) => handleChange("company", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Poste" icon={<Briefcase size={15} />}>
                <input
                  type="text"
                  placeholder="Fonction"
                  value={form.jobTitle || ""}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Adresse" icon={<MapPinned size={15} />}>
                <input
                  type="text"
                  placeholder="Adresse complète"
                  value={form.address || ""}
                  onChange={(e) => handleChange("address", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Site web" icon={<Globe size={15} />}>
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
          <div className="space-y-6">
            <Field label="Destinataire" icon={<Mail size={15} />}>
              <input
                type="email"
                placeholder="contact@pro.com"
                value={form.email || ""}
                onChange={(e) => handleChange("email", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Objet" icon={<FileText size={15} />}>
              <input
                type="text"
                placeholder="Demande d'information"
                value={form.subject || ""}
                onChange={(e) => handleChange("subject", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Message" icon={<MessageSquare size={15} />}>
              <textarea
                rows={7}
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
          <div className="space-y-6">
            <Field label="Numéro" icon={<Phone size={15} />}>
              <input
                type="text"
                placeholder="+33 6 12 34 56 78"
                value={form.phone || ""}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Message" icon={<MessageSquare size={15} />}>
              <textarea
                rows={7}
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
          <Field label="Numéro de téléphone" icon={<Phone size={15} />}>
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
          <div className="space-y-6">
            <Field label="Adresse ou lieu" icon={<MapPin size={15} />}>
              <input
                type="text"
                placeholder="10 rue de Paris, Lyon"
                value={form.address || ""}
                onChange={(e) => handleChange("address", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Latitude" icon={<MapPinned size={15} />}>
                <input
                  type="text"
                  placeholder="48.8566"
                  value={form.latitude || ""}
                  onChange={(e) => handleChange("latitude", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Longitude" icon={<MapPinned size={15} />}>
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
          <div className="space-y-6">
            <Field label="Titre de l’événement" icon={<CalendarDays size={15} />}>
              <input
                type="text"
                placeholder="Conférence annuelle"
                value={form.title || ""}
                onChange={(e) => handleChange("title", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Date de début" icon={<CalendarDays size={15} />}>
                <input
                  type="date"
                  value={form.startDate || ""}
                  onChange={(e) => handleChange("startDate", e.target.value)}
                  className={nativeInputClass}
                />
              </Field>

              <Field label="Heure de début" icon={<Clock3 size={15} />}>
                <input
                  type="time"
                  value={form.startTime || ""}
                  onChange={(e) => handleChange("startTime", e.target.value)}
                  className={nativeInputClass}
                />
              </Field>
            </div>

            <Field label="Lieu" icon={<MapPin size={15} />}>
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
          <div className="space-y-6">
            <Field label="Nom du bénéficiaire" icon={<User size={15} />}>
              <input
                type="text"
                placeholder="Nom ou entreprise"
                value={form.payee || ""}
                onChange={(e) => handleChange("payee", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Field label="Montant" icon={<Wallet size={15} />}>
                <input
                  type="text"
                  placeholder="49.99"
                  value={form.amount || ""}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Devise" icon={<Hash size={15} />}>
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

      case "instagram":
      case "facebook":
      case "tiktok":
      case "linkedin":
      case "twitter":
      case "youtube":
      case "app":
      case "menu":
      case "review":
      case "pdf":
      case "image":
      case "audio":
      case "url":
        return renderUrlField();

      default:
        return renderUrlField();
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-7">
      <div className="rounded-[34px] border border-white/10 bg-[linear-gradient(180deg,#070914_0%,#05060f_100%)] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.28)] md:p-10">
        <div className="mb-8 flex items-start gap-5 md:mb-10">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-[20px] border border-white/10 bg-white/[0.04] text-white md:h-[68px] md:w-[68px]">
            {meta.icon}
          </div>

          <div>
            <span className="mb-3 inline-block rounded-full bg-cyan-400/10 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-cyan-400">
              QR CONTENT
            </span>
            <h1 className="text-3xl font-black leading-none text-white md:text-5xl">
              {meta.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45 md:text-[15px]">
              {meta.description}
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <Field label="Nom du projet" icon={<FileText size={15} />}>
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
          className="rounded-2xl border border-white/10 bg-transparent px-7 py-3.5 font-bold text-white transition hover:bg-white/5"
        >
          ← Retour
        </button>

        <button
          onClick={() => onNext(form)}
          className="flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-3.5 font-black text-black transition hover:-translate-y-0.5 hover:shadow-[0_10px_24px_rgba(255,255,255,0.14)]"
        >
          Continuer <ArrowRight size={18} />
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
      <label className="mb-3 flex items-center gap-2.5 pl-1 text-[12px] font-black uppercase tracking-[0.12em] text-white/45">
        {icon && <span className="flex shrink-0 items-center justify-center text-cyan-400">{icon}</span>}
        {label}
      </label>
      <div className="w-full">{children}</div>
    </div>
  );
}
"use client";

import LocationPicker from "@/features/dashboard/create/components/LocationPicker";
import { supabase } from "@/lib/supabase/client";
import { useMemo, useState } from "react";
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
  Plus,
  Trash2,
} from "lucide-react";

type Props = {
  type: string;
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  onLiveChange?: (data: Record<string, any>) => void;
  initialData?: Record<string, any>;
};

type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: string;
  imagePath?: string;
  imageFileName?: string;
  imageMimeType?: string;
  imageSize?: number;
  order: number;
};

type MenuSection = {
  id: string;
  title: string;
  description: string;
  order: number;
  items: MenuItem[];
};

type MenuRestaurant = {
  name: string;
  bio: string;
  phone: string;
  website: string;
  address: string;
  coverImagePath?: string;
  coverImageFileName?: string;
  coverImageMimeType?: string;
  coverImageSize?: number;
};

type MenuData = {
  restaurant: MenuRestaurant;
  featuredItems: MenuItem[];
  sections: MenuSection[];
};

function getTypeMeta(type: string) {
  const metas: Record<string, any> = {
    url: { icon: <LinkIcon size={22} />, title: "Lien web", description: "Redirigez vers une URL." },
    wifi: { icon: <Wifi size={22} />, title: "Wi-Fi", description: "Connexion rapide à un réseau." },
    text: { icon: <FileText size={22} />, title: "Texte", description: "Affichez un texte simple après scan." },
    contact: {
      icon: <UserSquare2 size={22} />,
      title: "Contact",
      description: "Créez une fiche contact classique encodée dans le QR.",
    },
    vcard: {
      icon: <UserSquare2 size={22} />,
      title: "Carte profil",
      description: "Créez une page profil dynamique avec photo, bio et liens.",
    },
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
    menu: {
      icon: <UtensilsCrossed size={22} />,
      title: "Menu",
      description: "Créez une page menu dynamique avec restaurant, sections et plats.",
    },
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
    case "vcard":
      return "image/*";
    case "menu":
      return "image/*";
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

  const { error: uploadError } = await supabase.storage.from("qr-files").upload(filePath, file, {
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

function createMenuItem(order = 0): MenuItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    price: "",
    imagePath: "",
    imageFileName: "",
    imageMimeType: "",
    imageSize: undefined,
    order,
  };
}

function createMenuSection(order = 0): MenuSection {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    order,
    items: [],
  };
}

function createEmptyMenuData(): MenuData {
  return {
    restaurant: {
      name: "",
      bio: "",
      phone: "",
      website: "",
      address: "",
      coverImagePath: "",
      coverImageFileName: "",
      coverImageMimeType: "",
      coverImageSize: undefined,
    },
    featuredItems: [],
    sections: [],
  };
}

function normalizeInitialForm(initialData: Record<string, any>) {
  const normalized = {
    links: [],
    ...initialData,
  };

  if (normalized.menuData) {
    return normalized;
  }

  return {
    ...normalized,
    menuData: createEmptyMenuData(),
  };
}

export default function CreateQrContent({
  type,
  onNext,
  onBack,
  onLiveChange,
  initialData = {},
}: Props) {
  const [form, setForm] = useState<Record<string, any>>(normalizeInitialForm(initialData));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFormUpdate = (updated: Record<string, any>) => {
    setForm(updated);
    onLiveChange?.(updated);
  };

  const handleChange = (field: string, newValue: any) => {
    const updated = { ...form, [field]: newValue };
    handleFormUpdate(updated);
  };

  const handleLinksChange = (nextLinks: Array<{ label: string; url: string }>) => {
    const updated = { ...form, links: nextLinks };
    handleFormUpdate(updated);
  };

  const handleMenuDataChange = (nextMenuData: MenuData) => {
    const updated = {
      ...form,
      menuData: nextMenuData,
    };
    handleFormUpdate(updated);
  };

  const addLinkItem = () => {
    const nextLinks = [...(form.links || []), { label: "", url: "" }];
    handleLinksChange(nextLinks);
  };

  const updateLinkItem = (index: number, field: "label" | "url", value: string) => {
    const nextLinks = [...(form.links || [])];
    nextLinks[index] = {
      ...nextLinks[index],
      [field]: value,
    };
    handleLinksChange(nextLinks);
  };

  const removeLinkItem = (index: number) => {
    const nextLinks = (form.links || []).filter((_: any, i: number) => i !== index);
    handleLinksChange(nextLinks);
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

              handleFormUpdate(updated);
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

  const renderAvatarUploadField = () => (
    <div className="space-y-5">
      <Field label="Photo de profil" icon={<ImageIcon size={14} />}>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;

            setUploadError(null);
            setIsUploading(true);

            try {
              const uploaded = await uploadQrFile(file, "vcard");
              const updated = {
                ...form,
                avatarPath: uploaded.storagePath,
                avatarFileName: uploaded.fileName,
                avatarMimeType: uploaded.mimeType,
                avatarSize: uploaded.size,
              };

              handleFormUpdate(updated);
            } catch (error: any) {
              console.error("UPLOAD AVATAR ERROR:", error);
              setUploadError(error?.message || "Erreur lors de l’upload de l’image.");
            } finally {
              setIsUploading(false);
            }
          }}
          className={inputClass}
        />
      </Field>

      {isUploading && (
        <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
          Upload de l’image en cours...
        </div>
      )}

      {uploadError && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {uploadError}
        </div>
      )}

      {form.avatarFileName && (
        <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
          <div className="font-medium text-white/90">{form.avatarFileName}</div>
          <div className="mt-1 text-xs text-white/45">
            {form.avatarMimeType || "Type inconnu"}
            {form.avatarSize ? ` • ${formatFileSize(form.avatarSize)}` : ""}
          </div>
        </div>
      )}
    </div>
  );

  const renderLinksEditor = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="pl-1 text-[11px] font-black uppercase tracking-[0.1em] text-white/45">
          Liens personnalisés
        </label>

        <button
          type="button"
          onClick={addLinkItem}
          className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
        >
          <Plus size={14} />
          Ajouter un lien
        </button>
      </div>

      {(form.links || []).length === 0 && (
        <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
          Aucun lien ajouté pour le moment.
        </div>
      )}

      {(form.links || []).map((link: { label: string; url: string }, index: number) => (
        <div key={index} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_1.4fr_auto]">
            <Field label="Label" icon={<Hash size={14} />}>
              <input
                type="text"
                placeholder="Ex: Portfolio"
                value={link.label || ""}
                onChange={(e) => updateLinkItem(index, "label", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Lien" icon={<Globe size={14} />}>
              <input
                type="text"
                placeholder="https://..."
                value={link.url || ""}
                onChange={(e) => updateLinkItem(index, "url", e.target.value)}
                className={inputClass}
              />
            </Field>

            <div className="flex items-end">
              <button
                type="button"
                onClick={() => removeLinkItem(index)}
                className="inline-flex h-[50px] items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-red-300 transition hover:bg-red-500/20"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
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

      case "contact":
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

      case "vcard":
        return (
          <div className="space-y-6">
            {renderAvatarUploadField()}

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field label="Nom affiché" icon={<UserSquare2 size={14} />}>
                <input
                  type="text"
                  placeholder="Ex: Sophie Martin"
                  value={form.displayName ?? ""}
                  onChange={(e) => handleChange("displayName", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Titre / accroche" icon={<Briefcase size={14} />}>
                <input
                  type="text"
                  placeholder="Ex: Designer produit"
                  value={form.headline || ""}
                  onChange={(e) => handleChange("headline", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Bio / description" icon={<FileText size={14} />}>
              <textarea
                rows={5}
                placeholder="Présentez-vous en quelques lignes..."
                value={form.bio || ""}
                onChange={(e) => handleChange("bio", e.target.value)}
                className={textareaClass}
              />
            </Field>

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

              <Field label="Site principal" icon={<Globe size={14} />}>
                <input
                  type="text"
                  placeholder="https://monsite.com"
                  value={form.website || ""}
                  onChange={(e) => handleChange("website", e.target.value)}
                  className={inputClass}
                />
              </Field>
            </div>

            {renderLinksEditor()}
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
            <Field label="Localisation" icon={<MapPin size={14} />}>
              <LocationPicker
                value={{
                  address: form.address,
                  latitude: form.latitude,
                  longitude: form.longitude,
                }}
                onChange={({ address, latitude, longitude }) => {
                  const updated = {
                    ...form,
                    address,
                    latitude,
                    longitude,
                  };
                  handleFormUpdate(updated);
                }}
              />
            </Field>
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

      case "menu":
        return (
          <MenuEditor
            value={form.menuData || createEmptyMenuData()}
            onChange={handleMenuDataChange}
            isUploading={isUploading}
            setIsUploading={setIsUploading}
            uploadError={uploadError}
            setUploadError={setUploadError}
          />
        );

      case "instagram":
      case "facebook":
      case "tiktok":
      case "linkedin":
      case "twitter":
      case "youtube":
      case "app":
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
            <h1 className="text-2xl font-black leading-none text-white md:text-4xl">{meta.title}</h1>
            <p className="mt-2 max-w-xl text-xs leading-5 text-white/45 md:text-sm">{meta.description}</p>
          </div>
        </div>

        <div className="space-y-6">
          <Field label="Nom du projet" icon={<FileText size={14} />}>
            <input
              type="text"
              placeholder="Ex: Carte Sophie, Profil RH, Portfolio..."
              value={form.projectName ?? ""}
              onChange={(e) => handleChange("projectName", e.target.value)}
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

function MenuEditor({
  value,
  onChange,
  isUploading,
  setIsUploading,
  uploadError,
  setUploadError,
}: {
  value: MenuData;
  onChange: (next: MenuData) => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  uploadError: string | null;
  setUploadError: (value: string | null) => void;
}) {
  const menuData = useMemo(() => value || createEmptyMenuData(), [value]);

  const updateRestaurantField = (field: keyof MenuRestaurant, newValue: any) => {
    onChange({
      ...menuData,
      restaurant: {
        ...menuData.restaurant,
        [field]: newValue,
      },
    });
  };

  const uploadRestaurantCover = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadQrFile(file, "menu");
      onChange({
        ...menuData,
        restaurant: {
          ...menuData.restaurant,
          coverImagePath: uploaded.storagePath,
          coverImageFileName: uploaded.fileName,
          coverImageMimeType: uploaded.mimeType,
          coverImageSize: uploaded.size,
        },
      });
    } catch (error: any) {
      console.error("UPLOAD MENU COVER ERROR:", error);
      setUploadError(error?.message || "Erreur lors de l’upload de l’image du restaurant.");
    } finally {
      setIsUploading(false);
    }
  };

  const addFeaturedItem = () => {
    onChange({
      ...menuData,
      featuredItems: [...menuData.featuredItems, createMenuItem(menuData.featuredItems.length)],
    });
  };

  const updateFeaturedItem = (itemId: string, patch: Partial<MenuItem>) => {
    onChange({
      ...menuData,
      featuredItems: menuData.featuredItems.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item
      ),
    });
  };

  const removeFeaturedItem = (itemId: string) => {
    onChange({
      ...menuData,
      featuredItems: menuData.featuredItems.filter((item) => item.id !== itemId),
    });
  };

  const addSection = () => {
    onChange({
      ...menuData,
      sections: [...menuData.sections, createMenuSection(menuData.sections.length)],
    });
  };

  const updateSection = (sectionId: string, patch: Partial<MenuSection>) => {
    onChange({
      ...menuData,
      sections: menuData.sections.map((section) =>
        section.id === sectionId ? { ...section, ...patch } : section
      ),
    });
  };

  const removeSection = (sectionId: string) => {
    onChange({
      ...menuData,
      sections: menuData.sections.filter((section) => section.id !== sectionId),
    });
  };

  const addItemToSection = (sectionId: string) => {
    onChange({
      ...menuData,
      sections: menuData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: [...section.items, createMenuItem(section.items.length)],
            }
          : section
      ),
    });
  };

  const updateSectionItem = (sectionId: string, itemId: string, patch: Partial<MenuItem>) => {
    onChange({
      ...menuData,
      sections: menuData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.map((item) => (item.id === itemId ? { ...item, ...patch } : item)),
            }
          : section
      ),
    });
  };

  const removeSectionItem = (sectionId: string, itemId: string) => {
    onChange({
      ...menuData,
      sections: menuData.sections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              items: section.items.filter((item) => item.id !== itemId),
            }
          : section
      ),
    });
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="mb-4 flex items-center gap-2">
          <Building2 size={16} className="text-cyan-400" />
          <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white/70">
            Restaurant
          </h3>
        </div>

        <div className="space-y-5">
          <Field label="Photo principale / couverture" icon={<ImageIcon size={14} />}>
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await uploadRestaurantCover(file);
              }}
              className={inputClass}
            />
          </Field>

          {isUploading && (
            <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
              Upload de l’image en cours...
            </div>
          )}

          {uploadError && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {uploadError}
            </div>
          )}

          {menuData.restaurant.coverImageFileName && (
            <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
              <div className="font-medium text-white/90">{menuData.restaurant.coverImageFileName}</div>
              <div className="mt-1 text-xs text-white/45">
                {menuData.restaurant.coverImageMimeType || "Type inconnu"}
                {menuData.restaurant.coverImageSize
                  ? ` • ${formatFileSize(menuData.restaurant.coverImageSize)}`
                  : ""}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Nom du restaurant" icon={<UtensilsCrossed size={14} />}>
              <input
                type="text"
                placeholder="Ex: Le Palmier"
                value={menuData.restaurant.name}
                onChange={(e) => updateRestaurantField("name", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Téléphone" icon={<Phone size={14} />}>
              <input
                type="text"
                placeholder="+33 6 12 34 56 78"
                value={menuData.restaurant.phone}
                onChange={(e) => updateRestaurantField("phone", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

          <Field label="Bio / description" icon={<FileText size={14} />}>
            <textarea
              rows={4}
              placeholder="Cuisine maison, brunch, spécialités..."
              value={menuData.restaurant.bio}
              onChange={(e) => updateRestaurantField("bio", e.target.value)}
              className={textareaClass}
            />
          </Field>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field label="Site web" icon={<Globe size={14} />}>
              <input
                type="text"
                placeholder="https://monresto.com"
                value={menuData.restaurant.website}
                onChange={(e) => updateRestaurantField("website", e.target.value)}
                className={inputClass}
              />
            </Field>

            <Field label="Adresse" icon={<MapPinned size={14} />}>
              <input
                type="text"
                placeholder="10 rue de Paris, Lyon"
                value={menuData.restaurant.address}
                onChange={(e) => updateRestaurantField("address", e.target.value)}
                className={inputClass}
              />
            </Field>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Star size={16} className="text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white/70">
              Plats mis en avant
            </h3>
          </div>

          <button
            type="button"
            onClick={addFeaturedItem}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
          >
            <Plus size={14} />
            Ajouter un plat
          </button>
        </div>

        {menuData.featuredItems.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
            Aucun plat mis en avant pour le moment.
          </div>
        ) : (
          <div className="space-y-4">
            {menuData.featuredItems.map((item, index) => (
              <MenuItemCard
                key={item.id}
                item={item}
                index={index}
                titlePrefix="Plat"
                isUploading={isUploading}
                setIsUploading={setIsUploading}
                setUploadError={setUploadError}
                onChange={(patch) => updateFeaturedItem(item.id, patch)}
                onDelete={() => removeFeaturedItem(item.id)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={16} className="text-cyan-400" />
            <h3 className="text-sm font-black uppercase tracking-[0.12em] text-white/70">
              Sections / blocs
            </h3>
          </div>

          <button
            type="button"
            onClick={addSection}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
          >
            <Plus size={14} />
            Ajouter une section
          </button>
        </div>

        {menuData.sections.length === 0 ? (
          <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
            Aucune section ajoutée pour le moment.
          </div>
        ) : (
          <div className="space-y-5">
            {menuData.sections.map((section, sectionIndex) => (
              <div key={section.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 md:p-5">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div className="w-full">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <Field label={`Titre du bloc ${sectionIndex + 1}`} icon={<Hash size={14} />}>
                        <input
                          type="text"
                          placeholder="Ex: Petit déjeuner"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, { title: e.target.value })}
                          className={inputClass}
                        />
                      </Field>

                      <Field label="Ordre" icon={<Hash size={14} />}>
                        <input
                          type="number"
                          placeholder="0"
                          value={section.order}
                          onChange={(e) =>
                            updateSection(section.id, {
                              order: Number(e.target.value || 0),
                            })
                          }
                          className={inputClass}
                        />
                      </Field>
                    </div>

                    <div className="mt-4">
                      <Field label="Description du bloc" icon={<FileText size={14} />}>
                        <textarea
                          rows={3}
                          placeholder="Ex: Disponible jusqu’à 11h30"
                          value={section.description}
                          onChange={(e) => updateSection(section.id, { description: e.target.value })}
                          className={textareaClass}
                        />
                      </Field>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeSection(section.id)}
                    className="inline-flex h-[46px] shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-red-300 transition hover:bg-red-500/20"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mb-4 flex items-center justify-between">
                  <div className="text-xs font-bold uppercase tracking-[0.1em] text-white/45">
                    Plats du bloc
                  </div>

                  <button
                    type="button"
                    onClick={() => addItemToSection(section.id)}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-xs font-bold text-white transition hover:bg-white/[0.08]"
                  >
                    <Plus size={14} />
                    Ajouter un plat
                  </button>
                </div>

                {section.items.length === 0 ? (
                  <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.03] px-4 py-4 text-sm text-white/45">
                    Aucun plat dans ce bloc.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <MenuItemCard
                        key={item.id}
                        item={item}
                        index={itemIndex}
                        titlePrefix="Plat"
                        isUploading={isUploading}
                        setIsUploading={setIsUploading}
                        setUploadError={setUploadError}
                        onChange={(patch) => updateSectionItem(section.id, item.id, patch)}
                        onDelete={() => removeSectionItem(section.id, item.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MenuItemCard({
  item,
  index,
  titlePrefix,
  onChange,
  onDelete,
  isUploading,
  setIsUploading,
  setUploadError,
}: {
  item: MenuItem;
  index: number;
  titlePrefix: string;
  onChange: (patch: Partial<MenuItem>) => void;
  onDelete: () => void;
  isUploading: boolean;
  setIsUploading: (value: boolean) => void;
  setUploadError: (value: string | null) => void;
}) {
  const uploadItemImage = async (file: File) => {
    setUploadError(null);
    setIsUploading(true);

    try {
      const uploaded = await uploadQrFile(file, "menu");
      onChange({
        imagePath: uploaded.storagePath,
        imageFileName: uploaded.fileName,
        imageMimeType: uploaded.mimeType,
        imageSize: uploaded.size,
      });
    } catch (error: any) {
      console.error("UPLOAD MENU ITEM IMAGE ERROR:", error);
      setUploadError(error?.message || "Erreur lors de l’upload de l’image du plat.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-white/85">
          {titlePrefix} {index + 1}
        </div>

        <button
          type="button"
          onClick={onDelete}
          className="inline-flex h-[42px] items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 px-4 text-red-300 transition hover:bg-red-500/20"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="space-y-4">
        <Field label="Photo du plat (facultatif)" icon={<ImageIcon size={14} />}>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              await uploadItemImage(file);
            }}
            className={inputClass}
          />
        </Field>

        {isUploading && (
          <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm text-cyan-300">
            Upload de l’image en cours...
          </div>
        )}

        {item.imageFileName && (
          <div className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white/70">
            <div className="font-medium text-white/90">{item.imageFileName}</div>
            <div className="mt-1 text-xs text-white/45">
              {item.imageMimeType || "Type inconnu"}
              {item.imageSize ? ` • ${formatFileSize(item.imageSize)}` : ""}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field label="Nom du plat" icon={<UtensilsCrossed size={14} />}>
            <input
              type="text"
              placeholder="Ex: Burger du chef"
              value={item.name}
              onChange={(e) => onChange({ name: e.target.value })}
              className={inputClass}
            />
          </Field>

          <Field label="Prix" icon={<Wallet size={14} />}>
            <input
              type="text"
              placeholder="Ex: 14.90"
              value={item.price}
              onChange={(e) => onChange({ price: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>

        <Field label="Description" icon={<FileText size={14} />}>
          <textarea
            rows={3}
            placeholder="Décrivez le plat..."
            value={item.description}
            onChange={(e) => onChange({ description: e.target.value })}
            className={textareaClass}
          />
        </Field>

        <Field label="Ordre" icon={<Hash size={14} />}>
          <input
            type="number"
            placeholder="0"
            value={item.order}
            onChange={(e) => onChange({ order: Number(e.target.value || 0) })}
            className={inputClass}
          />
        </Field>
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
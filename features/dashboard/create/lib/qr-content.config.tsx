import {
  CalendarDays,
  CreditCard,
  Facebook,
  File,
  FileText,
  Globe,
  Image as ImageIcon,
  Instagram,
  Link as LinkIcon,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Music2,
  Phone,
  Smartphone,
  Star,
  Twitter,
  UserSquare2,
  UtensilsCrossed,
  Video,
  Wifi,
  Youtube,
} from "lucide-react";

export function getTypeMeta(type: string) {
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
    icon: <Globe size={22} />,
    title: "Contenu",
    description: "Configurez votre QR code.",
  };
}

export function getAcceptedTypes(type: string) {
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
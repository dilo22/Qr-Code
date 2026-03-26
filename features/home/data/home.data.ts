import type { ComponentType } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  FileText,
  Wifi,
  Contact,
  Type,
  Mail,
  Zap,
  Layers,
  Cpu,
  Activity,
  Fingerprint,
  MessageSquare,
  Phone,
} from "lucide-react";

import StepTypeAnimation from "@/features/steps/components/StepTypeAnimation";
import StepContentAnimation from "@/features/steps/components/StepContentAnimation";
import StepDesignAnimation from "@/features/steps/components/StepDesignAnimation";
import StepExportAnimation from "@/features/steps/components/StepExportAnimation";
import StepAnalyticsAnimation from "@/features/steps/components/StepAnalyticsAnimation";

export const AUTOPLAY_DURATION = 5000;

export type QrAccent = "cyan" | "fuchsia" | "emerald" | "orange" | "blue" | "pink";

export type QrTypeItem = {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  accent: QrAccent;
};

export type StepItem = {
  id: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  eyebrow: string;
  accent: string;
  glow: string;
  badge: string;
  image: string;
  points: string[];
};

export const qrTypes: QrTypeItem[] = [
  {
    id: "url",
    title: "URL",
    desc: "Lien vers n'importe quelle page web",
    icon: ArrowUpRight,
    accent: "cyan",
  },
  {
    id: "wifi",
    title: "WiFi",
    desc: "Partagez les identifiants réseau",
    icon: Wifi,
    accent: "emerald",
  },
  {
    id: "vcard",
    title: "vCard",
    desc: "Carte de visite numérique",
    icon: Contact,
    accent: "fuchsia",
  },
  {
    id: "mail",
    title: "Email",
    desc: "Compositeur d’email pré-rempli",
    icon: Mail,
    accent: "orange",
  },
  {
  id: "sms",
  title: "SMS",
  desc: "Message texte pré-rempli",
  icon: MessageSquare,
  accent: "emerald",
},
{
  id: "phone",
  title: "N° Téléphone",
  desc: "Numérotation directe",
  icon: Phone,
  accent: "emerald",
},
  {
    id: "text",
    title: "Texte",
    desc: "Tout contenu texte",
    icon: Type,
    accent: "fuchsia",
  },
  {
    id: "pdf",
    title: "PDF",
    desc: "Lien vers documents",
    icon: FileText,
    accent: "pink",
  },
];
export const steps: StepItem[] = [
  {
    id: "01",
    title: "Choisissez votre type",
    desc: "Sélectionnez le format idéal : URL, PDF, WiFi, vCard, email ou réseaux sociaux. Chaque type est optimisé pour un usage précis.",
    icon: Cpu,
    eyebrow: "Initialisation",
    accent: "from-cyan-500/40 via-blue-500/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(6,182,212,0.15)]",
    badge: "20+ formats",
    image: "/screens/step-1.png",
    points: ["URL / PDF / WiFi", "Types intelligents", "Choix instantané"],
  },
  {
    id: "02",
    title: "Ajoutez votre contenu",
    desc: "Collez un lien, importez un PDF ou saisissez votre contenu. Le système détecte automatiquement les erreurs avant génération.",
    icon: Fingerprint,
    eyebrow: "Payload Data",
    accent: "from-emerald-400/40 via-teal-500/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(16,185,129,0.15)]",
    badge: "Validation live",
    image: "/screens/step-2.png",
    points: ["Détection d’URL", "Validation smart", "Aucun QR cassé"],
  },
  {
    id: "03",
    title: "Personnalisez-le",
    desc: "Ajoutez vos couleurs, votre logo et vos formes pour créer un QR aligné avec votre identité de marque.",
    icon: Layers,
    eyebrow: "Gen-Design",
    accent: "from-fuchsia-500/40 via-purple-600/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(217,70,239,0.15)]",
    badge: "Creative Lab",
    image: "/screens/step-3.png",
    points: ["Logo intégré", "Palette de marque", "Style premium"],
  },
  {
    id: "04",
    title: "Téléchargez ou passez en dynamique",
    desc: "Exportez en PNG ou SVG, ou activez le mode dynamique pour modifier la destination plus tard sans réimprimer.",
    icon: Zap,
    eyebrow: "Deployment",
    accent: "from-orange-400/40 via-red-500/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(251,146,60,0.15)]",
    badge: "Dynamic Bridge",
    image: "/screens/step-4.png",
    points: ["PNG / SVG HD", "QR dynamique", "Édition post-print"],
  },
  {
    id: "05",
    title: "Suivez chaque scan",
    desc: "Analysez vos scans en temps réel avec les données de performance, la géolocalisation, les appareils et les tendances.",
    icon: Activity,
    eyebrow: "Analytics",
    accent: "from-indigo-500/40 via-blue-600/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(79,70,229,0.15)]",
    badge: "Live Analytics",
    image: "/screens/step-5.png",
    points: ["Temps réel", "Heat mapping", "Conversion insights"],
  },
];

export const stepComponents: ComponentType[] = [
  StepTypeAnimation,
  StepContentAnimation,
  StepDesignAnimation,
  StepExportAnimation,
  StepAnalyticsAnimation,
];

export const featureStars = Array.from({ length: 50 }, (_, i) => ({
  id: i,
  top: `${(i * 37) % 100}%`,
  left: `${(i * 19) % 100}%`,
  opacity: ((i % 7) + 2) / 10,
}));

export const accentStyles: Record<
  QrAccent,
  {
    from: string;
    to: string;
    border: string;
    hoverShadow: string;
  }
> = {
  cyan: {
    from: "from-cyan-400",
    to: "to-blue-500",
    border: "border-cyan-500/30",
    hoverShadow: "hover:shadow-cyan-500/10",
  },
  fuchsia: {
    from: "from-fuchsia-400",
    to: "to-purple-600",
    border: "border-fuchsia-500/30",
    hoverShadow: "hover:shadow-fuchsia-500/10",
  },
  emerald: {
    from: "from-emerald-400",
    to: "to-teal-500",
    border: "border-emerald-500/30",
    hoverShadow: "hover:shadow-emerald-500/10",
  },
  orange: {
    from: "from-orange-400",
    to: "to-red-500",
    border: "border-orange-500/30",
    hoverShadow: "hover:shadow-orange-500/10",
  },
  blue: {
    from: "from-blue-400",
    to: "to-indigo-600",
    border: "border-blue-500/30",
    hoverShadow: "hover:shadow-blue-500/10",
  },
  pink: {
    from: "from-pink-400",
    to: "to-rose-500",
    border: "border-pink-500/30",
    hoverShadow: "hover:shadow-pink-500/10",
  },
};
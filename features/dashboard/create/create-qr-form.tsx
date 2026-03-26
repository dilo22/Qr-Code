"use client";

import React, { useMemo, useState } from "react";
import StyledQrPreview from "@/features/dashboard/components/styled-qr-preview";
import CreateQrContent from "@/features/dashboard/create/create-qr-content";
import CreateQrDesign from "@/features/dashboard/create/create-qr-design";
import CreateQrExport from "@/features/dashboard/create/create-qr-export";
import type { QrDesignData } from "@/features/dashboard/create/create-qr-design";
import { buildQrValue } from "@/features/dashboard/lib/qr-utils";
import { supabase } from "@/lib/supabase/client";

import {
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
  Layers,
  Palette,
  Share2,
} from "lucide-react";

const QR_TYPES = [
  { id: "url", label: "Lien", icon: <LinkIcon size={16} />, accent: "from-blue-400 to-cyan-400" },
  { id: "wifi", label: "WiFi", icon: <Wifi size={16} />, accent: "from-violet-500 to-purple-500" },
  { id: "text", label: "Texte", icon: <FileText size={16} />, accent: "from-emerald-400 to-teal-500" },
  { id: "vcard", label: "vCard", icon: <UserSquare2 size={16} />, accent: "from-pink-500 to-rose-500" },
  { id: "email", label: "Email", icon: <Mail size={16} />, accent: "from-sky-400 to-blue-500" },
  { id: "sms", label: "SMS", icon: <MessageSquare size={16} />, accent: "from-amber-400 to-orange-500" },
  { id: "phone", label: "Tel", icon: <Phone size={16} />, accent: "from-lime-400 to-green-500" },
  { id: "instagram", label: "Insta", icon: <Instagram size={16} />, accent: "from-fuchsia-500 to-pink-600" },
  { id: "facebook", label: "FB", icon: <Facebook size={16} />, accent: "from-blue-600 to-indigo-700" },
  { id: "tiktok", label: "TikTok", icon: <Video size={16} />, accent: "from-slate-100 to-cyan-300" },
  { id: "linkedin", label: "LinkedIn", icon: <Linkedin size={16} />, accent: "from-blue-500 to-sky-600" },
  { id: "twitter", label: "X", icon: <Twitter size={16} />, accent: "from-slate-300 to-slate-500" },
  { id: "youtube", label: "YouTube", icon: <Youtube size={16} />, accent: "from-red-500 to-rose-600" },
  { id: "pdf", label: "PDF", icon: <File size={16} />, accent: "from-orange-500 to-red-500" },
  { id: "image", label: "Image", icon: <ImageIcon size={16} />, accent: "from-indigo-500 to-purple-600" },
  { id: "audio", label: "Audio", icon: <Music2 size={16} />, accent: "from-teal-400 to-emerald-500" },
  { id: "location", label: "Map", icon: <MapPin size={16} />, accent: "from-yellow-400 to-orange-400" },
  { id: "event", label: "Event", icon: <CalendarDays size={16} />, accent: "from-violet-400 to-indigo-500" },
  { id: "payment", label: "Pay", icon: <CreditCard size={16} />, accent: "from-green-500 to-emerald-600" },
  { id: "app", label: "App", icon: <Smartphone size={16} />, accent: "from-cyan-500 to-blue-400" },
  { id: "menu", label: "Menu", icon: <UtensilsCrossed size={16} />, accent: "from-orange-500 to-rose-500" },
  { id: "review", label: "Avis", icon: <Star size={16} />, accent: "from-yellow-300 to-amber-500" },
] as const;

const STEPS = [
  { id: "type", label: "Type", icon: <Layers size={13} /> },
  { id: "content", label: "Contenu", icon: <FileText size={13} /> },
  { id: "design", label: "Design", icon: <Palette size={13} /> },
  { id: "export", label: "Export", icon: <Share2 size={13} /> },
] as const;

type StepId = (typeof STEPS)[number]["id"];
type QrTypeId = (typeof QR_TYPES)[number]["id"];

type CreateQrFormProps = {
  mode?: "create" | "edit";
  qrId?: string | null;
  initialType?: QrTypeId;
  initialQrData?: Record<string, any>;
  initialQrDesign?: Partial<QrDesignData>;
  initialName?: string;
  onSaved?: (id: string) => void;
};

const STEP_ORDER: StepId[] = ["type", "content", "design", "export"];

function getMainInfo(type: string, data: Record<string, any>) {
  if (!data || Object.keys(data).length === 0) return "En attente de contenu...";

  switch (type) {
    case "url":
      return data.url || "Aucun lien";
    case "wifi":
      return data.ssid ? `Réseau : ${data.ssid}` : "WiFi non renseigné";
    case "vcard":
      return [data.firstName, data.lastName].filter(Boolean).join(" ") || "Contact vide";
    default:
      return data.url || data.text || data.phone || data.email || "Contenu renseigné";
  }
}

function isTrackableType(type: QrTypeId) {
  return [
    "url",
    "instagram",
    "facebook",
    "tiktok",
    "linkedin",
    "twitter",
    "youtube",
    "pdf",
    "image",
    "audio",
    "app",
    "menu",
    "review",
  ].includes(type);
}

function buildTrackingUrl(id: string) {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "");

  return `${appUrl.replace(/\/$/, "")}/s/${id}`;
}

function parseStoredContent(content: unknown): Record<string, any> {
  if (!content) return {};
  if (typeof content === "object") return content as Record<string, any>;

  if (typeof content === "string") {
    try {
      return JSON.parse(content);
    } catch {
      return {};
    }
  }

  return {};
}

export function CreateQrForm({
  mode = "create",
  qrId = null,
  initialType = "url",
  initialQrData = {},
  initialQrDesign = {},
  initialName = "",
  onSaved,
}: CreateQrFormProps) {
  const [selectedType, setSelectedType] = useState<QrTypeId>(initialType);
  const [step, setStep] = useState<StepId>(mode === "edit" ? "content" : "type");
  const [furthestStep, setFurthestStep] = useState<StepId>(mode === "edit" ? "export" : "type");
  const [qrData, setQrData] = useState<Record<string, any>>({
    name: initialName,
    ...parseStoredContent(initialQrData),
  });
  const [qrDesign, setQrDesign] = useState<Partial<QrDesignData>>({
    foreground: "#000000",
    background: "#ffffff",
    dotsStyle: "square",
    cornersStyle: "square",
    ...initialQrDesign,
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [savedQrId, setSavedQrId] = useState<string | null>(qrId);

  const activeType = useMemo(() => {
    return QR_TYPES.find((t) => t.id === selectedType) || QR_TYPES[0];
  }, [selectedType]);

  const qrValue = useMemo(() => {
    if (savedQrId && isTrackableType(selectedType)) {
      return buildTrackingUrl(savedQrId);
    }

    return buildQrValue(selectedType, qrData);
  }, [savedQrId, selectedType, qrData]);

  const isStepAccessible = (targetStep: StepId) => {
    return STEP_ORDER.indexOf(targetStep) <= STEP_ORDER.indexOf(furthestStep);
  };

  const unlockStep = (targetStep: StepId) => {
    if (STEP_ORDER.indexOf(targetStep) > STEP_ORDER.indexOf(furthestStep)) {
      setFurthestStep(targetStep);
    }
  };

  const goToStep = (targetStep: StepId) => {
    if (!isStepAccessible(targetStep)) return;
    setStep(targetStep);
  };

  const saveQrCode = async (
    nextType: QrTypeId,
    nextData: Record<string, any>,
    nextDesign: Partial<QrDesignData>
  ) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Utilisateur non connecté.");

      const rawQrValue = buildQrValue(nextType, nextData);
      const mainLabel = nextData.name || getMainInfo(nextType, nextData);

      let finalId = savedQrId || qrId || null;
      let finalQrValue = rawQrValue;

      if (!finalId) {
        const { data, error } = await supabase
          .from("qr_codes")
          .insert({
            user_id: user.id,
            type: nextType,
            name: mainLabel,
            title: mainLabel,
            content: JSON.stringify(nextData),
            design: nextDesign,
            qr_value: rawQrValue,
            status: "active",
          })
          .select("id")
          .single();

        if (error) throw error;

        finalId = data.id;
        setSavedQrId(finalId);
      }

      if (isTrackableType(nextType)) {
        finalQrValue = buildTrackingUrl(finalId);
      }

      const { error: updateError } = await supabase
        .from("qr_codes")
        .update({
          type: nextType,
          name: mainLabel,
          title: mainLabel,
          content: JSON.stringify(nextData),
          design: nextDesign,
          qr_value: finalQrValue,
          status: "active",
        })
        .eq("id", finalId)
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      if (finalId && onSaved) {
        onSaved(finalId);
      }

      return finalId;
    } catch (error: any) {
      console.error("SAVE QR ERROR:", error);
      setSaveError(error?.message || JSON.stringify(error) || "Erreur lors de la sauvegarde.");
      return null;
    } finally {
      setIsSaving(false);
    }
    
  };
  const handleFinalizeDesign = async (data: QrDesignData) => {
    setQrDesign(data);

    const savedId = await saveQrCode(selectedType, qrData, data);

    if (!savedId) return;

    unlockStep("export");
    setStep("export");
  };

  return (
    <div className="w-full pb-6 pt-2 text-white">
      <header className="sticky top-4 z-30 mb-6">
        <div className="mx-auto w-full max-w-4xl px-2">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
            <nav className="relative flex flex-wrap items-center justify-center gap-2 p-2">
              {STEPS.map((s) => {
                const active = s.id === step;
                const clickable = isStepAccessible(s.id);

                return (
                  <button
                    key={s.id}
                    onClick={() => goToStep(s.id)}
                    disabled={!clickable}
                    className={`group relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold uppercase tracking-wide transition-all ${
                      active
                        ? "bg-white text-black"
                        : clickable
                          ? "text-white/65 hover:bg-white/[0.06]"
                          : "text-white/20"
                    }`}
                  >
                    {s.icon} <span>{s.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0">
          {saveError && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
              {saveError}
            </div>
          )}

          {step === "type" && (
            <div className="animate-in slide-in-from-bottom-2 fade-in duration-300">
              <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                {QR_TYPES.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSelectedType(item.id);
                      setQrData({});
                      setSavedQrId(null);
                      unlockStep("content");
                    }}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                      selectedType === item.id
                        ? "border-white/20 bg-white/10"
                        : "border-white/5 bg-white/[0.02]"
                    }`}
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        selectedType === item.id ? `bg-gradient-to-br ${item.accent}` : "bg-white/5"
                      }`}
                    >
                      {item.icon}
                    </div>
                    <span className="text-[10px] font-bold">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => {
                    unlockStep("content");
                    setStep("content");
                  }}
                  className="rounded-xl bg-white px-6 py-3 text-sm font-bold text-black transition hover:scale-105"
                >
                  Continuer →
                </button>
              </div>
            </div>
          )}

          {step === "content" && (
            <CreateQrContent
              type={selectedType}
              initialData={qrData}
              onLiveChange={setQrData}
              onNext={(data) => {
                setQrData(data);
                unlockStep("design");
                setStep("design");
              }}
              onBack={() => setStep("type")}
            />
          )}

          {step === "design" && (
            <CreateQrDesign
              initialData={qrDesign}
              onBack={() => setStep("content")}
              onLiveChange={setQrDesign}
              onNext={handleFinalizeDesign}
            />
          )}

          {step === "export" && (
            <CreateQrExport
              type={selectedType}
              qrData={qrData}
              qrDesign={qrDesign}
              onBack={() => setStep("design")}
              onCreateAnother={() => {
                setSelectedType("url");
                setStep("type");
                setFurthestStep("type");
                setQrData({});
                setQrDesign({
                  foreground: "#000000",
                  background: "#ffffff",
                  dotsStyle: "square",
                  cornersStyle: "square",
                });
                setSaveError(null);
                setSavedQrId(null);
              }}
            />
          )}

          {isSaving && (
            <p className="mt-4 text-sm text-white/50">Sauvegarde du QR en cours...</p>
          )}
        </div>

        <aside className="flex flex-col items-center rounded-3xl border border-white/10 bg-[#0A0A0A] p-5 shadow-2xl lg:sticky lg:top-24">
          <div className="mb-4 flex w-full items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-white/40">Live Preview</p>
            <div className={`rounded-full bg-gradient-to-r px-2 py-0.5 text-[9px] font-bold ${activeType.accent}`}>
              {selectedType.toUpperCase()}
            </div>
          </div>

          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-white p-2">
            <StyledQrPreview data={qrValue} design={qrDesign as QrDesignData} />
          </div>

          <div className="mt-5" />
        </aside>
      </div>
    </div>
  );
}

export default CreateQrForm;
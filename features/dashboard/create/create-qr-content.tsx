"use client";

import { useState } from "react";
import { ArrowRight, FileText } from "lucide-react";

import Field from "@/features/dashboard/components/Field";
import ContactForm from "@/features/dashboard/components/forms/ContactForm";
import EmailForm from "@/features/dashboard/components/forms/EmailForm";
import EventForm from "@/features/dashboard/components/forms/EventForm";
import FileForm from "@/features/dashboard/components/forms/FileForm";
import LocationForm from "@/features/dashboard/components/forms/LocationForm";
import MenuForm from "@/features/dashboard/components/forms/MenuForm";
import PaymentForm from "@/features/dashboard/components/forms/PaymentForm";
import PhoneForm from "@/features/dashboard/components/forms/PhoneForm";
import SmsForm from "@/features/dashboard/components/forms/SmsForm";
import TextForm from "@/features/dashboard/components/forms/TextForm";
import UrlForm from "@/features/dashboard/components/forms/UrlForm";
import VCardForm from "@/features/dashboard/components/forms/VCardForm";
import WifiForm from "@/features/dashboard/components/forms/WifiForm";

import { getTypeMeta } from "./lib/qr-content.config";
import { normalizeInitialForm } from "./lib/qr-content.helpers";
import { inputClass } from "./lib/qr-content.styles";

import type { CreateQrContentProps } from "./types/qr-content.types";

export default function CreateQRContent({
  type,
  onNext,
  onBack,
  onLiveChange,
  initialData = {},
}: CreateQrContentProps) {
  const [form, setForm] = useState<Record<string, any>>(normalizeInitialForm(initialData));
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFormUpdate = (updated: Record<string, any>) => {
    setForm(updated);
    onLiveChange?.(updated);
  };

  const handleChange = (field: string, value: any) => {
    handleFormUpdate({ ...form, [field]: value });
  };

  const meta = getTypeMeta(type);

  const sharedProps = {
    type,
    form,
    handleChange,
    handleFormUpdate,
    isUploading,
    setIsUploading,
    uploadError,
    setUploadError,
  };

  const renderFields = () => {
    switch (type) {
      case "wifi":
        return <WifiForm {...sharedProps} />;
      case "text":
        return <TextForm {...sharedProps} />;
      case "contact":
        return <ContactForm {...sharedProps} />;
      case "vcard":
        return <VCardForm {...sharedProps} />;
      case "email":
        return <EmailForm {...sharedProps} />;
      case "sms":
        return <SmsForm {...sharedProps} />;
      case "phone":
        return <PhoneForm {...sharedProps} />;
      case "location":
        return <LocationForm {...sharedProps} />;
      case "event":
        return <EventForm {...sharedProps} />;
      case "payment":
        return <PaymentForm {...sharedProps} />;
      case "pdf":
      case "image":
      case "audio":
        return <FileForm {...sharedProps} />;
      case "menu":
        return <MenuForm {...sharedProps} />;
      case "instagram":
      case "facebook":
      case "tiktok":
      case "linkedin":
      case "twitter":
      case "youtube":
      case "app":
      case "review":
      case "url":
      default:
        return <UrlForm {...sharedProps} />;
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
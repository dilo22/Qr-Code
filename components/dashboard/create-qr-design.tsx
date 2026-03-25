"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  Plus,
  Trash2,
} from "lucide-react";

// -------------------- TYPES --------------------

type DotStyle =
  | "square"
  | "dots"
  | "rounded"
  | "extra-rounded"
  | "classy"
  | "classy-rounded";

type CornerStyle =
  | "square"
  | "extra-rounded"
  | "dot"
  | "rounded"
  | "classy"
  | "classy-rounded";

export type QrDesignData = {
  foreground: string;
  background: string;
  useGradient: boolean;
  gradientColor2: string;
  margin: number;
  dotsStyle: DotStyle;
  cornersStyle: CornerStyle;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  logoUrl: string;
  logoSize: number;
};

type CreateQrDesignProps = {
  onNext?: (design: QrDesignData) => void;
  onBack?: () => void;
  initialData?: Partial<QrDesignData>;
  onLiveChange?: (design: QrDesignData) => void;
};

const DEFAULT_DESIGN: QrDesignData = {
  foreground: "#000000",
  background: "#ffffff",
  useGradient: false,
  gradientColor2: "#3b82f6",
  margin: 14,
  dotsStyle: "square",
  cornersStyle: "square",
  errorCorrectionLevel: "M",
  logoUrl: "",
  logoSize: 0.4,
};

// -------------------- PREVIEW ICONS (COULEUR FIXE) --------------------

function DotPreview({ type }: { type: string }) {
  const staticColor = "#666666";

  return (
    <svg width="24" height="24" viewBox="0 0 40 40" aria-hidden="true">
      <g fill={staticColor}>
        {type === "square" && (
          <>
            <rect x="8" y="8" width="10" height="10" />
            <rect x="22" y="8" width="10" height="10" />
            <rect x="8" y="22" width="10" height="10" />
            <rect x="22" y="22" width="10" height="10" />
          </>
        )}
        {type === "dots" && (
          <>
            <circle cx="13" cy="13" r="5" />
            <circle cx="27" cy="13" r="5" />
            <circle cx="13" cy="27" r="5" />
            <circle cx="27" cy="27" r="5" />
          </>
        )}
        {type === "rounded" && (
          <>
            <rect x="8" y="8" width="10" height="10" rx="3" />
            <rect x="22" y="8" width="10" height="10" rx="3" />
            <rect x="8" y="22" width="10" height="10" rx="3" />
            <rect x="22" y="22" width="10" height="10" rx="3" />
          </>
        )}
        {type === "extra-rounded" && (
          <>
            <rect x="8" y="8" width="10" height="10" rx="5" />
            <rect x="22" y="8" width="10" height="10" rx="5" />
            <rect x="8" y="22" width="10" height="10" rx="5" />
            <rect x="22" y="22" width="10" height="10" rx="5" />
          </>
        )}
        {type === "classy" && (
          <>
            <path d="M13 8l5 5-5 5-5-5z" />
            <path d="M27 8l5 5-5 5-5-5z" />
            <path d="M13 22l5 5-5 5-5-5z" />
            <path d="M27 22l5 5-5 5-5-5z" />
          </>
        )}
        {type === "classy-rounded" && (
          <>
            <circle cx="13" cy="13" r="5" />
            <path d="M22 8h10v10H22z" />
            <path d="M8 22h10v10H8z" />
            <circle cx="27" cy="27" r="5" />
          </>
        )}
      </g>
    </svg>
  );
}

// -------------------- MAIN COMPONENT --------------------

export default function CreateQrDesign({
  onNext,
  onBack,
  initialData,
  onLiveChange,
}: CreateQrDesignProps) {
  const [design, setDesign] = useState<QrDesignData>({
    ...DEFAULT_DESIGN,
    ...initialData,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    onLiveChange?.(design);
  }, [design, onLiveChange]);

  const updateField = <K extends keyof QrDesignData>(
    key: K,
    value: QrDesignData[K]
  ) => {
    setDesign((prev) => ({ ...prev, [key]: value }));
  };

  const resetDesign = () => setDesign({ ...DEFAULT_DESIGN });

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDesign((prev) => ({
          ...prev,
          logoUrl: reader.result,
          errorCorrectionLevel: "H",
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setDesign((prev) => ({
      ...prev,
      logoUrl: "",
      errorCorrectionLevel: "M",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="w-full space-y-6 pb-10 animate-in fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* COLONNE GAUCHE : COULEURS & LOGO */}
        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/40">
                <Palette size={16} />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  Couleurs & effets
                </span>
              </div>
              <button
                type="button"
                onClick={() => updateField("useGradient", !design.useGradient)}
                className={`rounded-full px-3 py-1 text-[9px] font-bold transition-all ${
                  design.useGradient
                    ? "bg-blue-500 text-white"
                    : "bg-white/5 text-white/30"
                }`}
              >
                MODE DÉGRADÉ
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <ColorBox
                label="Couleur 1"
                value={design.foreground}
                onChange={(v) => updateField("foreground", v)}
              />
              {design.useGradient && (
                <ColorBox
                  label="Couleur 2"
                  value={design.gradientColor2}
                  onChange={(v) => updateField("gradientColor2", v)}
                />
              )}
              <ColorBox
                label="Arrière-plan"
                value={design.background}
                onChange={(v) => updateField("background", v)}
              />
            </div>
          </section>

          <section className="rounded-[28px] border border-white/5 bg-white/[0.02] p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-2 text-white/40">
              <ImageIcon size={16} />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Logo & branding
              </span>
            </div>

            <div className="flex items-center gap-5">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-white/10 transition-all hover:border-white/20 hover:bg-white/5"
                >
                  {design.logoUrl ? (
                    <img
                      src={design.logoUrl}
                      className="h-full w-full object-contain p-2"
                      alt="Logo"
                    />
                  ) : (
                    <>
                      <Plus size={20} className="text-white/20" />
                      <span className="text-[8px] font-bold text-white/20">
                        AJOUTER
                      </span>
                    </>
                  )}
                </button>

                {design.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-red-400/30 bg-red-500/90 text-white shadow-lg transition-all hover:scale-105 hover:bg-red-400"
                    aria-label="Supprimer le logo"
                    title="Supprimer le logo"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                onChange={handleLogoUpload}
                className="hidden"
                accept="image/*"
              />

              <div className="flex-1 space-y-4">
                <CustomSlider
                  label="Taille du logo"
                  value={Math.round(design.logoSize * 100)}
                  min={10}
                  max={50}
                  unit="%"
                  onChange={(v) => updateField("logoSize", v / 100)}
                />
              </div>
            </div>
          </section>
        </div>

        {/* COLONNE DROITE : STYLE DES MODULES ET COINS */}
        <div className="space-y-6">
          <section className="flex flex-col gap-8 rounded-[28px] border border-white/5 bg-white/[0.02] p-6 shadow-xl">
            <StyleGroup
              label="Style des modules"
              value={design.dotsStyle}
              onChange={(v: DotStyle) => updateField("dotsStyle", v)}
              options={[
                {
                  id: "square",
                  label: "Square",
                  node: <DotPreview type="square" />,
                },
                {
                  id: "dots",
                  label: "Dots",
                  node: <DotPreview type="dots" />,
                },
                {
                  id: "rounded",
                  label: "Rounded",
                  node: <DotPreview type="rounded" />,
                },
                {
                  id: "extra-rounded",
                  label: "Extra rounded",
                  node: <DotPreview type="extra-rounded" />,
                },
                {
                  id: "classy",
                  label: "Classy",
                  node: <DotPreview type="classy" />,
                },
                {
                  id: "classy-rounded",
                  label: "Classy rounded",
                  node: <DotPreview type="classy-rounded" />,
                },
              ]}
            />

            <StyleGroup
              label="Style des coins"
              value={design.cornersStyle}
              onChange={(v: CornerStyle) => updateField("cornersStyle", v)}
              options={[
                {
                  id: "square",
                  label: "Square",
                  node: (
                    <div className="h-5 w-5 rounded-none border-[3px] border-[#666]" />
                  ),
                },
                {
                  id: "rounded",
                  label: "Rounded",
                  node: (
                    <div className="h-5 w-5 rounded-md border-[3px] border-[#666]" />
                  ),
                },
                {
                  id: "extra-rounded",
                  label: "Extra",
                  node: (
                    <div className="h-5 w-5 rounded-xl border-[3px] border-[#666]" />
                  ),
                },
                {
                  id: "classy-rounded",
                  label: "Classy",
                  node: (
                    <div className="h-5 w-5 rounded-bl-lg rounded-tr-lg border-[3px] border-[#666]" />
                  ),
                },
              ]}
            />
          </section>
        </div>
      </div>

      {/* FOOTER NAVIGATION */}
      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-8">
        <button onClick={onBack} className="text-sm font-bold text-white/30 hover:text-white transition-colors">RETOUR</button>
        <div className="flex items-center gap-4">
          <button onClick={resetDesign} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/30 hover:text-white hover:bg-white/10 transition-all"><RotateCcw size={20} /></button>
          <button onClick={() => onNext?.(design)} className="flex h-16 items-center gap-3 rounded-2xl bg-blue-600 px-12 font-black text-white hover:bg-blue-500 transition-all uppercase tracking-tight">Finaliser <ArrowRight size={20} /></button>
        </div>
      </div>
    </div>
  );
}

// -------------------- REUSABLE SUBCOMPONENTS --------------------

function ColorBox({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="min-w-[100px] flex-1 space-y-2">
      <span className="text-[9px] font-black uppercase text-white/20 ml-1">{label}</span>
      <input type="color" value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full cursor-pointer rounded-xl border border-white/10 bg-black/40 p-1 transition-transform active:scale-95" />
    </div>
  );
}

function CustomSlider({ label, value, min, max, unit, onChange }: { label: string; value: number; min: number; max: number; unit: string; onChange: (v: number) => void }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-[11px] font-bold uppercase text-white/40">{label}</span>
        <span className="text-[11px] font-black text-white">{value}{unit}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full h-1 appearance-none bg-white/10 rounded-full accent-blue-500 cursor-pointer" />
    </div>
  );
}

function StyleGroup<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ id: T; label: string; node: React.ReactNode }>; onChange: (v: T) => void }) {
  return (
    <div className="space-y-5">
      <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">{label}</span>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`group flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 transition-all aspect-square ${
              value === opt.id 
                ? "border-blue-500 bg-blue-500/10 text-blue-400" 
                : "border-white/5 bg-white/[0.03] text-white/20 hover:bg-white/[0.07] hover:border-white/10"
            }`}
          >
            <div className={`flex flex-1 items-center justify-center transition-transform duration-300 ${value === opt.id ? "scale-110" : "scale-100 opacity-60 group-hover:opacity-100"}`}>
              {opt.node}
            </div>
            
            {/* Affichage sur deux lignes pour la lisibilité */}
            <span className="w-full text-center text-[8px] leading-[1.1] font-black uppercase tracking-tighter line-clamp-2 min-h-[20px] flex items-center justify-center">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
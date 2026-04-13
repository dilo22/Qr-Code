"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  RotateCcw,
  Palette,
  Image as ImageIcon,
  Plus,
  Trash2,
  AlertTriangle,
  Check,
  Eye,
  Settings2,
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
  gradientRotation: number;
  transparentBackground: boolean;
  backgroundAlpha: number;
  margin: number;
  dotsStyle: DotStyle;
  cornersStyle: CornerStyle;
  errorCorrectionLevel: "L" | "M" | "Q" | "H";
  logoUrl: string | null;
  logoSize: number;
  useCustomEyeColors: boolean;
  eyeOuterColor: string;
  eyeInnerColor: string;
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
  gradientRotation: 45,
  transparentBackground: false,
  backgroundAlpha: 100,
  margin: 20,
  dotsStyle: "square",
  cornersStyle: "square",
  errorCorrectionLevel: "M",
  logoUrl: null,
  logoSize: 0.4,
  useCustomEyeColors: false,
  eyeOuterColor: "#000000",
  eyeInnerColor: "#000000",
};

// -------------------- HELPERS --------------------

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "").trim();
  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function blendWithWhite(hex: string, alpha = 1) {
  const rgb = hexToRgb(hex);
  if (!rgb) return { r: 255, g: 255, b: 255 };
  return {
    r: Math.round(rgb.r * alpha + 255 * (1 - alpha)),
    g: Math.round(rgb.g * alpha + 255 * (1 - alpha)),
    b: Math.round(rgb.b * alpha + 255 * (1 - alpha)),
  };
}

function getLuminance({ r, g, b }: { r: number; g: number; b: number }) {
  const convert = (value: number) => {
    const srgb = value / 255;
    return srgb <= 0.03928 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * convert(r) + 0.7152 * convert(g) + 0.0722 * convert(b);
}

function getContrastRatio(foreground: string, background: string, alpha = 1) {
  const fg = hexToRgb(foreground);
  const bg = blendWithWhite(background, alpha);
  if (!fg) return 21;
  const l1 = getLuminance(fg);
  const l2 = getLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// -------------------- PREVIEW ICONS --------------------

function DotPreview({ type }: { type: string }) {
  const c = "#666666";
  return (
    <svg width="24" height="24" viewBox="0 0 40 40" aria-hidden="true">
      <g fill={c}>
        {type === "square" && (<><rect x="8" y="8" width="10" height="10" /><rect x="22" y="8" width="10" height="10" /><rect x="8" y="22" width="10" height="10" /><rect x="22" y="22" width="10" height="10" /></>)}
        {type === "dots" && (<><circle cx="13" cy="13" r="5" /><circle cx="27" cy="13" r="5" /><circle cx="13" cy="27" r="5" /><circle cx="27" cy="27" r="5" /></>)}
        {type === "rounded" && (<><rect x="8" y="8" width="10" height="10" rx="3" /><rect x="22" y="8" width="10" height="10" rx="3" /><rect x="8" y="22" width="10" height="10" rx="3" /><rect x="22" y="22" width="10" height="10" rx="3" /></>)}
        {type === "extra-rounded" && (<><rect x="8" y="8" width="10" height="10" rx="5" /><rect x="22" y="8" width="10" height="10" rx="5" /><rect x="8" y="22" width="10" height="10" rx="5" /><rect x="22" y="22" width="10" height="10" rx="5" /></>)}
        {type === "classy" && (<><path d="M13 8l5 5-5 5-5-5z" /><path d="M27 8l5 5-5 5-5-5z" /><path d="M13 22l5 5-5 5-5-5z" /><path d="M27 22l5 5-5 5-5-5z" /></>)}
        {type === "classy-rounded" && (<><circle cx="13" cy="13" r="5" /><path d="M22 8h10v10H22z" /><path d="M8 22h10v10H8z" /><circle cx="27" cy="27" r="5" /></>)}
      </g>
    </svg>
  );
}

function EyeColorPreview({
  outerColor,
  innerColor,
  cornersStyle,
}: {
  outerColor: string;
  innerColor: string;
  cornersStyle: string;
}) {
  const radiiMap: Record<string, { outer: number; inner: number; center: number }> = {
    square: { outer: 0, inner: 0, center: 0 },
    rounded: { outer: 7, inner: 4, center: 2 },
    "extra-rounded": { outer: 12, inner: 8, center: 5 },
    dot: { outer: 19, inner: 13, center: 7 },
    classy: { outer: 10, inner: 7, center: 3 },
    "classy-rounded": { outer: 14, inner: 10, center: 5 },
  };

  const radii = radiiMap[cornersStyle] || radiiMap.square;
  const isClassy = cornersStyle === "classy" || cornersStyle === "classy-rounded";

  return (
    <svg width="40" height="40" viewBox="0 0 42 42" aria-hidden="true">
      {isClassy ? (
        <>
          <path
            d="M12 2H30Q40 2 40 12V30Q40 40 30 40H12Q2 40 2 30V12Q2 2 12 2Z"
            fill={outerColor}
          />
          <path
            d="M10 8H26Q34 8 34 16V24Q34 34 24 34H16Q8 34 8 26V10Q8 8 10 8Z"
            fill="#ffffff"
          />
          <path
            d="M17 14H25Q28 14 28 17V25Q28 28 25 28H17Q14 28 14 25V17Q14 14 17 14Z"
            fill={innerColor}
          />
        </>
      ) : (
        <>
          <rect x="2" y="2" width="38" height="38" rx={radii.outer} fill={outerColor} />
          <rect x="8" y="8" width="26" height="26" rx={radii.inner} fill="#ffffff" />
          <rect x="14" y="14" width="14" height="14" rx={radii.center} fill={innerColor} />
        </>
      )}
    </svg>
  );
}

// -------------------- MAIN COMPONENT --------------------

export default function CreateQrDesign({ onNext, onBack, initialData, onLiveChange }: CreateQrDesignProps) {
  const [design, setDesign] = useState<QrDesignData>({ ...DEFAULT_DESIGN, ...initialData });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const backgroundMode = design.transparentBackground ? "transparent" : design.backgroundAlpha < 100 ? "soft" : "solid";
  const backgroundAlpha = design.transparentBackground ? 0 : Math.max(0, Math.min(100, design.backgroundAlpha));
  const gradientContrastRatio = Math.min(
    getContrastRatio(design.foreground, design.background, backgroundAlpha / 100 || 0),
    getContrastRatio(design.gradientColor2, design.background, backgroundAlpha / 100 || 0)
  );
  const solidContrastRatio = getContrastRatio(design.foreground, design.background, backgroundAlpha / 100 || 0);
  const activeContrastRatio = design.useGradient ? gradientContrastRatio : solidContrastRatio;
  const hasLowContrast = activeContrastRatio < 3.2;

  useEffect(() => { onLiveChange?.(design); }, [design, onLiveChange]);

  const updateField = <K extends keyof QrDesignData>(key: K, value: QrDesignData[K]) => {
    setDesign((prev) => ({ ...prev, [key]: value }));
  };

  const resetDesign = () => setDesign({ ...DEFAULT_DESIGN, ...initialData });

  const updateBackgroundMode = (mode: "solid" | "soft" | "transparent") => {
    if (mode === "transparent") {
      setDesign((prev) => ({ ...prev, transparentBackground: true, backgroundAlpha: 0 }));
      return;
    }
    if (mode === "soft") {
      setDesign((prev) => ({ ...prev, transparentBackground: false, backgroundAlpha: prev.backgroundAlpha > 0 && prev.backgroundAlpha < 100 ? prev.backgroundAlpha : 72 }));
      return;
    }
    setDesign((prev) => ({ ...prev, transparentBackground: false, backgroundAlpha: 100 }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setDesign((prev) => ({ ...prev, logoUrl: reader.result as string, errorCorrectionLevel: "H" }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setDesign((prev) => ({ ...prev, logoUrl: null, errorCorrectionLevel: "M" }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="animate-in w-full space-y-6 pb-10 fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] 2xl:gap-7">

        {/* LEFT COLUMN */}
        <div className="space-y-4">

          {/* COULEURS */}
          <Card icon={<Palette size={14} />} label="Couleurs">
            {/* Mode QR */}
            <FieldRow label="QR" right={
              <SegmentedControl
                value={design.useGradient ? "gradient" : "solid"}
                options={[{ id: "solid", label: "Uni" }, { id: "gradient", label: "Dégradé" }]}
                onChange={(v) => updateField("useGradient", v === "gradient")}
              />
            } />

            <div className="grid gap-3 grid-cols-2">
              <ColorPicker
                label={design.useGradient ? "Couleur 1" : "Couleur QR"}
                value={design.foreground}
                onChange={(v) => updateField("foreground", v)}
              />
              {design.useGradient ? (
                <ColorPicker
                  label="Couleur 2"
                  value={design.gradientColor2}
                  onChange={(v) => updateField("gradientColor2", v)}
                />
              ) : (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Aperçu</span>
                  <div className="flex h-[50px] items-center gap-2.5 rounded-xl border border-white/10 bg-black/20 px-3">
                    <span className="h-7 w-7 rounded-lg border border-white/10 shrink-0" style={{ backgroundColor: design.foreground }} />
                    <span className="text-xs font-bold text-white/60 truncate">{design.foreground}</span>
                  </div>
                </div>
              )}
            </div>

            {design.useGradient && (
              <SliderRow
                label="Angle"
                value={design.gradientRotation}
                min={0} max={360} unit="°"
                onChange={(v) => updateField("gradientRotation", v)}
              />
            )}

            <Divider />

            {/* Fond */}
            <FieldRow label="Fond" right={
              <SegmentedControl
                value={backgroundMode}
                options={[{ id: "solid", label: "Plein" }, { id: "soft", label: "Doux" }, { id: "transparent", label: "Transp." }]}
                onChange={(v) => updateBackgroundMode(v as "solid" | "soft" | "transparent")}
              />
            } />

            <div className="grid gap-3 grid-cols-2">
              <ColorPicker
                label="Couleur fond"
                value={design.background}
                onChange={(v) => updateField("background", v)}
              />
              <BackgroundPreview background={design.background} alpha={backgroundAlpha} transparent={design.transparentBackground} />
            </div>

            {!design.transparentBackground && backgroundMode === "soft" && (
              <SliderRow
                label="Opacité"
                value={backgroundAlpha}
                min={15} max={95} unit="%"
                onChange={(v) => updateField("backgroundAlpha", v)}
              />
            )}
          </Card>

          {/* YEUX */}
          <Card icon={<Eye size={14} />} label="Yeux du QR">
            <FieldRow
              label="Couleurs dédiées"
              right={
                <Toggle
                  active={design.useCustomEyeColors}
                  onClick={() => updateField("useCustomEyeColors", !design.useCustomEyeColors)}
                />
              }
            />

            <div className="flex items-center gap-4">
              <div className="flex h-[88px] w-[88px] shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                <EyeColorPreview
                  cornersStyle={design.cornersStyle}
                  outerColor={design.useCustomEyeColors ? design.eyeOuterColor : design.foreground}
                  innerColor={design.useCustomEyeColors ? design.eyeInnerColor : design.foreground}
                />
              </div>
              <div className="min-w-0 flex-1 grid grid-cols-2 gap-3">
                <ColorPicker
                  label="Contour"
                  value={design.useCustomEyeColors ? design.eyeOuterColor : design.foreground}
                  onChange={(v) => { updateField("eyeOuterColor", v); updateField("eyeInnerColor", v); }}
                  disabled={!design.useCustomEyeColors}
                />
                <ColorPicker
                  label="Centre"
                  value={design.useCustomEyeColors ? design.eyeInnerColor : design.foreground}
                  onChange={(v) => updateField("eyeInnerColor", v)}
                  disabled={!design.useCustomEyeColors}
                />
              </div>
            </div>
          </Card>

          {/* Contraste */}
          <ContrastBanner low={hasLowContrast} />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">

          {/* STYLES */}
          <Card icon={<Palette size={14} />} label="Styles">
            <StyleGroup
              label="Modules"
              value={design.dotsStyle}
              onChange={(v: DotStyle) => updateField("dotsStyle", v)}
              options={[
                { id: "square", label: "Carré", node: <DotPreview type="square" /> },
                { id: "dots", label: "Ronds", node: <DotPreview type="dots" /> },
                { id: "rounded", label: "Arrondi", node: <DotPreview type="rounded" /> },
                { id: "extra-rounded", label: "Extra", node: <DotPreview type="extra-rounded" /> },
                { id: "classy", label: "Classy", node: <DotPreview type="classy" /> },
                { id: "classy-rounded", label: "Classy+", node: <DotPreview type="classy-rounded" /> },
              ]}
            />

            <Divider />

            <StyleGroup
              label="Coins"
              value={design.cornersStyle}
              onChange={(v: CornerStyle) => updateField("cornersStyle", v)}
              options={[
                { id: "square", label: "Carré", node: <div className="h-5 w-5 rounded-none border-[3px] border-[#666]" /> },
                { id: "rounded", label: "Arrondi", node: <div className="h-5 w-5 rounded-md border-[3px] border-[#666]" /> },
                { id: "extra-rounded", label: "Extra", node: <div className="h-5 w-5 rounded-xl border-[3px] border-[#666]" /> },
                { id: "classy", label: "Classy", node: <div className="h-5 w-5 rounded-tl-xl rounded-br-xl border-[3px] border-[#666]" /> },
                { id: "classy-rounded", label: "Classy+", node: <div className="h-5 w-5 rounded-bl-lg rounded-tr-lg border-[3px] border-[#666]" /> },
                { id: "dot", label: "Point", node: <div className="flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#666]"><div className="h-1.5 w-1.5 rounded-full bg-[#666]" /></div> },
              ]}
            />
          </Card>

          {/* LOGO */}
          <Card icon={<ImageIcon size={14} />} label="Logo">
            <div className="flex items-center gap-4">
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-20 w-20 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border-2 border-dashed border-white/10 transition-all hover:border-white/20 hover:bg-white/5"
                >
                  {design.logoUrl ? (
                    <img src={design.logoUrl} className="h-full w-full object-contain p-2" alt="Logo" />
                  ) : (
                    <>
                      <Plus size={18} className="text-white/25" />
                      <span className="text-[8px] font-bold text-white/25">LOGO</span>
                    </>
                  )}
                </button>
                {design.logoUrl && (
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-red-400/30 bg-red-500/90 text-white shadow-lg transition-all hover:scale-105 hover:bg-red-400"
                    aria-label="Supprimer le logo"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" onChange={handleLogoUpload} className="hidden" accept="image/*" />
              <div className="min-w-0 flex-1">
                <SliderRow
                  label="Taille"
                  value={Math.round(design.logoSize * 100)}
                  min={10} max={50} unit="%"
                  onChange={(v) => updateField("logoSize", v / 100)}
                />
                <p className="mt-2 text-[11px] leading-4 text-white/35">
                  La correction d'erreur passe en mode max automatiquement.
                </p>
              </div>
            </div>
          </Card>

          {/* RÉGLAGES AVANCÉS */}
          <Card icon={<Settings2 size={14} />} label="Avancé">
            <SliderRow
              label="Marge"
              value={design.margin}
              min={0} max={50} unit="px"
              onChange={(v) => updateField("margin", v)}
            />
            <FieldRow
              label="Correction d'erreur"
              right={
                <select
                  value={design.errorCorrectionLevel}
                  onChange={(e) => updateField("errorCorrectionLevel", e.target.value as QrDesignData["errorCorrectionLevel"])}
                  className="h-9 rounded-xl border border-white/10 bg-black/40 px-3 text-xs font-bold text-white outline-none transition-colors focus:border-blue-500"
                >
                  <option value="L" className="bg-[#0b1220]">L — faible</option>
                  <option value="M" className="bg-[#0b1220]">M — moyen</option>
                  <option value="Q" className="bg-[#0b1220]">Q — élevé</option>
                  <option value="H" className="bg-[#0b1220]">H — max</option>
                </select>
              }
            />
          </Card>
        </div>
      </div>

      {/* FOOTER */}
      <div className="flex items-center justify-between border-t border-white/5 pt-6">
        <button type="button" onClick={onBack} className="text-sm font-bold text-white/30 transition-colors hover:text-white">
          RETOUR
        </button>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetDesign}
            className="rounded-2xl border border-white/10 bg-white/5 p-3.5 text-white/30 transition-all hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={18} />
          </button>
          <button
            type="button"
            onClick={() => onNext?.(design)}
            className="flex h-14 items-center gap-2.5 rounded-2xl bg-blue-600 px-10 font-black uppercase tracking-tight text-white transition-all hover:bg-blue-500"
          >
            Finaliser <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------- SUBCOMPONENTS --------------------

function Card({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[24px] border border-white/5 bg-white/[0.02] p-5 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center gap-2 text-white/35">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      {children}
    </section>
  );
}

function Divider() {
  return <div className="border-t border-white/5" />;
}

function FieldRow({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-bold text-white/40 shrink-0">{label}</span>
      {right}
    </div>
  );
}

function Toggle({ active, onClick }: { active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative h-6 w-11 rounded-full transition-colors ${active ? "bg-cyan-500" : "bg-white/10"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${active ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function SegmentedControl({ value, options, onChange }: {
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex gap-1 rounded-xl border border-white/10 bg-white/[0.03] p-1">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase tracking-wide transition ${value === opt.id ? "bg-white text-black shadow" : "text-white/40 hover:text-white/70"}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ label, value, onChange, disabled = false }: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</span>
      <div className={`flex items-center gap-2.5 rounded-xl border border-white/10 bg-black/20 px-3 h-[50px] ${disabled ? "opacity-40" : ""}`}>
        <input
          type="color"
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`h-8 w-8 shrink-0 rounded-lg border border-white/10 bg-transparent p-0.5 transition-transform active:scale-95 ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
        />
        <span className="text-xs font-bold text-white/60 truncate">{value}</span>
      </div>
    </div>
  );
}

function BackgroundPreview({ background, alpha, transparent }: {
  background: string;
  alpha: number;
  transparent: boolean;
}) {
  return (
    <div className="flex flex-col gap-1 min-w-0">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/30">Aperçu</span>
      <div className="relative h-[50px] overflow-hidden rounded-xl border border-white/10">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#f8fafc",
            backgroundImage: "linear-gradient(45deg,rgba(15,23,42,.08) 25%,transparent 25%),linear-gradient(-45deg,rgba(15,23,42,.08) 25%,transparent 25%),linear-gradient(45deg,transparent 75%,rgba(15,23,42,.08) 75%),linear-gradient(-45deg,transparent 75%,rgba(15,23,42,.08) 75%)",
            backgroundSize: "14px 14px",
            backgroundPosition: "0 0,0 7px,7px -7px,-7px 0",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: transparent ? "transparent" : background,
            opacity: transparent ? 0 : alpha / 100,
          }}
        />
        <div className="absolute inset-x-2 bottom-1.5 rounded-lg border border-white/10 bg-black/50 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-white/70 backdrop-blur text-center">
          {transparent ? "Transparent" : alpha < 100 ? `${alpha}%` : "Plein"}
        </div>
      </div>
    </div>
  );
}

function SliderRow({ label, value, min, max, unit, onChange }: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
        <span className="text-[11px] font-black text-white">{value}{unit}</span>
      </div>
      <input
        type="range" min={min} max={max} value={value} step="1"
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-blue-500"
      />
    </div>
  );
}

function ContrastBanner({ low }: { low: boolean }) {
  return low ? (
    <div className="flex items-center gap-3 rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3">
      <AlertTriangle className="h-4 w-4 shrink-0 text-amber-300" />
      <div>
        <p className="text-sm font-bold text-amber-100">Contraste faible</p>
        <p className="text-xs text-amber-100/70">Cette combinaison peut gêner le scan.</p>
      </div>
    </div>
  ) : (
    <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-500/10 px-4 py-3">
      <Check className="h-4 w-4 shrink-0 text-emerald-300" />
      <div>
        <p className="text-sm font-bold text-emerald-100">Lisibilité correcte</p>
        <p className="text-xs text-emerald-100/70">Le contraste est suffisant pour scanner.</p>
      </div>
    </div>
  );
}

function StyleGroup<T extends string>({ label, value, options, onChange }: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string; node: React.ReactNode }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{label}</span>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`group flex flex-col items-center justify-between gap-1.5 rounded-xl border p-2.5 transition-all ${
              value === opt.id
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-white/5 bg-white/[0.03] text-white/20 hover:border-white/10 hover:bg-white/[0.07]"
            }`}
          >
            <div className={`flex items-center justify-center transition-transform duration-200 ${value === opt.id ? "scale-110" : "opacity-60 group-hover:opacity-100"}`}>
              {opt.node}
            </div>
            <span className="text-[8px] font-black uppercase leading-tight tracking-tighter text-center line-clamp-1 w-full">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

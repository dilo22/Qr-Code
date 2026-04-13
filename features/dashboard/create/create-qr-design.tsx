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

  // ✅ NEW (yeux)
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

  // NEW
  useCustomEyeColors: false,
  eyeOuterColor: "#000000",
  eyeInnerColor: "#000000",
};

// -------------------- PREVIEW ICONS --------------------

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

function EyeColorPreview({
  outerColor,
  innerColor,
}: {
  outerColor: string;
  innerColor: string;
}) {
  return (
    <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
      <rect x="4" y="4" width="34" height="34" rx="7" fill={outerColor} />
      <rect x="10" y="10" width="22" height="22" rx="4" fill="#ffffff" />
      <rect x="15" y="15" width="12" height="12" rx="2" fill={innerColor} />
    </svg>
  );
}

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

  const backgroundMode = design.transparentBackground
    ? "transparent"
    : design.backgroundAlpha < 100
      ? "soft"
      : "solid";
  const backgroundAlpha = design.transparentBackground
    ? 0
    : Math.max(0, Math.min(100, design.backgroundAlpha));
  const gradientContrastRatio = Math.min(
    getContrastRatio(design.foreground, design.background, backgroundAlpha / 100 || 0),
    getContrastRatio(design.gradientColor2, design.background, backgroundAlpha / 100 || 0)
  );
  const solidContrastRatio = getContrastRatio(
    design.foreground,
    design.background,
    backgroundAlpha / 100 || 0
  );
  const activeContrastRatio = design.useGradient ? gradientContrastRatio : solidContrastRatio;
  const hasLowContrast = activeContrastRatio < 3.2;

  useEffect(() => {
    onLiveChange?.(design);
  }, [design, onLiveChange]);

  const updateField = <K extends keyof QrDesignData>(
    key: K,
    value: QrDesignData[K]
  ) => {
    setDesign((prev) => ({ ...prev, [key]: value }));
  };

  const resetDesign = () => setDesign({ ...DEFAULT_DESIGN, ...initialData });

  const updateBackgroundMode = (mode: "solid" | "soft" | "transparent") => {
    if (mode === "transparent") {
      setDesign((prev) => ({
        ...prev,
        transparentBackground: true,
        backgroundAlpha: 0,
      }));
      return;
    }

    if (mode === "soft") {
      setDesign((prev) => ({
        ...prev,
        transparentBackground: false,
        backgroundAlpha: prev.backgroundAlpha > 0 && prev.backgroundAlpha < 100 ? prev.backgroundAlpha : 72,
      }));
      return;
    }

    setDesign((prev) => ({
      ...prev,
      transparentBackground: false,
      backgroundAlpha: 100,
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;

    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;

      if (typeof result === "string") {
        setDesign((prev) => ({
          ...prev,
          logoUrl: result,
          errorCorrectionLevel: "H",
        }));
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setDesign((prev) => ({
      ...prev,
      logoUrl: null,
      errorCorrectionLevel: "M",
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="animate-in w-full space-y-8 pb-10 fade-in zoom-in-95 duration-500">
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] 2xl:gap-7">
        <div className="space-y-6">
          <section className="rounded-[28px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/40">
                <Palette size={16} />
                <span className="text-[11px] font-bold uppercase tracking-widest">
                  Couleurs & effets
                </span>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[9px] font-bold uppercase tracking-[0.18em] text-white/45">
                Edition visuelle
              </span>
            </div>

            <div className="space-y-5">
              <SettingGroup
                title="Couleurs du QR code"
                description="La couleur des modules, le dégradé et sa direction sont regroupés ici."
                badge={design.useGradient ? "Dégradé" : "Uni"}
              >
                <SegmentedControl
                  label="Mode couleur"
                  value={design.useGradient ? "gradient" : "solid"}
                  options={[
                    { id: "solid", label: "Uni" },
                    { id: "gradient", label: "Dégradé" },
                  ]}
                  onChange={(value) => updateField("useGradient", value === "gradient")}
                />

                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorBox
                    label="Couleur principale QR"
                    hint="Teinte dominante des modules."
                    value={design.foreground}
                    onChange={(v) => updateField("foreground", v)}
                  />

                  {design.useGradient ? (
                    <ColorBox
                      label="Couleur secondaire QR"
                      hint="Utilisée comme seconde teinte du dégradé."
                      value={design.gradientColor2}
                      onChange={(v) => updateField("gradientColor2", v)}
                    />
                  ) : (
                    <PreviewTile label="Aperçu QR" value={design.foreground} />
                  )}
                </div>

                {design.useGradient ? (
                  <CustomSlider
                    label="Direction du dégradé"
                    value={design.gradientRotation}
                    min={0}
                    max={360}
                    unit="°"
                    onChange={(v) => updateField("gradientRotation", v)}
                  />
                ) : null}
              </SettingGroup>

              <SettingGroup
                title="Arrière-plan"
                description="Le fond reste indépendant du QR et peut être plein, doux ou transparent."
                badge={
                  backgroundMode === "transparent"
                    ? "Transparent"
                    : backgroundMode === "soft"
                      ? "Semi-transparent"
                      : "Plein"
                }
              >
                <SegmentedControl
                  label="Type de fond"
                  value={backgroundMode}
                  options={[
                    { id: "solid", label: "Plein" },
                    { id: "soft", label: "Doux" },
                    { id: "transparent", label: "Transparent" },
                  ]}
                  onChange={(value) =>
                    updateBackgroundMode(value as "solid" | "soft" | "transparent")
                  }
                />

                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <ColorBox
                    label="Couleur de fond"
                    hint="Visible dans l'aperçu et à l'export si le fond reste actif."
                    value={design.background}
                    onChange={(v) => updateField("background", v)}
                  />

                  <BackgroundPreviewCard
                    background={design.background}
                    alpha={backgroundAlpha}
                    transparent={design.transparentBackground}
                  />
                </div>

                {!design.transparentBackground && backgroundMode === "soft" ? (
                  <CustomSlider
                    label="Opacité du fond"
                    value={backgroundAlpha}
                    min={15}
                    max={95}
                    unit="%"
                    onChange={(v) => updateField("backgroundAlpha", v)}
                  />
                ) : null}
              </SettingGroup>

              <SettingGroup
                title="Yeux du QR code"
                description="Définis une palette dédiée aux repères de lecture si besoin."
                badge={design.useCustomEyeColors ? "Activé" : "Hérité"}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-sm text-white/55">
                    Quand ce mode est désactivé, les yeux reprennent la couleur principale du QR.
                  </p>
                  <ToggleChip
                    active={design.useCustomEyeColors}
                    activeLabel="Couleurs dédiées"
                    inactiveLabel="Couleur du QR"
                    onClick={() => updateField("useCustomEyeColors", !design.useCustomEyeColors)}
                  />
                </div>

                <div className="grid gap-4 lg:grid-cols-[120px_minmax(0,1fr)]">
                  <div className="flex h-[116px] items-center justify-center rounded-2xl border border-white/10 bg-black/20">
                    <EyeColorPreview
                      outerColor={design.useCustomEyeColors ? design.eyeOuterColor : design.foreground}
                      innerColor={design.useCustomEyeColors ? design.eyeInnerColor : design.foreground}
                    />
                  </div>

                  <div className="min-w-0 space-y-4">
                    <ColorBox
                      label="Couleur des yeux"
                      hint="Synchronise contour et centre."
                      value={design.useCustomEyeColors ? design.eyeOuterColor : design.foreground}
                      onChange={(v) => {
                        updateField("eyeOuterColor", v);
                        updateField("eyeInnerColor", v);
                      }}
                      disabled={!design.useCustomEyeColors}
                    />
                    <div className="grid gap-4 md:grid-cols-2">
                      <ColorBox
                        label="Contour œil"
                        value={design.useCustomEyeColors ? design.eyeOuterColor : design.foreground}
                        onChange={(v) => updateField("eyeOuterColor", v)}
                        disabled={!design.useCustomEyeColors}
                      />
                      <ColorBox
                        label="Centre œil"
                        value={design.useCustomEyeColors ? design.eyeInnerColor : design.foreground}
                        onChange={(v) => updateField("eyeInnerColor", v)}
                        disabled={!design.useCustomEyeColors}
                      />
                    </div>
                  </div>
                </div>
              </SettingGroup>

              {hasLowContrast ? (
                <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
                    <div>
                      <p className="font-bold">Contraste faible</p>
                      <p className="mt-1 text-amber-100/80">
                        Le QR risque d'être difficile à scanner avec cette combinaison de couleurs.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-emerald-400/15 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                  <div className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 text-emerald-300" />
                    <div>
                      <p className="font-bold">Lisibilité correcte</p>
                      <p className="mt-1 text-emerald-100/80">
                        Le contraste paraît assez net pour conserver un aperçu confortable.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>

        </div>

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
                  id: "classy",
                  label: "Classy",
                  node: (
                    <div className="h-5 w-5 rounded-tl-xl rounded-br-xl border-[3px] border-[#666]" />
                  ),
                },
                {
                  id: "classy-rounded",
                  label: "Classy rounded",
                  node: (
                    <div className="h-5 w-5 rounded-bl-lg rounded-tr-lg border-[3px] border-[#666]" />
                  ),
                },
                {
                  id: "dot",
                  label: "Dot",
                  node: (
                    <div className="flex h-5 w-5 items-center justify-center rounded-full border-[3px] border-[#666]">
                      <div className="h-1.5 w-1.5 rounded-full bg-[#666]" />
                    </div>
                  ),
                },
              ]}
            />
          </section>

          <section className="rounded-[28px] border border-white/5 bg-white/[0.02] p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-2 text-white/40">
              <ImageIcon size={16} />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Logo & branding
              </span>
            </div>

            <div className="flex flex-col gap-5 xl:flex-row xl:items-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-24 w-24 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-white/10 transition-all hover:border-white/20 hover:bg-white/5"
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

              <div className="min-w-0 flex-1 space-y-4">
                <p className="text-sm leading-6 text-white/45">
                  Ajoute un logo pour signer le QR sans perdre en lisibilité. La correction
                  d'erreur passera automatiquement au niveau maximal.
                </p>
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

          <section className="rounded-[28px] border border-white/5 bg-white/[0.02] p-6 shadow-xl">
            <div className="mb-5 flex items-center gap-2 text-white/40">
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Réglages avancés
              </span>
            </div>

            <div className="space-y-5">
              <CustomSlider
                label="Marge"
                value={design.margin}
                min={0}
                max={50}
                unit="px"
                onChange={(v) => updateField("margin", v)}
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase text-white/40">
                    Correction d’erreur
                  </span>
                  <span className="text-[11px] font-black text-white">
                    {design.errorCorrectionLevel}
                  </span>
                </div>

                <select
                  value={design.errorCorrectionLevel}
                  onChange={(e) =>
                    updateField(
                      "errorCorrectionLevel",
                      e.target.value as QrDesignData["errorCorrectionLevel"]
                    )
                  }
                  className="h-12 w-full rounded-xl border border-white/10 bg-black/40 px-4 text-sm text-white outline-none transition-colors focus:border-blue-500"
                >
                  <option value="L" className="bg-[#0b1220]">
                    L — faible
                  </option>
                  <option value="M" className="bg-[#0b1220]">
                    M — moyen
                  </option>
                  <option value="Q" className="bg-[#0b1220]">
                    Q — élevé
                  </option>
                  <option value="H" className="bg-[#0b1220]">
                    H — max
                  </option>
                </select>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-8">
        <button
          type="button"
          onClick={onBack}
          className="text-sm font-bold text-white/30 transition-colors hover:text-white"
        >
          RETOUR
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={resetDesign}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/30 transition-all hover:bg-white/10 hover:text-white"
          >
            <RotateCcw size={20} />
          </button>

          <button
            type="button"
            onClick={() => onNext?.(design)}
            className="flex h-16 items-center gap-3 rounded-2xl bg-blue-600 px-12 font-black uppercase tracking-tight text-white transition-all hover:bg-blue-500"
          >
            Finaliser <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------- REUSABLE SUBCOMPONENTS --------------------

function SettingGroup({
  title,
  description,
  badge,
  children,
}: {
  title: string;
  description: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[24px] border border-white/6 bg-black/20 p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">{title}</p>
          <p className="max-w-xl text-sm leading-6 text-white/45">{description}</p>
        </div>
        {badge ? (
          <span className="rounded-full border border-white/10 bg-white/[0.05] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
            {badge}
          </span>
        ) : null}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function SegmentedControl({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <span className="ml-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
        {label}
      </span>
      <div className="grid grid-cols-3 gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            className={`min-w-0 rounded-xl px-2.5 py-3 text-[11px] font-black uppercase tracking-[0.1em] transition ${
              value === option.id
                ? "bg-white text-black shadow-[0_8px_20px_rgba(255,255,255,0.12)]"
                : "text-white/45 hover:bg-white/[0.05] hover:text-white/80"
            }`}
          >
            <span className="block truncate">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ToggleChip({
  active,
  activeLabel,
  inactiveLabel,
  onClick,
}: {
  active: boolean;
  activeLabel: string;
  inactiveLabel: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] transition ${
        active
          ? "bg-cyan-500 text-slate-950"
          : "border border-white/10 bg-white/[0.04] text-white/45"
      }`}
    >
      {active ? activeLabel : inactiveLabel}
    </button>
  );
}

function PreviewTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-2">
      <span className="ml-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
        {label}
      </span>
      <div className="flex h-[74px] items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4">
        <span className="h-10 w-10 rounded-2xl border border-white/10" style={{ backgroundColor: value }} />
        <span className="text-sm font-bold text-white/70">{value}</span>
      </div>
    </div>
  );
}

function BackgroundPreviewCard({
  background,
  alpha,
  transparent,
}: {
  background: string;
  alpha: number;
  transparent: boolean;
}) {
  return (
    <div className="space-y-2">
      <span className="ml-1 text-[10px] font-black uppercase tracking-[0.18em] text-white/30">
        Aperçu du fond
      </span>
      <div className="relative h-[74px] overflow-hidden rounded-2xl border border-white/10">
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "#f8fafc",
            backgroundImage:
              "linear-gradient(45deg, rgba(15,23,42,0.08) 25%, transparent 25%), linear-gradient(-45deg, rgba(15,23,42,0.08) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(15,23,42,0.08) 75%), linear-gradient(-45deg, transparent 75%, rgba(15,23,42,0.08) 75%)",
            backgroundSize: "20px 20px",
            backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: transparent ? "transparent" : background,
            opacity: transparent ? 0 : alpha / 100,
          }}
        />
        <div className="absolute inset-x-3 bottom-3 rounded-xl border border-white/10 bg-black/45 px-3 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-white/75 backdrop-blur">
          {transparent ? "Fond transparent" : alpha < 100 ? `Fond ${alpha}%` : "Fond plein"}
        </div>
      </div>
    </div>
  );
}

function ColorBox({
  label,
  value,
  onChange,
  disabled = false,
  hint,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  hint?: string;
}) {
  return (
    <div className="min-w-0 flex-1 space-y-2">
      <span className="ml-1 block text-[10px] font-black uppercase tracking-[0.14em] text-white/30">
        {label}
      </span>
      <div className="min-w-0 rounded-2xl border border-white/10 bg-black/30 p-3">
        <div className="flex min-w-0 items-center gap-3">
          <input
            type="color"
            value={value}
            disabled={disabled}
            onChange={(e) => onChange(e.target.value)}
            className={`h-12 w-14 shrink-0 rounded-xl border border-white/10 bg-black/40 p-1 transition-transform active:scale-95 ${
              disabled ? "cursor-not-allowed opacity-40" : "cursor-pointer"
            }`}
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white/80">{value}</p>
          </div>
        </div>
        {hint ? (
          <p className="mt-2 pl-[68px] text-xs leading-5 text-white/40">
            {hint}
          </p>
        ) : null}
        </div>
    </div>
  );
}

function CustomSlider({
  label,
  value,
  min,
  max,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase text-white/40">
          {label}
        </span>
        <span className="text-[11px] font-black text-white">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-blue-500"
      />
    </div>
  );
}

function StyleGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: Array<{ id: T; label: string; node: React.ReactNode }>;
  onChange: (v: T) => void;
}) {
  return (
    <div className="space-y-5">
      <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
        {label}
      </span>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            className={`group aspect-square flex flex-col items-center justify-between gap-2 rounded-2xl border p-3 transition-all ${
              value === opt.id
                ? "border-blue-500 bg-blue-500/10 text-blue-400"
                : "border-white/5 bg-white/[0.03] text-white/20 hover:border-white/10 hover:bg-white/[0.07]"
            }`}
          >
            <div
              className={`flex flex-1 items-center justify-center transition-transform duration-300 ${
                value === opt.id
                  ? "scale-110"
                  : "scale-100 opacity-60 group-hover:opacity-100"
              }`}
            >
              {opt.node}
            </div>

            <span className="flex min-h-[20px] w-full items-center justify-center text-center text-[8px] font-black uppercase leading-[1.1] tracking-tighter line-clamp-2">
              {opt.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Link2,
  Wifi,
  FileText,
  IdCard,
  Mail,
  MessageSquare,
  File,
  UtensilsCrossed,
  Layers3,
  Clipboard,
  Palette,
  Share2,
} from "lucide-react";

type QrType =
  | "link"
  | "wifi"
  | "text"
  | "vcard"
  | "email"
  | "sms"
  | "pdf"
  | "menu";

type TypeItem = {
  id: QrType;
  label: string;
  icon: React.ReactNode;
};

const TYPE_ITEMS: TypeItem[] = [
  { id: "link", label: "Lien", icon: <Link2 className="h-4 w-4" /> },
  { id: "wifi", label: "WiFi", icon: <Wifi className="h-4 w-4" /> },
  { id: "text", label: "Texte", icon: <FileText className="h-4 w-4" /> },
  { id: "vcard", label: "vCard", icon: <IdCard className="h-4 w-4" /> },
  { id: "email", label: "Email", icon: <Mail className="h-4 w-4" /> },
  { id: "sms", label: "SMS", icon: <MessageSquare className="h-4 w-4" /> },
  { id: "pdf", label: "PDF", icon: <File className="h-4 w-4" /> },
  { id: "menu", label: "Menu", icon: <UtensilsCrossed className="h-4 w-4" /> },
];

const ANIMATION_SEQUENCE: QrType[] = ["link", "vcard", "menu"];

export default function StepTypeAnimation() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<QrType, HTMLDivElement | null>>({
    link: null,
    wifi: null,
    text: null,
    vcard: null,
    email: null,
    sms: null,
    pdf: null,
    menu: null,
  });
  const timeoutsRef = useRef<number[]>([]);

  const [activeType, setActiveType] = useState<QrType>("link");
  const [qrSvg, setQrSvg] = useState("");

  const qrValue = useMemo(() => {
    switch (activeType) {
      case "link":
        return "https://mon-site.com";
      case "wifi":
        return "WIFI:T:WPA;S:MonWifi;P:motdepasse123;;";
      case "text":
        return "Bienvenue sur notre menu digital";
      case "vcard":
        return [
          "BEGIN:VCARD",
          "VERSION:3.0",
          "N:Doe;John;;;",
          "FN:John Doe",
          "ORG:Acme Studio",
          "TITLE:Founder",
          "TEL:+33612345678",
          "EMAIL:john@acme.studio",
          "END:VCARD",
        ].join("\n");
      case "email":
        return "mailto:hello@mon-site.com?subject=Bonjour";
      case "sms":
        return "SMSTO:+33612345678:Bonjour";
      case "pdf":
        return "https://mon-site.com/brochure.pdf";
      case "menu":
        return "https://mon-site.com/menu";
      default:
        return "https://mon-site.com";
    }
  }, [activeType]);

  useEffect(() => {
    const generateQr = async () => {
      try {
        const svg = await QRCode.toString(qrValue, {
          type: "svg",
          errorCorrectionLevel: "M",
          margin: 1,
          width: 188,
          color: {
            dark: "#111111",
            light: "#FFFFFF",
          },
        });
        setQrSvg(svg);
      } catch (error) {
        console.error("QR generation error:", error);
      }
    };

    generateQr();
  }, [qrValue]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  };

  const moveCursorToCard = (type: QrType, scale = 1) => {
    const card = cardRefs.current[type];
    const cursor = cursorRef.current;
    const root = rootRef.current;

    if (!card || !cursor || !root) return;

    const cardRect = card.getBoundingClientRect();
    const rootRect = root.getBoundingClientRect();

    const cursorSize = 20;
    const x = cardRect.left - rootRect.left + cardRect.width / 2 - cursorSize / 2;
    const y = cardRect.top - rootRect.top + cardRect.height / 2 - cursorSize / 2;

    cursor.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  const moveCursor = (x: number, y: number, scale = 1) => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    cursor.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  useEffect(() => {
    const runLoop = () => {
      clearAllTimeouts();

      setActiveType("link");
      moveCursor(620, 430, 1);

      let t = 500;

      ANIMATION_SEQUENCE.forEach((type, index) => {
        schedule(() => moveCursorToCard(type, 1), t);
        schedule(() => moveCursorToCard(type, 0.86), t + 420);
        schedule(() => moveCursorToCard(type, 1), t + 560);
        schedule(() => setActiveType(type), t + 680);

        if (index < ANIMATION_SEQUENCE.length - 1) {
          t += 1700;
        }
      });

      schedule(() => moveCursor(620, 430, 1), t + 1300);
      schedule(runLoop, t + 2600);
    };

    const start = window.setTimeout(runLoop, 200);
    timeoutsRef.current.push(start);

    return () => clearAllTimeouts();
  }, []);

  const activeLabel =
    TYPE_ITEMS.find((item) => item.id === activeType)?.label ?? "Lien";

  const previewBadge =
    activeType === "vcard"
      ? "VCARD"
      : activeType === "wifi"
      ? "WIFI"
      : activeType === "menu"
      ? "MENU"
      : activeType === "pdf"
      ? "PDF"
      : "URL";

  return (
    <div
      ref={rootRef}
      className="relative w-full max-w-[760px] overflow-hidden rounded-[30px] border border-white/10 bg-[#040816] p-5 shadow-[0_28px_90px_rgba(0,0,0,0.44)]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(40,180,255,0.08),transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.06),transparent_28%)]" />

      <div className="relative mx-auto mb-5 flex w-fit items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.03] p-2">
        <TopTab
          label="TYPE"
          active
          icon={<Layers3 className="h-3.5 w-3.5" />}
        />
        <TopTab
          label="CONTENU"
          icon={<Clipboard className="h-3.5 w-3.5" />}
        />
        <TopTab
          label="DESIGN"
          icon={<Palette className="h-3.5 w-3.5" />}
        />
        <TopTab
          label="EXPORT"
          icon={<Share2 className="h-3.5 w-3.5" />}
        />
      </div>

      <div className="relative grid grid-cols-[1fr_280px] gap-4">
        <div className="min-w-0">
          <div className="grid grid-cols-4 gap-3">
            {TYPE_ITEMS.map((item) => (
              <TypeCard
                key={item.id}
                ref={(el) => {
                  cardRefs.current[item.id] = el;
                }}
                icon={item.icon}
                label={item.label}
                active={item.id === activeType}
              />
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <div className="inline-flex h-11 items-center rounded-[16px] bg-white px-6 text-sm font-semibold text-[#111111]">
              Continuer <span className="ml-2">→</span>
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-white/10 bg-black/25 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Live preview
            </div>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                previewBadge === "URL"
                  ? "bg-sky-400 text-black"
                  : previewBadge === "WIFI"
                  ? "bg-emerald-400 text-black"
                  : previewBadge === "MENU"
                  ? "bg-amber-400 text-black"
                  : previewBadge === "PDF"
                  ? "bg-red-400 text-black"
                  : "bg-pink-500 text-white"
              }`}
            >
              {previewBadge}
            </span>
          </div>

          <div className="rounded-[22px] bg-white p-4">
            <div
              className="mx-auto h-[188px] w-[188px]"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>

          <div className="mt-4 rounded-[18px] border border-white/10 bg-white/[0.03] p-3">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/35">
              Type sélectionné
            </div>
            <div className="mt-1 text-sm font-medium text-white/80">
              {activeLabel}
            </div>
          </div>
        </div>
      </div>

      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-50 h-5 w-5 rounded-full bg-white shadow-[0_0_22px_rgba(255,255,255,0.55)] transition-transform duration-500 ease-in-out"
      />
    </div>
  );
}

function TopTab({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex h-9 items-center gap-2 rounded-[12px] px-4 text-sm font-medium transition-all",
        active ? "bg-white text-[#111111]" : "text-white/28",
      ].join(" ")}
    >
      {icon}
      <span>{label}</span>
    </div>
  );
}

const TypeCard = React.forwardRef<
  HTMLDivElement,
  {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
  }
>(function TypeCard({ icon, label, active = false }, ref) {
  return (
    <div
      ref={ref}
      className={[
        "flex h-[84px] flex-col items-center justify-center rounded-[18px] border transition-all",
        active
          ? "border-white/20 bg-white/[0.08] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
          : "border-white/8 bg-[#050b18]",
      ].join(" ")}
    >
      <div
        className={[
          "mb-2 flex h-8 w-8 items-center justify-center rounded-[10px]",
          active ? "bg-sky-400 text-white" : "bg-white/[0.05] text-white/80",
        ].join(" ")}
      >
        {icon}
      </div>

      <div
        className={[
          "text-xs font-semibold",
          active ? "text-white" : "text-white/85",
        ].join(" ")}
      >
        {label}
      </div>
    </div>
  );
});
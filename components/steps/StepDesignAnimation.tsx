"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { Circle, Square, ScanQrCode } from "lucide-react";

type ModuleStyle = "square" | "dots" | "rounded";

export default function QrDesignIllustration() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  const [primaryColor, setPrimaryColor] = useState("#2F6BFF");
  const [backgroundColor] = useState("#FFFFFF");
  const [moduleStyle, setModuleStyle] = useState<ModuleStyle>("rounded");
  const [qrSvg, setQrSvg] = useState("");

  // -----------------------------
  // QR GENERATION
  // -----------------------------
  useEffect(() => {
    const generate = async () => {
      try {
        const svg = await QRCode.toString("https://ton-site.fr", {
          type: "svg",
          errorCorrectionLevel: "M",
          margin: 1,
          width: 220,
          color: {
            dark: primaryColor,
            light: backgroundColor,
          },
        });

        setQrSvg(svg);
      } catch (error) {
        console.error("QR generation error:", error);
      }
    };

    generate();
  }, [primaryColor, backgroundColor]);

  // -----------------------------
  // CURSOR ANIMATION
  // -----------------------------
  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const schedule = (fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timeoutsRef.current.push(id);
  };

  const moveCursor = (x: number, y: number, scale = 1) => {
    const el = cursorRef.current;
    if (!el) return;
    el.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  const click = (x: number, y: number) => {
    moveCursor(x, y, 0.85);
    schedule(() => moveCursor(x, y, 1), 120);
  };

  useEffect(() => {
    const run = () => {
      clearAll();

      // start hors écran
      moveCursor(500, 200);

      // move vers couleur
      schedule(() => moveCursor(120, 190), 400);

      // click
      schedule(() => click(120, 190), 900);

      // bleu → violet
      schedule(() => setPrimaryColor("#7C3AED"), 1200);

      // pause
      schedule(() => {}, 2500);

      // violet → bleu
      schedule(() => setPrimaryColor("#2F6BFF"), 3200);

      // reset
      schedule(() => moveCursor(500, 200), 3800);

      schedule(run, 5000);
    };

    run();
    return () => clearAll();
  }, []);

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="relative w-full max-w-[720px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050816] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(47,107,255,0.12),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.08),transparent_28%)]" />

      <div className="relative grid items-center gap-6 md:grid-cols-[0.9fr_1.1fr]">
        {/* LEFT */}
        <div className="max-w-[300px]">
          <div className="mb-5">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/35">
              QR Design
            </div>
            <h3 className="text-2xl font-semibold leading-tight text-white">
              Personnalise ton code
            </h3>
          </div>

          <div className="rounded-[20px] border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-3 text-sm font-medium text-white/75">
              Couleurs
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-2 text-xs text-white/40">Principale</div>
                <div
                  className="h-9 rounded-[10px] border border-white/10 transition-colors duration-500"
                  style={{ backgroundColor: primaryColor }}
                />
                <div className="mt-2 text-[11px] text-white/50">
                  {primaryColor}
                </div>
              </div>

              <div className="rounded-[16px] border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-2 text-xs text-white/40">Fond</div>
                <div
                  className="h-9 rounded-[10px] border border-white/10"
                  style={{ backgroundColor: backgroundColor }}
                />
                <div className="mt-2 text-[11px] text-white/50">
                  {backgroundColor}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[20px] border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-3 text-sm font-medium text-white/75">
              Forme
            </div>

            <div className="flex gap-2">
              <ShapeButton
                label="Square"
                active={moduleStyle === "square"}
                onClick={() => setModuleStyle("square")}
              >
                <Square className="h-4 w-4" />
              </ShapeButton>

              <ShapeButton
                label="Dots"
                active={moduleStyle === "dots"}
                onClick={() => setModuleStyle("dots")}
              >
                <Circle className="h-4 w-4" />
              </ShapeButton>

              <ShapeButton
                label="Rounded"
                active={moduleStyle === "rounded"}
                onClick={() => setModuleStyle("rounded")}
              >
                <ScanQrCode className="h-4 w-4" />
              </ShapeButton>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex justify-center md:justify-end">
          <div className="rounded-[28px] border border-white/10 bg-[#0A1022] p-4">
            <div
              className="flex items-center justify-center rounded-[24px] p-4"
              style={{ backgroundColor }}
            >
              <div
                className="h-[220px] w-[220px]"
                dangerouslySetInnerHTML={{ __html: qrSvg }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* CURSOR */}
      <div
        ref={cursorRef}
        className="pointer-events-none absolute top-0 left-0 z-50 h-4 w-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-transform duration-500"
      />
    </div>
  );
}

// -----------------------------
// BUTTON
// -----------------------------
function ShapeButton({
  label,
  active,
  children,
  onClick,
}: {
  label: string;
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "flex flex-1 flex-col items-center justify-center gap-2 rounded-[16px] border px-3 py-3 transition-all",
        active
          ? "border-blue-400/40 bg-blue-500/10 text-blue-300"
          : "border-white/10 bg-white/[0.03] text-white/45 hover:bg-white/[0.05] hover:text-white/70",
      ].join(" ")}
    >
      <div
        className={[
          "flex h-8 w-8 items-center justify-center rounded-[10px] border",
          active
            ? "border-blue-300/30 bg-blue-400/10"
            : "border-white/10 bg-white/[0.03]",
        ].join(" ")}
      >
        {children}
      </div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
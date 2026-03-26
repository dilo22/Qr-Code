"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Download,
  ArrowLeft,
  Check,
  Share2,
  Layers3,
  Clipboard,
  Palette,
} from "lucide-react";

type ExportFormat = "png" | "svg" | "jpeg" | "webp";

export default function StepExportAnimation() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>("png");
  const [isDownloading, setIsDownloading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [previewTag, setPreviewTag] = useState("VCARD");
  const [qrSvg, setQrSvg] = useState("");

  const qrValue = useMemo(() => {
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Doe;John;;;",
      "FN:John Doe",
      "ORG:Acme Studio",
      "TITLE:Founder",
      "TEL:+33612345678",
      "EMAIL:john@acme.studio",
      "URL:https://mon-site.com",
      "END:VCARD",
    ].join("\n");
  }, []);

  useEffect(() => {
    const generateQr = async () => {
      try {
        const svg = await QRCode.toString(qrValue, {
          type: "svg",
          errorCorrectionLevel: "M",
          margin: 2,
          width: 184,
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

  const moveCursor = (x: number, y: number, scale = 1) => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    cursor.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };

  const clickCursor = (x: number, y: number) => {
    moveCursor(x, y, 0.88);
    schedule(() => moveCursor(x, y, 1), 120);
  };

  useEffect(() => {
    const runLoop = () => {
      clearAllTimeouts();

      setSelectedFormat("png");
      setIsDownloading(false);
      setShowSuccess(false);
      setPreviewTag("VCARD");
      moveCursor(620, 420, 1);

      schedule(() => moveCursor(100, 205), 500);
      schedule(() => clickCursor(100, 205), 900);
      schedule(() => setSelectedFormat("png"), 1080);

      schedule(() => moveCursor(245, 205), 1900);
      schedule(() => clickCursor(245, 205), 2250);
      schedule(() => setSelectedFormat("svg"), 2430);

      schedule(() => moveCursor(100, 305), 3300);
      schedule(() => clickCursor(100, 305), 3650);
      schedule(() => setSelectedFormat("jpeg"), 3830);

      schedule(() => moveCursor(245, 305), 4700);
      schedule(() => clickCursor(245, 305), 5050);
      schedule(() => setSelectedFormat("webp"), 5230);

      schedule(() => moveCursor(215, 430), 6300);
      schedule(() => clickCursor(215, 430), 6680);
      schedule(() => setIsDownloading(true), 6860);
      schedule(() => setShowSuccess(true), 7100);
      schedule(() => setPreviewTag("DOWNLOADED"), 7200);

      schedule(() => setIsDownloading(false), 8500);
      schedule(() => setShowSuccess(false), 9200);
      schedule(() => setPreviewTag("VCARD"), 9400);
      schedule(() => moveCursor(620, 420, 1), 9800);

      schedule(runLoop, 11600);
    };

    runLoop();

    return () => clearAllTimeouts();
  }, []);

  return (
    <div className="relative w-full max-w-[760px] overflow-hidden rounded-[28px] border border-white/10 bg-[#060810] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.06),transparent_30%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.06),transparent_25%)]" />

      <div className="relative mx-auto mb-5 flex w-fit items-center gap-2 rounded-[18px] border border-white/10 bg-white/[0.03] p-2">
        <TopTab label="TYPE" icon={<Layers3 className="h-3.5 w-3.5" />} />
        <TopTab label="CONTENU" icon={<Clipboard className="h-3.5 w-3.5" />} />
        <TopTab label="DESIGN" icon={<Palette className="h-3.5 w-3.5" />} />
        <TopTab label="EXPORT" active icon={<Share2 className="h-3.5 w-3.5" />} />
      </div>

      <div className="relative grid grid-cols-[1fr_250px] gap-4">
        <div className="min-w-0">
          <div className="mb-4 inline-flex items-center rounded-full border border-emerald-400/10 bg-emerald-500/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-400">
            <Share2 className="mr-2 h-3.5 w-3.5" />
            Export prêt
          </div>

          <h3 className="mb-2 text-3xl font-black tracking-tight text-white">
            Vérifier & télécharger
          </h3>

          <p className="mb-6 max-w-[420px] text-sm text-white/40">
            Choisis un format puis lance l’export. Le QR conserve le même contenu.
          </p>

          <div className="grid max-w-[320px] grid-cols-2 gap-3">
            <ExportCard label="PNG" active={selectedFormat === "png"} pulse={isDownloading && selectedFormat === "png"} />
            <ExportCard label="SVG" active={selectedFormat === "svg"} pulse={isDownloading && selectedFormat === "svg"} />
            <ExportCard label="JPEG" active={selectedFormat === "jpeg"} pulse={isDownloading && selectedFormat === "jpeg"} />
            <ExportCard label="WEBP" active={selectedFormat === "webp"} pulse={isDownloading && selectedFormat === "webp"} />
          </div>

          <button
            className={`mt-5 flex h-12 w-full max-w-[320px] items-center justify-center gap-2 rounded-[16px] border text-sm font-semibold transition-all duration-500 ${
              isDownloading
                ? "border-emerald-400 bg-emerald-500 text-black shadow-[0_0_24px_rgba(16,185,129,0.22)]"
                : "border-white/10 bg-white/[0.03] text-white"
            }`}
          >
            {isDownloading ? (
              <>
                <Check className="h-4 w-4" />
                Export en cours
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                Télécharger
              </>
            )}
          </button>

          <button className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/28">
            <ArrowLeft className="h-4 w-4" />
            Retour à l’édition
          </button>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-black/30 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/30">
              Live preview
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-300 ${
                previewTag === "DOWNLOADED"
                  ? "bg-emerald-500 text-black"
                  : "bg-pink-500 text-white"
              }`}
            >
              {previewTag}
            </span>
          </div>

          <div className="relative rounded-[20px] bg-white p-3 shadow-[0_10px_30px_rgba(255,255,255,0.05)]">
            <div
              className={`absolute inset-0 rounded-[20px] transition-opacity duration-500 ${
                isDownloading ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 rounded-[20px] bg-emerald-500/6" />
              <div className="absolute inset-0 rounded-[20px] bg-[linear-gradient(120deg,transparent_20%,rgba(16,185,129,0.18)_50%,transparent_80%)] animate-[exportSheen_1.2s_linear_infinite]" />
            </div>

            <div
              className="relative mx-auto h-[184px] w-[184px]"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>

          <div className="mt-4 rounded-[16px] border border-white/8 bg-white/[0.03] px-3 py-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-[0.14em] text-white/35">
                Format
              </span>
              <span className="font-bold uppercase text-white">
                {selectedFormat}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        className={`pointer-events-none absolute right-5 top-20 z-40 flex items-center gap-2 rounded-[14px] border px-3 py-2 text-sm font-semibold transition-all duration-500 ${
          showSuccess
            ? "translate-y-0 opacity-100 border-emerald-400/20 bg-emerald-500/12 text-emerald-300"
            : "-translate-y-2 opacity-0 border-transparent bg-transparent text-transparent"
        }`}
      >
        <Check className="h-4 w-4" />
        Téléchargement réussi
      </div>

      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-50 h-5 w-5 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.45)] transition-transform duration-500 ease-in-out"
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

function ExportCard({
  label,
  active,
  pulse,
}: {
  label: string;
  active?: boolean;
  pulse?: boolean;
}) {
  return (
    <div
      className={`flex h-[86px] flex-col items-center justify-center gap-2 rounded-[18px] border transition-all duration-300 ${
        pulse
          ? "scale-[1.02] border-emerald-400 bg-emerald-500/10 text-emerald-400 shadow-[0_0_24px_rgba(16,185,129,0.18)]"
          : active
          ? "border-cyan-400/30 bg-white/[0.05] text-white"
          : "border-white/10 bg-white/[0.02] text-white/80"
      }`}
    >
      <Download className="h-5 w-5" />
      <span className="text-base font-black uppercase">{label}</span>
    </div>
  );
}
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import QRCode from "qrcode";
import {
  Link2,
  Globe,
  User,
  Phone,
  Mail,
  IdCard,
} from "lucide-react";

type Mode = "url" | "vcard";

export default function StepContentIllustration() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<number[]>([]);

  const [mode, setMode] = useState<Mode>("url");
  const [qrSvg, setQrSvg] = useState("");

  const projectName = "Menu restaurant";
  const urlValue = "https://mon-site.com/menu";
  const firstName = "John";
  const lastName = "Doe";
  const phone = "+33 6 12 34 56 78";
  const email = "contact@entreprise.com";

  const qrValue = useMemo(() => {
    if (mode === "url") return urlValue;

    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `N:${lastName};${firstName};;;`,
      `FN:${firstName} ${lastName}`,
      `TEL:${phone}`,
      `EMAIL:${email}`,
      "END:VCARD",
    ].join("\n");
  }, [mode]);

  useEffect(() => {
    const generateQr = async () => {
      try {
        const svg = await QRCode.toString(qrValue, {
          type: "svg",
          errorCorrectionLevel: "M",
          margin: 1,
          width: 220,
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
    moveCursor(x, y, 0.86);
    schedule(() => moveCursor(x, y, 1), 120);
  };

  useEffect(() => {
    const runLoop = () => {
      clearAllTimeouts();

      setMode("url");
      moveCursor(360, 40, 1);

      schedule(() => moveCursor(26, 70), 500);
      schedule(() => clickCursor(26, 70), 950);
      schedule(() => setMode("url"), 1150);

      schedule(() => moveCursor(130, 70), 2700);
      schedule(() => clickCursor(130, 70), 3150);
      schedule(() => setMode("vcard"), 3350);

      schedule(() => moveCursor(360, 40), 5200);

      schedule(runLoop, 6500);
    };

    runLoop();

    return () => clearAllTimeouts();
  }, []);

  return (
    <div className="relative w-full max-w-[760px] overflow-hidden rounded-[28px] border border-white/10 bg-[#050816] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.42)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.08),transparent_28%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(147,51,234,0.08),transparent_28%)]" />

      <div className="relative grid items-start gap-5 md:grid-cols-[1fr_280px]">
        <div className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4">
          <div className="mb-4 flex items-center gap-2">
            <ModePill label="URL" active={mode === "url"} />
            <ModePill label="vCard" active={mode === "vcard"} />
          </div>

          <div className="mb-4">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Contenu
            </div>
            <h3 className="text-xl font-semibold text-white">
              {mode === "url" ? "Lien web" : "Carte de visite"}
            </h3>
          </div>

          <div className="space-y-3">
            <Field
              label="Projet"
              icon={<IdCard className="h-4 w-4" />}
              value={projectName}
            />

            {mode === "url" ? (
              <Field
                label="URL"
                icon={<Globe className="h-4 w-4" />}
                value={urlValue}
              />
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Field
                  label="Prénom"
                  icon={<User className="h-4 w-4" />}
                  value={firstName}
                />
                <Field
                  label="Nom"
                  icon={<IdCard className="h-4 w-4" />}
                  value={lastName}
                />
                <Field
                  label="Téléphone"
                  icon={<Phone className="h-4 w-4" />}
                  value={phone}
                />
                <Field
                  label="Email"
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                />
              </div>
            )}
          </div>
        </div>

        <div className="rounded-[24px] border border-white/10 bg-[#0A1022] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/35">
              Aperçu
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${
                mode === "url"
                  ? "bg-cyan-400 text-black"
                  : "bg-pink-500 text-white"
              }`}
            >
              {mode === "url" ? "URL" : "vCard"}
            </span>
          </div>

          <div className="flex aspect-square items-center justify-center rounded-[20px] bg-white p-4 shadow-[0_10px_30px_rgba(255,255,255,0.06)]">
            <div
              className="h-[220px] w-[220px]"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          </div>
        </div>
      </div>

      <div
        ref={cursorRef}
        className="pointer-events-none absolute left-0 top-0 z-50 h-4 w-4 rounded-full bg-white shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-transform duration-500 ease-in-out"
      />
    </div>
  );
}

function ModePill({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) {
  return (
    <div
      className={[
        "inline-flex h-9 items-center gap-2 rounded-[12px] border px-3 text-sm font-medium transition-all select-none",
        active
          ? "border-cyan-400/30 bg-cyan-400/12 text-cyan-300"
          : "border-white/10 bg-white/[0.03] text-white/50",
      ].join(" ")}
    >
      <Link2 className="h-4 w-4" />
      {label}
    </div>
  );
}

function Field({
  label,
  icon,
  value,
}: {
  label: string;
  icon: React.ReactNode;
  value: string;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center gap-2 text-white/45">
        <span className="text-cyan-300">{icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]">
          {label}
        </span>
      </div>

      <div className="flex h-11 items-center rounded-[14px] border border-white/10 bg-white/[0.03] px-3 text-sm text-white/85">
        <span className="truncate">{value}</span>
      </div>
    </div>
  );
}
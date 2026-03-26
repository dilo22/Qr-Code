"use client";

import { useMemo, useState } from "react";
import {
  Download,
  Sparkles,
  ArrowLeft,
  LayoutDashboard,
  Check,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import QRCodeStyling from "qr-code-styling";
import Link from "next/link";
import type { QrDesignData } from "./create-qr-design";
import { buildQrOptions, buildQrValue, QR_RENDER_SIZE } from "./qr-utils";

type Props = {
  type: string;
  qrData: Record<string, any>;
  qrDesign: Partial<QrDesignData>;
  onBack: () => void;
  onCreateAnother: () => void;
};

type DownloadFormat = "png" | "jpeg" | "webp" | "svg";

export default function CreateQrExport({
  type,
  qrData,
  qrDesign,
  onBack,
  onCreateAnother,
}: Props) {
  const [isDownloading, setIsDownloading] = useState<DownloadFormat | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [downloadedFormat, setDownloadedFormat] =
    useState<DownloadFormat | null>(null);

  const qrValue = useMemo(() => buildQrValue(type, qrData), [type, qrData]);

  const handleDownload = async (extension: DownloadFormat) => {
    setIsDownloading(extension);

    const exportInstance = new QRCodeStyling(
      buildQrOptions(qrValue, qrDesign, QR_RENDER_SIZE)
    );

    try {
      await exportInstance.download({
        name: `qr-pro-${type}`,
        extension,
      });

      setDownloadedFormat(extension);
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erreur téléchargement :", error);
    } finally {
      setIsDownloading(null);
    }
  };

  const handleCreateAnother = () => {
    setShowSuccessModal(false);
    onCreateAnother();
  };

  return (
    <>
      <div className="mx-auto w-full max-w-xl py-10">
        <div className="space-y-8">
          <div className="space-y-3 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
              <Sparkles size={12} />
              Design prêt pour l'export
            </div>

            <h2 className="text-3xl font-black italic tracking-tighter text-white">
              VÉRIFIER & TÉLÉCHARGER
            </h2>

            <p className="text-sm text-white/40">
              Le QR téléchargé reprend exactement la même donnée et le même rendu.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(["png", "svg", "jpeg", "webp"] as DownloadFormat[]).map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => handleDownload(fmt)}
                disabled={!!isDownloading}
                className="group flex flex-col items-center justify-center rounded-[32px] border border-white/5 bg-white/[0.03] p-8 transition-all duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="mb-2 transition-transform group-hover:translate-y-1" />
                <span className="text-xs font-black uppercase">
                  {isDownloading === fmt ? "Téléchargement..." : fmt}
                </span>
              </button>
            ))}
          </div>

          <Link
            href="/dashboard"
            className="flex w-full items-center justify-center gap-3 rounded-[24px] border border-white/10 bg-white/5 py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:border-white/20 hover:bg-white/10"
          >
            <LayoutDashboard size={18} />
            Retour au Dashboard
          </Link>

          <button
            type="button"
            onClick={onBack}
            className="w-full rounded-3xl py-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 transition-all hover:text-white"
          >
            <ArrowLeft size={14} className="mr-2 inline" />
            Retour à l'édition
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSuccessModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-white/10 bg-[#241a45]/95 p-6 shadow-2xl"
            >
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-10 top-10 h-32 w-32 rounded-full bg-fuchsia-500/10 blur-3xl" />
                <div className="absolute -right-10 bottom-10 h-32 w-32 rounded-full bg-cyan-400/10 blur-3xl" />
              </div>

              <button
                type="button"
                onClick={() => setShowSuccessModal(false)}
                className="absolute right-4 top-4 z-10 rounded-full border border-white/10 bg-white/5 p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
              >
                <X size={16} />
              </button>

              <div className="relative z-10 flex flex-col items-center text-center">
                <motion.div
                  initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                  animate={{ scale: 1, rotate: 0, opacity: 1 }}
                  transition={{
                    delay: 0.1,
                    type: "spring",
                    stiffness: 260,
                    damping: 14,
                  }}
                  className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 shadow-lg ring-1 ring-emerald-400/20"
                >
                  <div className="relative">
                    <Sparkles className="text-emerald-400" size={24} />
                    <motion.div
                      className="absolute -right-1 -top-1"
                      animate={{ scale: [1, 1.35, 1], opacity: [0.6, 1, 0.6] }}
                      transition={{ repeat: Infinity, duration: 1.8 }}
                    >
                      <Check size={12} className="text-white" />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.h3
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="text-3xl font-black tracking-tight text-white"
                >
                  QR téléchargé !
                </motion.h3>

                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.22 }}
                  className="mt-3 max-w-sm text-sm leading-6 text-white/60"
                >
                  Votre QR code a bien été exporté au format{" "}
                  <span className="font-black uppercase text-white">
                    {downloadedFormat}
                  </span>
                  . Vous pouvez maintenant l’utiliser ou en créer un autre.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.28 }}
                  className="mt-6 flex w-full gap-3"
                >
                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Fermer
                  </button>

                  <button
                    type="button"
                    onClick={handleCreateAnother}
                    className="flex-1 rounded-2xl bg-white px-4 py-3 text-sm font-black text-black transition hover:scale-[1.02]"
                  >
                    Créer un autre
                  </button>
                </motion.div>
              </div>

              <motion.div
                className="pointer-events-none absolute left-8 top-8 h-2 w-2 rounded-full bg-emerald-400"
                animate={{ y: [0, -10, 0], opacity: [0.3, 1, 0.3] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
              <motion.div
                className="pointer-events-none absolute bottom-10 right-10 h-2 w-2 rounded-full bg-cyan-400"
                animate={{ y: [0, -14, 0], opacity: [0.2, 1, 0.2] }}
                transition={{ repeat: Infinity, duration: 2.4, delay: 0.4 }}
              />
              <motion.div
                className="pointer-events-none absolute right-20 top-20 h-1.5 w-1.5 rounded-full bg-fuchsia-400"
                animate={{ y: [0, -8, 0], opacity: [0.2, 0.9, 0.2] }}
                transition={{ repeat: Infinity, duration: 1.9, delay: 0.2 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
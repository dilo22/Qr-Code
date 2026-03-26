"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type {
  QRCodeItem,
  QRScanItem,
} from "@/features/dashboard/types/qr-details.types";

export function useQrDetails(qrId: string) {
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [qr, setQr] = useState<QRCodeItem | null>(null);
  const [scans, setScans] = useState<QRScanItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadQrDetails() {
    if (!qrId) {
      setError("ID du QR code manquant.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("user:", user);
      console.log("qrId:", qrId);

      if (!user) {
        setError("Utilisateur non connecté.");
        setLoading(false);
        return;
      }

      const { data: qrDataById, error: qrByIdError } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("id", qrId)
        .maybeSingle();

      console.log("qrDataById:", qrDataById);
      console.log("qrByIdError:", qrByIdError);

      if (qrByIdError) throw qrByIdError;

      if (!qrDataById) {
        throw new Error("QR introuvable.");
      }

      if (qrDataById.user_id !== user.id) {
        throw new Error("Accès refusé à ce QR code.");
      }

      const { data: scansData, error: scansError } = await supabase
        .from("qr_scans")
        .select("id, qr_code_id, scanned_at, country, city, device, visitor_key")
        .eq("qr_code_id", qrId)
        .order("scanned_at", { ascending: false });

      console.log("scansData:", scansData);
      console.log("scansError:", scansError);

      if (scansError) throw scansError;

      setQr(qrDataById);
      setScans((scansData || []) as QRScanItem[]);
    } catch (err: any) {
      console.error("DETAIL ERROR:", err);
      setError(err?.message || "Impossible de charger ce QR code.");
    } finally {
      setLoading(false);
    }
  }
    
    loadQrDetails();
  }, [qrId]);

  const deleteQr = useCallback(async () => {
    if (!qr) return false;

    try {
      setIsDeleting(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("Utilisateur non connecté.");

      const { error: scansDeleteError } = await supabase
        .from("qr_scans")
        .delete()
        .eq("qr_code_id", qr.id);

      if (scansDeleteError) throw scansDeleteError;

      const { data: deletedQr, error: qrDeleteError } = await supabase
        .from("qr_codes")
        .delete()
        .eq("id", qr.id)
        .eq("user_id", user.id)
        .select("id");

      if (qrDeleteError) throw qrDeleteError;

      if (!deletedQr || deletedQr.length === 0) {
        throw new Error(
          "Suppression refusée ou impossible. Vérifie les policies DELETE dans Supabase."
        );
      }

      return true;
    } catch (err: any) {
      setError(err?.message || "Impossible de supprimer ce QR code.");
      return false;
    } finally {
      setIsDeleting(false);
    }
  }, [qr]);

  return {
    qr,
    scans,
    loading,
    error,
    isDeleting,
    deleteQr,
  };
}
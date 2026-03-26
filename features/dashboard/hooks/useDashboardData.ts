"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { QRCodeItem, QRScanItem } from "@/features/dashboard/types/dashboard.types";

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<QRCodeItem[]>([]);
  const [scans, setScans] = useState<QRScanItem[]>([]);
  const [profileName, setProfileName] = useState("Utilisateur");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const resetDashboardState = useCallback(() => {
    setProjects([]);
    setScans([]);
    setProfileName("Utilisateur");
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error("Erreur récupération user :", userError.message);
        resetDashboardState();
        return;
      }

      if (!user) {
        resetDashboardState();
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Erreur profil :", profileError.message);
      }

      const { data: qrCodes, error: qrCodesError } = await supabase
        .from("qr_codes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (qrCodesError) {
        throw qrCodesError;
      }

      const safeQrCodes = (qrCodes || []) as QRCodeItem[];
      setProjects(safeQrCodes);

      if (profile?.full_name) {
        setProfileName(profile.full_name);
      } else {
        setProfileName("Utilisateur");
      }

      if (safeQrCodes.length === 0) {
        setScans([]);
        return;
      }

      const qrIds = safeQrCodes.map((q) => q.id);

      const { data: qrScans, error: qrScansError } = await supabase
        .from("qr_scans")
        .select("qr_code_id, scanned_at")
        .in("qr_code_id", qrIds)
        .order("scanned_at", { ascending: false });

      if (qrScansError) {
        throw qrScansError;
      }

      setScans((qrScans || []) as QRScanItem[]);
    } catch (error) {
      console.error("Erreur dashboard :", error);
      resetDashboardState();
    } finally {
      setLoading(false);
    }
  }, [resetDashboardState]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const deleteProject = useCallback(
    async (projectId: string, projectName: string) => {
      const confirmed = window.confirm(
        `Supprimer définitivement "${projectName}" ? Cette action est irréversible.`
      );

      if (!confirmed) return false;

      try {
        setDeletingId(projectId);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) {
          throw userError;
        }

        if (!user) {
          throw new Error("Utilisateur non connecté.");
        }

        const { error } = await supabase
          .from("qr_codes")
          .delete()
          .eq("id", projectId)
          .eq("user_id", user.id);

        if (error) throw error;

        setProjects((prev) =>
          prev.filter((project) => project.id !== projectId)
        );
        setScans((prev) => prev.filter((scan) => scan.qr_code_id !== projectId));

        return true;
      } catch (error) {
        console.error("Erreur suppression QR code :", error);
        window.alert("Impossible de supprimer ce QR code.");
        return false;
      } finally {
        setDeletingId(null);
      }
    },
    []
  );

  return {
    loading,
    projects,
    scans,
    profileName,
    deletingId,
    setProjects,
    setScans,
    loadData,
    deleteProject,
  };
}
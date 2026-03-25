"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { CreateQrForm } from "@/components/dashboard/create-qr-form";

export default function EditQrPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [qr, setQr] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadQr = async () => {
      if (!id) {
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

        if (!user) {
          setError("Utilisateur non connecté.");
          return;
        }

        const { data, error } = await supabase
          .from("qr_codes")
          .select("*")
          .eq("id", id)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        setQr(data);
      } catch (err: any) {
        setError(err?.message || "Impossible de charger ce QR code.");
      } finally {
        setLoading(false);
      }
    };

    loadQr();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-white/60">Chargement...</div>;
  }

  if (error || !qr) {
    return <div className="p-8 text-red-300">{error || "QR introuvable."}</div>;
  }

  return (
    <CreateQrForm
      mode="edit"
      qrId={qr.id}
      initialType={qr.type}
      initialQrData={qr.content || {}}
      initialQrDesign={qr.design || {}}
      initialName={qr.name || ""}
      onSaved={(savedId) => router.push(`/dashboard/qr/${savedId}`)}
    />
  );
}
"use client";

import { useEffect, useState } from "react";
import { User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Profile = {
  id?: string;
  full_name: string | null;
  email: string | null;
};

export function SettingsForm() {
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    email: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setMessage(null);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError) throw userError;
        if (!user) throw new Error("Utilisateur non connecté.");

        const { data, error } = await supabase
          .from("profiles")
          .select("id, full_name, email")
          .eq("id", user.id)
          .maybeSingle();

        if (error) throw error;

        setProfile({
          id: user.id,
          full_name: data?.full_name || user.user_metadata?.full_name || "",
          email: data?.email || user.email || "",
        });
      } catch (error) {
        console.error("Erreur chargement profil :", error);
        setMessage(error instanceof Error ? error.message : "Erreur de chargement.");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Utilisateur non connecté.");

      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: profile.full_name?.trim() || "",
        email: user.email || "",
      });

      if (error) throw error;

      setMessage("Profil enregistré.");
    } catch (error) {
      console.error(error);
      setMessage(error instanceof Error ? error.message : "Erreur inconnue.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <div className="mb-12">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">
          Paramètres
        </h2>
        <p className="text-white/40 text-sm italic">Gérez votre profil.</p>
      </div>

      <div className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/10">
        <h3 className="text-xs font-black uppercase tracking-widest text-cyan-400 mb-6 italic">
          Profil Utilisateur
        </h3>

        <div className="flex items-center gap-6 mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 p-1">
            <div className="w-full h-full rounded-[1.4rem] bg-[#02040a] flex items-center justify-center">
              <User className="w-10 h-10 text-white/20" />
            </div>
          </div>

          <div>
            <h4 className="font-black italic uppercase">
              {loading ? "Chargement..." : profile.full_name || "Utilisateur"}
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/20">
              Nom complet
            </label>
            <input
              type="text"
              value={profile.full_name || ""}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, full_name: e.target.value }))
              }
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/20">
              Email
            </label>
            <input
              type="email"
              value={profile.email || ""}
              disabled
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs font-bold outline-none opacity-70 cursor-not-allowed"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving || loading}
          className="mt-6 px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Sauvegarder"}
        </button>

        {message && <p className="mt-4 text-sm text-white/70">{message}</p>}
      </div>
    </div>
  );
}
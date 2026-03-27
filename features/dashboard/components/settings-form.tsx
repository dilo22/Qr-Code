"use client";

import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type Profile = {
  id?: string;
  full_name: string | null;
  email: string | null;
  avatar_url: string | null;
};

export function SettingsForm() {
  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    email: "",
    avatar_url: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

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
          .select("id, full_name, email, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Erreur Supabase profiles :", error);
          throw new Error(error.message || "Impossible de charger le profil.");
        }

        setProfile({
          id: user.id,
          full_name: data?.full_name || user.user_metadata?.full_name || "",
          email: data?.email || user.email || "",
          avatar_url: data?.avatar_url || user.user_metadata?.avatar_url || "",
        });
      } catch (error: any) {
        console.error(
          "Erreur chargement profil :",
          error,
          JSON.stringify(error, null, 2)
        );
        setMessage(
          error?.message || error?.error_description || "Erreur de chargement."
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleAvatarClick = () => {
    if (!loading && !uploading) {
      fileInputRef.current?.click();
    }
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      setMessage(null);

      const file = e.target.files?.[0];
      if (!file) return;

      const validTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!validTypes.includes(file.type)) {
        throw new Error("Format invalide. Utilisez JPG, PNG ou WEBP.");
      }

      if (file.size > 2 * 1024 * 1024) {
        throw new Error("L'image ne doit pas dépasser 2 Mo.");
      }

      setUploading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) throw userError;
      if (!user) throw new Error("Utilisateur non connecté.");

      const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) {
        console.error("Erreur upload storage :", uploadError);
        throw new Error(uploadError.message || "Erreur lors de l'envoi de l'image.");
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = publicUrlData.publicUrl;

      setProfile((prev) => ({
        ...prev,
        avatar_url: `${avatarUrl}?t=${Date.now()}`,
      }));

      setMessage("Photo mise à jour. N'oubliez pas de sauvegarder.");
    } catch (error: any) {
      console.error(
        "Erreur upload avatar :",
        error,
        JSON.stringify(error, null, 2)
      );
      setMessage(
        error?.message || error?.error_description || "Erreur lors de l'upload."
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

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
        avatar_url: profile.avatar_url || "",
      });

      if (error) {
        console.error("Erreur sauvegarde Supabase :", error);
        throw new Error(error.message || "Impossible d'enregistrer le profil.");
      }

      setMessage("Profil enregistré.");
    } catch (error: any) {
      console.error(
        "Erreur sauvegarde profil :",
        error,
        JSON.stringify(error, null, 2)
      );
      setMessage(
        error?.message || error?.error_description || "Erreur inconnue."
      );
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
          <div className="relative group">
            <button
              type="button"
              onClick={handleAvatarClick}
              disabled={loading || uploading}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-cyan-400 to-fuchsia-500 p-1 disabled:opacity-60"
            >
              <div className="w-full h-full rounded-[1.4rem] bg-[#02040a] flex items-center justify-center overflow-hidden relative">
                {profile.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Photo de profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-white/20" />
                )}

                <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          <div>
            <h4 className="font-black italic uppercase">
              {loading ? "Chargement..." : profile.full_name || "Utilisateur"}
            </h4>
            <p className="text-xs text-white/50 mt-1">
              {uploading ? "Téléversement..." : "Cliquez sur l’avatar pour modifier"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-white/40">
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
            <label className="text-[10px] font-black uppercase text-white/40">
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
          disabled={saving || loading || uploading}
          className="mt-6 px-6 py-3 bg-white text-black rounded-2xl font-black text-xs uppercase disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Sauvegarder"}
        </button>

        {message && <p className="mt-4 text-sm text-white/70">{message}</p>}
      </div>
    </div>
  );
}
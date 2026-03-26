"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  QrCode,
  Mail,
  Lock,
  User,
  ArrowRight,
  Chrome,
  ShieldCheck,
  Zap,
  ChevronLeft,
} from "lucide-react";
import { supabase } from "@/lib/supabase/client";

type AuthMode = "login" | "register";

export default function AuthPage() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  useEffect(() => {
    const clearBrokenSession = async () => {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        console.error(error);
        await supabase.auth.signOut();
        return;
      }

      if (!session) {
        return;
      }
    };

    clearBrokenSession();
  }, []);
  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const handleBack = () => {
    router.push("/");
  };

  const handleGoogleAuth = async () => {
    setError(null);
    setSuccess(null);
    setIsGoogleLoading(true);

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
        },
      });

      if (error) throw error;
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Connexion Google impossible."
      );
      setIsGoogleLoading(false);
    }
  };

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsLoading(true);

    try {
      if (!email || !password) {
        throw new Error("Veuillez remplir tous les champs.");
      }

      if (mode === "register" && !fullName.trim()) {
        throw new Error("Veuillez entrer votre nom complet.");
      }

      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName.trim(),
            },
          },
        });

        if (error) {
          throw new Error(error.message);
        }

        setSuccess(
          "Compte créé avec succès. Vérifiez votre email puis connectez-vous."
        );
        setMode("login");
        setPassword("");
        return;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw new Error("Email ou mot de passe incorrect.");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue.");
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
    setError(null);
    setSuccess(null);
    setPassword("");
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans flex items-center justify-center p-6 overflow-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-fuchsia-600/10 blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePos.x / 15 - 300}px, ${
              mousePos.y / 15 - 300
            }px)`,
          }}
        />
        <div
          className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${-mousePos.x / 20}px, ${
              -mousePos.y / 20
            }px)`,
          }}
        />
      </div>

      <main className="relative z-10 w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-white/[0.05] to-transparent border-r border-white/10">
          <div>
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-lg flex items-center justify-center rotate-12">
                <QrCode className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tighter uppercase">
                My<span className="text-cyan-400">QR</span>
              </span>
            </div>

            <h2 className="text-5xl font-black leading-tight mb-6">
              L'accès à la <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                Matrice QR
              </span>
            </h2>

            <p className="text-white/50 text-lg max-w-sm">
              Connectez-vous pour gérer vos points d'accès dynamiques et analyser
              vos flux de données en temps réel.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-cyan-500/20 transition-colors">
                <ShieldCheck className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Sécurité Photonique</p>
                <p className="text-xs text-white/40">
                  Chiffrement de bout en bout sur chaque scan.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-fuchsia-500/20 transition-colors">
                <Zap className="w-6 h-6 text-fuchsia-400" />
              </div>
              <div>
                <p className="font-bold text-sm text-white">Performance Warp</p>
                <p className="text-xs text-white/40">
                  Génération et redirection en moins de 30ms.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-8 md:p-16 flex flex-col justify-center relative">
          <button
            type="button"
            onClick={handleBack}
            className="absolute top-8 left-8 text-white/40 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> Retour
          </button>

          <div className="mb-10 text-center lg:text-left mt-10 lg:mt-0">
            <h3 className="text-3xl font-black mb-2 italic">
              {mode === "login" ? "BON RETOUR" : "CRÉER UN PROFIL"}
            </h3>
            <p className="text-white/40 text-sm">
              {mode === "login"
                ? "Ravis de vous revoir dans MyQR."
                : "Commencez votre voyage numérique aujourd'hui."}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={isGoogleLoading}
              className="flex items-center justify-center gap-3 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all font-bold text-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <Chrome className="w-4 h-4" />
              )}
              Continuer avec Google
            </button>
          </div>

          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <span className="relative z-10 px-4 bg-[#02040a] lg:bg-transparent text-[10px] uppercase font-black tracking-[0.2em] text-white/20 italic">
              Ou via email
            </span>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">
                  Nom Complet
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                    required={mode === "register"}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  placeholder="name@myqr.ai"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-white/40 ml-1">
                Mot de passe
              </label>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 outline-none focus:border-cyan-500/50 focus:bg-white/[0.08] transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {error}
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-black font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-[0_10px_30px_rgba(34,211,238,0.2)] disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "S'IDENTIFIER" : "CRÉER LE COMPTE"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-white/40">
            {mode === "login" ? "Nouveau ici ?" : "Déjà membre ?"}
            <button
              type="button"
              onClick={switchMode}
              className="ml-2 font-black text-white hover:text-cyan-400 transition-colors underline decoration-cyan-500/30 underline-offset-4"
            >
              {mode === "login" ? "Rejoindre MyQR" : "Se connecter"}
            </button>
          </p>
        </div>
      </main>

      <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-cyan-500 opacity-20" />
    </div>
  );
}
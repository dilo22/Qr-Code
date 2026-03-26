"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

type AutoLogoutProps = {
  timeoutMs?: number; // durée d'inactivité (ms)
};

export function AutoLogout({ timeoutMs = 15 * 60 * 1000 }: AutoLogoutProps) {
  const router = useRouter();
  const { user, loading } = useAuthUser();

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // ⚠️ Ne rien faire tant qu'on ne sait pas si l'utilisateur est connecté
    if (loading || !user) return;

    const resetTimer = () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      timerRef.current = window.setTimeout(async () => {
        try {
          await supabase.auth.signOut();
        } catch (err) {
          console.error("AutoLogout error:", err);
        } finally {
          router.replace("/auth");
        }
      }, timeoutMs);
    };

    // événements qui reset l'activité
    const events: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, resetTimer, { passive: true });
    });

    // démarrage initial
    resetTimer();

    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
      }

      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
      });
    };
  }, [user, loading, router, timeoutMs]);

  return null;
}
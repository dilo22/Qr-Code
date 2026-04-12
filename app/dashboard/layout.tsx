"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Sidebar } from "@/features/dashboard/components//sidebar";
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";
import { AutoLogout } from "@/features/auth/components/AutoLogout";

export default function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { user, loading } = useAuthUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  const handleLogout = async () => {
    try {
      setIsSigningOut(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    } finally {
      setIsSigningOut(false);
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute w-[800px] h-[800px] rounded-full bg-cyan-500/5 blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay" />
      </div>

      <AutoLogout timeoutMs={15 * 60 * 1000} />
      <Sidebar
        pathname={pathname}
        isSigningOut={isSigningOut}
        onLogout={handleLogout}
      />

      <div className="pl-16 sm:pl-24 transition-all duration-500">
        <main className="relative z-10 p-4 sm:p-8 md:p-10 lg:p-16 max-w-7xl mx-auto">
          {children}
        </main>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes fade-in { 
              from { opacity: 0; transform: translateY(20px); } 
              to { opacity: 1; transform: translateY(0); } 
            }
            .animate-fade-in { animation: fade-in 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
            ::-webkit-scrollbar { width: 4px; }
            ::-webkit-scrollbar-track { background: transparent; }
            ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
          `,
        }}
      />
    </div>
  );
}
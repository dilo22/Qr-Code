"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { DashboardView } from "@/features/dashboard/components/DashboardView"; //dashboard-view
import { useAuthUser } from "@/features/auth/hooks/useAuthUser";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuthUser();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02040a] text-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <DashboardView />;
}
"use client";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  QrCode,
  ArrowUpRight,
  FileText,
  Wifi,
  Contact,
  Type,
  Mail,
  Zap,
  BarChart3,
  Palette,
  Download,
  ChevronRight,
  Globe,
} from "lucide-react";

// --- Composants de base ---

const GlassCard = ({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) => (
  <div
    onClick={onClick}
    className={`relative group transition-all duration-500 hover:scale-[1.02] cursor-pointer ${className}`}
  >
    <div className="absolute -inset-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/5 rounded-[2rem] z-0" />
    <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl rounded-[2rem] z-0" />
    <div className="relative z-10 p-8 h-full">{children}</div>
  </div>
);

const NavLink = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => (
  <button
    onClick={onClick}
    className="relative text-sm font-medium text-white/60 hover:text-white transition-colors group py-2"
  >
    {children}
    <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-cyan-400 to-fuchsia-500 transition-all duration-300 group-hover:w-full" />
  </button>
);

// --- Données ---

const qrTypes = [
  {
    title: "Smart URL",
    desc: "Landing pages et produits connectés.",
    icon: <ArrowUpRight className="w-6 h-6" />,
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Dynamic PDF",
    desc: "Menus, brochures et catalogues interactifs.",
    icon: <FileText className="w-6 h-6" />,
    color: "from-fuchsia-400 to-purple-600",
  },
  {
    title: "Auto-Connect Wi-Fi",
    desc: "Accès instantané sans saisie manuelle.",
    icon: <Wifi className="w-6 h-6" />,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "NextGen vCard",
    desc: "Identité numérique et réseaux sociaux.",
    icon: <Contact className="w-6 h-6" />,
    color: "from-orange-400 to-red-500",
  },
  {
    title: "Encrypted Text",
    desc: "Messages sécurisés et codes promotionnels.",
    icon: <Type className="w-6 h-6" />,
    color: "from-blue-400 to-indigo-600",
  },
  {
    title: "Interactive Mail",
    desc: "Flux de contact pré-remplis en un scan.",
    icon: <Mail className="w-6 h-6" />,
    color: "from-pink-400 to-rose-500",
  },
];

const steps = [
  {
    id: "01",
    title: "Structure",
    desc: "Définissez l'ADN de votre contenu.",
    icon: <Zap />,
  },
  {
    id: "02",
    title: "Injection",
    desc: "Payload de données ultra-rapide.",
    icon: <Globe />,
  },
  {
    id: "03",
    title: "Morphing",
    desc: "Stylisation visuelle adaptative.",
    icon: <Palette />,
  },
  {
    id: "04",
    title: "Export",
    desc: "Rendu vectoriel haute fidélité.",
    icon: <Download />,
  },
  {
    id: "05",
    title: "Intelligence",
    desc: "Suivi analytique en temps réel.",
    icon: <BarChart3 />,
  },
];

export default function HomePage() {
  const router = useRouter();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleMove = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });

    const handleScroll = () => setScrolled(window.scrollY > 20);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navigateToAuth = () => {
    router.push("/auth");
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Fond Dynamique */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-[800px] h-[800px] rounded-full bg-cyan-500/10 blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePos.x / 10 - 400}px, ${
              mousePos.y / 10 - 400
            }px)`,
          }}
        />
        <div
          className="absolute right-0 w-[600px] h-[600px] rounded-full bg-purple-600/10 blur-[120px] transition-transform duration-1000 ease-out delay-75"
          style={{
            transform: `translate(${-mousePos.x / 15}px, ${
              -mousePos.y / 15
            }px)`,
          }}
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      <>
        {/* Header */}
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? "py-4" : "py-8"
          }`}
        >
          <div
            className={`mx-auto max-w-7xl px-6 flex items-center justify-between transition-all duration-300 ${
              scrolled
                ? "bg-white/5 backdrop-blur-md rounded-full border border-white/10 px-8"
                : ""
            }`}
          >
            <div
  className="flex items-center gap-3 group cursor-pointer"
  onClick={() => {
  window.location.href = "/";
}}
>
  <div className="relative w-10 h-10 flex items-center justify-center">
    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500" />
    <QrCode className="relative w-6 h-6 text-white" />
  </div>
  <span className="text-xl font-bold tracking-tighter uppercase">
    NeonPulse<span className="text-cyan-400">QR</span>
  </span>
</div>

            <nav className="hidden md:flex items-center gap-10">
              <NavLink onClick={() => scrollToSection("features")}>
                Technologie
              </NavLink>
              <NavLink onClick={() => scrollToSection("workflow")}>
                Processus
              </NavLink>
              <NavLink onClick={() => scrollToSection("analytics")}>
                Analytics
              </NavLink>
            </nav>

            <button
              onClick={navigateToAuth}
              className="relative group px-6 py-2.5 overflow-hidden rounded-full bg-white text-black font-bold transition-all hover:pr-10"
            >
              <span className="relative z-10">Get Started</span>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-4 h-4" />
            </button>
          </div>
        </header>

        <main className="relative z-10 animate-fade-in">
          {/* Hero Section */}
          <section className="pt-44 pb-20 px-6">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-medium uppercase tracking-widest text-cyan-400 font-black italic">
                    V3.0 Live
                  </span>
                </div>

                <h1 className="text-7xl md:text-8xl font-black leading-[0.9] tracking-tighter uppercase italic">
                  L'identité <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400">
                    Augmentée
                  </span>
                </h1>

                <p className="text-lg text-white/50 max-w-lg leading-relaxed italic">
                  Transformez chaque interaction physique en une expérience
                  numérique immersive. Suivez et personnalisez votre image de
                  marque.
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <button
                    onClick={navigateToAuth}
                    className="px-8 py-5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase shadow-[0_20px_50px_rgba(34,211,238,0.2)] transition-all active:scale-95"
                  >
                    Générer mon QR
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="px-8 py-5 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md font-black text-xs uppercase transition-all"
                  >
                    Démo Interactive
                  </button>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative group">
                <div className="absolute -inset-20 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
                <div
                  className="relative mx-auto w-full max-w-[480px] aspect-square rounded-[3rem] border border-white/10 bg-white/5 backdrop-blur-3xl p-8 shadow-2xl overflow-hidden cursor-pointer hover:border-cyan-500/30 transition-colors"
                  onClick={navigateToAuth}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />

                  <div className="h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-black italic uppercase">
                          Aether-X
                        </h3>
                        <p className="text-[10px] text-white/40 uppercase tracking-tighter font-black">
                          Dynamic Neural QR
                        </p>
                      </div>
                      <div className="px-3 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-[10px] font-black italic">
                        READY
                      </div>
                    </div>

                    {/* QR Grid */}
                    <div className="grid grid-cols-10 gap-1.5 opacity-80">
                      {Array.from({ length: 100 }).map((_, i) => {
                        const isCorner =
                          (i < 3 && i % 10 < 3) ||
                          (i < 3 && i % 10 > 6) ||
                          (i > 69 && i % 10 < 3);

                        const isActive = isMounted
                          ? Math.random() > 0.6
                          : i % 7 === 0;

                        return (
                          <div
                            key={i}
                            className={`aspect-square rounded-[2px] transition-all duration-700 ${
                              isCorner
                                ? "bg-white"
                                : isActive
                                ? "bg-cyan-400 animate-pulse"
                                : "bg-white/10"
                            }`}
                          />
                        );
                      })}
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 border border-white/10 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[8px] text-white/40 font-black uppercase">
                          Analytics Live
                        </p>
                        <p className="text-xs font-black italic tracking-widest uppercase">
                          1,429 Scans / H
                        </p>
                      </div>
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="mb-16 text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                Modes de Fusion
              </h2>
              <p className="text-white/40 max-w-xl mx-auto italic text-sm">
                Le canal parfait pour vos données.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {qrTypes.map((type, i) => (
                <GlassCard key={i} onClick={navigateToAuth}>
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-6 shadow-lg transform group-hover:-rotate-12 transition-transform`}
                  >
                    {type.icon}
                  </div>
                  <h3 className="text-xl font-black italic uppercase mb-3 tracking-tighter">
                    {type.title}
                  </h3>
                  <p className="text-white/50 text-xs leading-relaxed mb-6 italic">
                    {type.desc}
                  </p>
                  <div className="w-full h-[1px] bg-white/10 mb-6" />
                  <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 group/btn">
                    Explorer
                    <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section id="workflow" className="py-24 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                <div className="space-y-4">
                  <span className="text-cyan-400 font-black tracking-[0.3em] uppercase text-[10px]">
                    Architecture
                  </span>
                  <h2 className="text-5xl font-black uppercase italic tracking-tighter">
                    Du concept à la réalité.
                  </h2>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className="relative group cursor-pointer"
                    onClick={navigateToAuth}
                  >
                    <div className="text-7xl font-black text-white/[0.03] absolute -top-8 -left-4 select-none group-hover:text-cyan-400/10 transition-colors italic">
                      {step.id}
                    </div>
                    <div className="relative z-10 p-6 space-y-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-400 group-hover:text-black transition-colors duration-500">
                        {step.icon}
                      </div>
                      <h4 className="text-sm font-black uppercase italic">
                        {step.title}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Analytics */}
          <section id="analytics" className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">
                Analytics Temps Réel
              </h2>
              <p className="text-white/40 max-w-2xl mx-auto italic text-sm">
                Mesurez les scans, optimisez vos campagnes et transformez vos QR
                codes en canal de croissance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <GlassCard>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  Scans du jour
                </p>
                <h3 className="text-4xl font-black italic">1,429</h3>
                <p className="text-cyan-400 text-xs mt-3">+18% vs hier</p>
              </GlassCard>

              <GlassCard>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  Taux d’engagement
                </p>
                <h3 className="text-4xl font-black italic">64%</h3>
                <p className="text-fuchsia-400 text-xs mt-3">
                  Sur vos QR dynamiques
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">
                  Profils actifs
                </p>
                <h3 className="text-4xl font-black italic">312</h3>
                <p className="text-emerald-400 text-xs mt-3">
                  Campagnes en cours
                </p>
              </GlassCard>
            </div>
          </section>

          {/* CTA */}
          <section className="py-32 px-6">
            <div className="max-w-5xl mx-auto relative rounded-[4rem] bg-gradient-to-br from-cyan-600 to-fuchsia-700 p-1 shadow-2xl transition-transform hover:scale-[1.01] duration-700">
              <div className="bg-[#02040a] rounded-[3.9rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/20 blur-[100px] rounded-full" />
                <h2 className="text-4xl md:text-6xl font-black leading-tight relative z-10 uppercase italic">
                  Prêt à numériser <br /> votre monde ?
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                  <button
                    onClick={navigateToAuth}
                    className="px-12 py-5 rounded-full bg-white text-black font-black uppercase text-xs hover:scale-105 transition-transform"
                  >
                    Créer mon compte
                  </button>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-12 border-t border-white/5 bg-[#02040a]">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
              <span className="text-[10px] font-black tracking-widest opacity-30 uppercase">
                © 2026 Aether Core Inc.
              </span>
              <div className="flex gap-8 text-[10px] font-black text-white/20 uppercase tracking-widest">
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-cyan-400 transition-colors">
                  Terms
                </a>
              </div>
            </div>
          </footer>
        </main>
      </>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes scan { 
          0% { top: 0; opacity: 0; } 
          20% { opacity: 1; } 
          80% { opacity: 1; } 
          100% { top: 100%; opacity: 0; } 
        }
        .animate-scan { animation: scan 4s linear infinite; }

        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out forwards; }
      `,
        }}
      />
    </div>
  );
}
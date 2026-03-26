"use client";
import StepTypeAnimation from "@/components/steps/StepTypeAnimation";
import StepContentAnimation from "@/components/steps/StepContentAnimation";
import StepDesignAnimation from "@/components/steps/StepDesignAnimation";
import StepExportAnimation from "@/components/steps/StepExportAnimation";
import StepAnalyticsAnimation from "@/components/steps/StepAnalyticsAnimation";
import React, { useState, useEffect, useRef } from "react";
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
  ChevronRight,
  Layers,
  Cpu,
  Activity,
  Fingerprint,
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
    className={`relative group transition-all duration-500 hover:scale-[1.015] cursor-pointer ${className}`}
  >
    <div className="absolute -inset-[1px] bg-gradient-to-br from-white/20 via-transparent to-white/5 rounded-[1.5rem] z-0" />
    <div className="absolute inset-0 bg-white/[0.03] backdrop-blur-2xl rounded-[1.5rem] z-0" />
    <div className="relative z-10 p-5 h-full">{children}</div>
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
    className="relative text-xs font-medium text-white/60 hover:text-white transition-colors group py-2"
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
    icon: <ArrowUpRight className="w-5 h-5" />,
    color: "from-cyan-400 to-blue-500",
  },
  {
    title: "Dynamic PDF",
    desc: "Menus, brochures et catalogues interactifs.",
    icon: <FileText className="w-5 h-5" />,
    color: "from-fuchsia-400 to-purple-600",
  },
  {
    title: "Auto-Connect Wi-Fi",
    desc: "Accès instantané sans saisie manuelle.",
    icon: <Wifi className="w-5 h-5" />,
    color: "from-emerald-400 to-teal-500",
  },
  {
    title: "NextGen vCard",
    desc: "Identité numérique et réseaux sociaux.",
    icon: <Contact className="w-5 h-5" />,
    color: "from-orange-400 to-red-500",
  },
  {
    title: "Encrypted Text",
    desc: "Messages sécurisés et codes promotionnels.",
    icon: <Type className="w-5 h-5" />,
    color: "from-blue-400 to-indigo-600",
  },
  {
    title: "Interactive Mail",
    desc: "Flux de contact pré-remplis en un scan.",
    icon: <Mail className="w-5 h-5" />,
    color: "from-pink-400 to-rose-500",
  },
];

const steps = [
  {
    id: "01",
    title: "Choisissez votre type",
    desc: "Sélectionnez le format idéal : URL, PDF, WiFi, vCard, email ou réseaux sociaux. Chaque type est optimisé pour un usage précis.",
    icon: <Cpu className="w-5 h-5" />,
    eyebrow: "Initialisation",
    accent: "from-cyan-500/40 via-blue-500/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(6,182,212,0.15)]",
    badge: "20+ formats",
    image: "/screens/step-1.png",
    points: ["URL / PDF / WiFi", "Types intelligents", "Choix instantané"],
  },
  {
    id: "02",
    title: "Ajoutez votre contenu",
    desc: "Collez un lien, importez un PDF ou saisissez votre contenu. Le système détecte automatiquement les erreurs avant génération.",
    icon: <Fingerprint className="w-5 h-5" />,
    eyebrow: "Payload Data",
    accent: "from-emerald-400/40 via-teal-500/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(16,185,129,0.15)]",
    badge: "Validation live",
    image: "/screens/step-2.png",
    points: ["Détection d’URL", "Validation smart", "Aucun QR cassé"],
  },
  {
    id: "03",
    title: "Personnalisez-le",
    desc: "Ajoutez vos couleurs, votre logo et vos formes pour créer un QR aligné avec votre identité de marque.",
    icon: <Layers className="w-5 h-5" />,
    eyebrow: "Gen-Design",
    accent: "from-fuchsia-500/40 via-purple-600/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(217,70,239,0.15)]",
    badge: "Creative Lab",
    image: "/screens/step-3.png",
    points: ["Logo intégré", "Palette de marque", "Style premium"],
  },
  {
    id: "04",
    title: "Téléchargez ou passez en dynamique",
    desc: "Exportez en PNG ou SVG, ou activez le mode dynamique pour modifier la destination plus tard sans réimprimer.",
    icon: <Zap className="w-5 h-5" />,
    eyebrow: "Deployment",
    accent: "from-orange-400/40 via-red-500/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(251,146,60,0.15)]",
    badge: "Dynamic Bridge",
    image: "/screens/step-4.png",
    points: ["PNG / SVG HD", "QR dynamique", "Édition post-print"],
  },
  {
    id: "05",
    title: "Suivez chaque scan",
    desc: "Analysez vos scans en temps réel avec les données de performance, la géolocalisation, les appareils et les tendances.",
    icon: <Activity className="w-5 h-5" />,
    eyebrow: "Analytics",
    accent: "from-indigo-500/40 via-blue-600/10 to-transparent",
    glow: "shadow-[0_0_100px_rgba(79,70,229,0.15)]",
    badge: "Live Analytics",
    image: "/screens/step-5.png",
    points: ["Temps réel", "Heat mapping", "Conversion insights"],
  },
];

const stepComponents = [
  StepTypeAnimation,
  StepContentAnimation,
  StepDesignAnimation,
  StepExportAnimation,
  StepAnalyticsAnimation,
];

export default function HomePage() {
  const router = useRouter();

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrolled, setScrolled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [activeStep, setActiveStep] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const timerRef = useRef<number | null>(null);

  const [isProgressAnimating, setIsProgressAnimating] = useState(true);

  const autoplayDuration = 5000;
  const ActiveStepComponent = stepComponents[activeStep];

  useEffect(() => {
    setIsMounted(true);

    const handleMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY,
      });
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    handleScroll();

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setIsProgressAnimating(true);
    setProgressKey((prev) => prev + 1);

    timerRef.current = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
      setProgressKey((prev) => prev + 1);
      setIsProgressAnimating(true);
    }, autoplayDuration);

    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [autoplayDuration]);

  const navigateToAuth = () => {
    router.push("/auth");
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const restartAutoplay = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    setProgressKey((prev) => prev + 1);
    setIsProgressAnimating(true);

    timerRef.current = window.setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
      setProgressKey((prev) => prev + 1);
      setIsProgressAnimating(true);
    }, autoplayDuration);
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white font-sans text-[14px] md:text-[15px] selection:bg-cyan-500/30 overflow-x-hidden">
      {/* Fond Dynamique */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div
          className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] transition-transform duration-1000 ease-out"
          style={{
            transform: `translate(${mousePos.x / 10 - 300}px, ${
              mousePos.y / 10 - 300
            }px)`,
          }}
        />
        <div
          className="absolute right-0 w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[120px] transition-transform duration-1000 ease-out delay-75"
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
            scrolled ? "py-3" : "py-5"
          }`}
        >
          <div
            className={`mx-auto max-w-7xl px-5 flex items-center justify-between transition-all duration-300 ${
              scrolled
                ? "bg-white/5 backdrop-blur-md rounded-full border border-white/10 px-6"
                : ""
            }`}
          >
            <div
              className="flex items-center gap-3 group cursor-pointer"
              onClick={() => router.push("/")}
            >
              <div className="relative w-9 h-9 flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-lg rotate-12 group-hover:rotate-45 transition-transform duration-500" />
                <QrCode className="relative w-5 h-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold tracking-tighter uppercase">
                My<span className="text-cyan-400">QR</span>
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-7">
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
              className="relative group px-5 py-2 overflow-hidden rounded-full bg-white text-black font-bold text-xs transition-all hover:pr-8"
            >
              <span className="relative z-10">Get Started</span>
              <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        <main className="relative z-10 animate-fade-in">
          {/* Hero Section */}
          <section className="pt-32 md:pt-36 pb-16 px-5">
            <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
                  <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-cyan-400 font-black italic">
                    V3.0 Live
                  </span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[0.92] tracking-tighter uppercase italic">
                  L'identité <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400">
                    Augmentée
                  </span>
                </h1>

                <p className="text-sm md:text-base text-white/50 max-w-md leading-relaxed italic">
                  Transformez chaque interaction physique en une expérience
                  numérique immersive. Suivez et personnalisez votre image de
                  marque.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    onClick={navigateToAuth}
                    className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[11px] uppercase shadow-[0_20px_50px_rgba(34,211,238,0.2)] transition-all active:scale-95"
                  >
                    Générer mon QR
                  </button>
                  <button
                    onClick={() => scrollToSection("features")}
                    className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md font-black text-[11px] uppercase transition-all"
                  >
                    Démo Interactive
                  </button>
                </div>
              </div>

              {/* Hero Visual */}
              <div className="relative group">
                <div className="absolute -inset-10 md:-inset-16 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
                <div
                  className="relative mx-auto w-full max-w-[380px] md:max-w-[420px] aspect-square rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur-3xl p-6 shadow-2xl overflow-hidden cursor-pointer hover:border-cyan-500/30 transition-colors"
                  onClick={navigateToAuth}
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />

                  <div className="h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black italic uppercase">
                          My-X
                        </h3>
                        <p className="text-[9px] text-white/40 uppercase tracking-tighter font-black">
                          Dynamic Neural QR
                        </p>
                      </div>
                      <div className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-[9px] font-black italic">
                        READY
                      </div>
                    </div>

                    {/* QR Grid */}
                    <div className="grid grid-cols-10 gap-1 opacity-80">
                      {Array.from({ length: 100 }).map((_, i) => {
                        const isCorner =
                          (i < 3 && i % 10 < 3) ||
                          (i < 3 && i % 10 > 6) ||
                          (i > 69 && i % 10 < 3);

                        const isActive = isMounted ? i % 3 === 0 : i % 7 === 0;

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

                    <div className="bg-white/10 rounded-xl p-3 border border-white/10 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[8px] text-white/40 font-black uppercase">
                          Analytics Live
                        </p>
                        <p className="text-[11px] md:text-xs font-black italic tracking-widest uppercase">
                          1,429 Scans / H
                        </p>
                      </div>
                      <div className="flex -space-x-2">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-5 h-5 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border border-white/20"
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
          <section
            id="features"
            className="py-16 md:py-20 px-5 max-w-7xl mx-auto"
          >
            <div className="mb-12 text-center space-y-3">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
                Modes de Fusion
              </h2>
              <p className="text-white/40 max-w-xl mx-auto italic text-sm">
                Le canal parfait pour vos données.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {qrTypes.map((type, i) => (
                <GlassCard key={i} onClick={navigateToAuth}>
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 shadow-lg transform group-hover:-rotate-12 transition-transform`}
                  >
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-black italic uppercase mb-2 tracking-tighter">
                    {type.title}
                  </h3>
                  <p className="text-white/50 text-[12px] leading-relaxed mb-4 italic">
                    {type.desc}
                  </p>
                  <div className="w-full h-[1px] bg-white/10 mb-4" />
                  <button className="text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-2 group/btn">
                    Explorer
                    <ArrowUpRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </GlassCard>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section id="workflow" className="relative py-20 md:py-24 px-5">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12 md:mb-16">
                <div className="space-y-4 max-w-2xl">
                  <div className="flex items-center gap-4">
                    <div className="h-[1px] w-10 bg-cyan-500/50" />
                    <span className="text-cyan-400 font-black tracking-[0.35em] uppercase text-[10px]">
                      Workflow
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.9]">
                    Le parcours <span className="text-cyan-400">créatif</span>{" "}
                    <br />
                    de votre QR.
                  </h2>
                  <p className="text-white/40 italic text-sm md:text-base max-w-xl">
                    Une démonstration vivante de votre produit : chaque étape
                    prend le focus, révèle son interface réelle et raconte le
                    flow de création.
                  </p>
                </div>
              </div>

              <div className="grid lg:grid-cols-[0.95fr_1.1fr] gap-10 md:gap-12 items-start">
                {/* Colonne gauche */}
                <div className="space-y-4 relative">
                  <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0" />

                  {steps.map((step, index) => {
                    const isActive = index === activeStep;

                    return (
                      <div
                        key={step.id}
                        onClick={() => {
                          setActiveStep(index);
                          restartAutoplay();
                        }}
                        className={`group relative flex items-start gap-5 p-4 rounded-2xl cursor-pointer transition-all duration-700 ${
                          isActive
                            ? "bg-white/[0.04] translate-x-2"
                            : "hover:bg-white/[0.02]"
                        }`}
                      >
                        <div className="relative shrink-0 mt-1">
                          <div
                            className={`absolute -inset-3 rounded-full border-2 border-dashed border-cyan-500/20 transition-all duration-1000 ${
                              isActive
                                ? "rotate-180 scale-125 opacity-100"
                                : "scale-50 opacity-0"
                            }`}
                          />
                          <div
                            className={`relative w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                              isActive
                                ? "bg-cyan-500 border-cyan-400 text-black scale-110 shadow-[0_0_30px_rgba(34,211,238,0.4)]"
                                : "bg-white/5 border-white/10 text-white/30"
                            }`}
                          >
                            {step.icon}
                          </div>
                        </div>

                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span
                              className={`text-[10px] font-black uppercase tracking-[0.16em] transition-colors ${
                                isActive ? "text-cyan-400" : "text-white/20"
                              }`}
                            >
                              Step {step.id} — {step.eyebrow}
                            </span>
                            {isActive && (
                              <div className="h-1 w-1 rounded-full bg-cyan-400 animate-ping" />
                            )}
                          </div>

                          <h3
                            className={`text-lg md:text-xl font-black italic uppercase transition-all duration-500 ${
                              isActive
                                ? "text-white scale-[1.01]"
                                : "text-white/30"
                            }`}
                          >
                            {step.title}
                          </h3>

                          <p
                            className={`text-[12px] italic leading-relaxed transition-all duration-700 max-w-md ${
                              isActive
                                ? "text-white/60"
                                : "text-white/0 h-0 overflow-hidden opacity-0"
                            }`}
                          >
                            {step.desc}
                          </p>

                          {isActive && (
                            <div className="pt-3 overflow-hidden">
                              <div className="h-[2px] w-full bg-white/10 rounded-full">
                                <div
                                  key={`${step.id}-${progressKey}`}
                                  className="h-full bg-cyan-400"
                                  style={{
                                    width: isProgressAnimating ? "100%" : "0%",
                                    animation: isProgressAnimating
                                      ? `progressFill ${autoplayDuration}ms linear forwards`
                                      : "none",
                                  }}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Colonne droite */}
                <div className="lg:sticky lg:top-24 h-[420px] md:h-[520px] flex items-center justify-center">
                  <div className="relative w-full h-full">
                    <ActiveStepComponent key={activeStep} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Analytics */}
          <section
            id="analytics"
            className="py-16 md:py-20 px-5 max-w-7xl mx-auto"
          >
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
                Analytics Temps Réel
              </h2>
              <p className="text-white/40 max-w-2xl mx-auto italic text-sm">
                Mesurez les scans, optimisez vos campagnes et transformez vos QR
                codes en canal de croissance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-5">
              <GlassCard>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Scans du jour
                </p>
                <h3 className="text-2xl md:text-3xl font-black italic">1,429</h3>
                <p className="text-cyan-400 text-xs mt-2">+18% vs hier</p>
              </GlassCard>

              <GlassCard>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Taux d’engagement
                </p>
                <h3 className="text-2xl md:text-3xl font-black italic">64%</h3>
                <p className="text-fuchsia-400 text-xs mt-2">
                  Sur vos QR dynamiques
                </p>
              </GlassCard>

              <GlassCard>
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                  Profils actifs
                </p>
                <h3 className="text-2xl md:text-3xl font-black italic">312</h3>
                <p className="text-emerald-400 text-xs mt-2">
                  Campagnes en cours
                </p>
              </GlassCard>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 md:py-24 px-5">
            <div className="max-w-5xl mx-auto relative rounded-[2.5rem] bg-gradient-to-br from-cyan-600 to-fuchsia-700 p-1 shadow-2xl transition-transform hover:scale-[1.01] duration-700">
              <div className="bg-[#02040a] rounded-[2.35rem] p-8 md:p-12 text-center space-y-7 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-cyan-500/20 blur-[100px] rounded-full" />
                <h2 className="text-2xl md:text-3xl font-black leading-tight relative z-10 uppercase italic">
                  Prêt à numériser <br /> votre monde ?
                </h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                  <button
                    onClick={navigateToAuth}
                    className="px-8 py-3 rounded-full bg-white text-black font-black uppercase text-[11px] hover:scale-105 transition-transform"
                  >
                    Créer mon compte
                  </button>
                </div>
              </div>
            </div>
          </section>

          <footer className="py-10 border-t border-white/5 bg-[#02040a]">
            <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
              <span className="text-[10px] font-black tracking-widest opacity-30 uppercase">
                © 2026 MyQR Core Inc.
              </span>
              <div className="flex gap-6 text-[10px] font-black text-white/20 uppercase tracking-widest">
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
        @keyframes export-sheen {
          0% {
            transform: translateX(-120%);
          }
          100% {
            transform: translateX(120%);
          }
        }

        .animate-export-sheen {
          animation: export-sheen 1s ease-out forwards;
        }

        @keyframes chart-glow {
          0% {
            filter: drop-shadow(0 0 0px rgba(34,211,238,0));
          }
          50% {
            filter: drop-shadow(0 0 10px rgba(34,211,238,0.45));
          }
          100% {
            filter: drop-shadow(0 0 0px rgba(34,211,238,0));
          }
        }

        .animate-chart-glow {
          animation: chart-glow 1.2s ease-in-out;
        }

        @keyframes progressFill {
          from { width: 0%; }
          to { width: 100%; }
        }

        @keyframes scan-y {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .animate-scan-y {
          animation: scan-y 3s linear infinite;
        }

        .animate-spin-slow {
          animation: spin 12s linear infinite;
        }

        @keyframes scan { 
          0% { top: 0; opacity: 0; } 
          20% { opacity: 1; } 
          80% { opacity: 1; } 
          100% { top: 100%; opacity: 0; } 
        }

        .animate-scan {
          animation: scan 4s linear infinite;
        }

        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(10px); } 
          to { opacity: 1; transform: translateY(0); } 
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }

        @keyframes scan-horizontal {
          0% { transform: translateX(-100%); opacity: 0; }
          15% { opacity: 1; }
          85% { opacity: 1; }
          100% { transform: translateX(100%); opacity: 0; }
        }

        .animate-scan-horizontal {
          animation: scan-horizontal 4.2s linear infinite;
        }

        @keyframes step-progress {
          from { width: 0%; }
          to { width: 100%; }
        }

        .animate-step-progress {
          animation-name: step-progress;
          animation-timing-function: linear;
          animation-fill-mode: forwards;
        }
      `,
        }}
      />
    </div>
  );
}
"use client";

import Link from "next/link";

const qrTypes = [
  {
    title: "Lien / URL",
    desc: "Transformez un site web, une landing page ou un produit en QR code scannable instantanément.",
    icon: "↗",
  },
  {
    title: "PDF",
    desc: "Partagez brochures, menus, catalogues, CV, notices et documents en un scan.",
    icon: "▣",
  },
  {
    title: "Wi-Fi",
    desc: "Connectez vos invités à votre réseau sans saisir de mot de passe.",
    icon: "◉",
  },
  {
    title: "vCard",
    desc: "Diffusez vos coordonnées professionnelles avec une carte de visite intelligente.",
    icon: "⌘",
  },
  {
    title: "Texte",
    desc: "Encodez messages, codes promo, instructions ou informations rapides.",
    icon: "✦",
  },
  {
    title: "Email / SMS",
    desc: "Lancez directement un email ou un message prérempli depuis le scan.",
    icon: "✉",
  },
];

const steps = [
  {
    number: "01",
    title: "Choisir le type",
    desc: "Sélectionnez le format parfait : lien, PDF, Wi-Fi, contact, texte, email et plus encore.",
  },
  {
    number: "02",
    title: "Insérer les informations",
    desc: "Ajoutez vos données en quelques secondes avec une expérience simple et fluide.",
  },
  {
    number: "03",
    title: "Personnaliser le design",
    desc: "Couleurs, coins, motifs, logo, style premium : créez un QR code qui reflète votre marque.",
  },
  {
    number: "04",
    title: "Télécharger",
    desc: "Exportez vos QR codes en haute qualité pour l’impression ou le digital.",
  },
  {
    number: "05",
    title: "Analyse & mise à jour",
    desc: "Suivez les performances, optimisez les scans et mettez à jour les contenus dynamiques.",
  },
];

const features = [
  "QR codes dynamiques",
  "Design ultra personnalisable",
  "Statistiques de scans",
  "Mise à jour sans réimpression",
  "Compatible print & digital",
  "Expérience rapide et moderne",
];

export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#050816] text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-[28rem] w-[28rem] rounded-full bg-fuchsia-500/20 blur-3xl animate-floatSlow" />
        <div className="absolute right-[-8%] top-[10%] h-[24rem] w-[24rem] rounded-full bg-cyan-400/20 blur-3xl animate-floatMedium" />
        <div className="absolute bottom-[-15%] left-[20%] h-[30rem] w-[30rem] rounded-full bg-violet-600/20 blur-3xl animate-floatSlow" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.07),transparent_30%),linear-gradient(to_bottom,rgba(255,255,255,0.03),transparent_20%),linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:auto,auto,42px_42px,42px_42px]" />
      </div>

      {/* Navbar */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 md:px-10">
        <div className="flex items-center gap-4">
          <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 shadow-[0_0_35px_rgba(125,211,252,0.25)] backdrop-blur-xl">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/30 via-fuchsia-500/20 to-violet-500/30" />
            <div className="relative grid grid-cols-3 gap-[3px]">
              <span className="h-2.5 w-2.5 rounded-sm bg-white" />
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-300" />
              <span className="h-2.5 w-2.5 rounded-sm bg-white" />
              <span className="h-2.5 w-2.5 rounded-sm bg-fuchsia-300" />
              <span className="h-2.5 w-2.5 rounded-sm bg-white" />
              <span className="h-2.5 w-2.5 rounded-sm bg-cyan-300" />
              <span className="h-2.5 w-2.5 rounded-sm bg-white" />
              <span className="h-2.5 w-2.5 rounded-sm bg-violet-300" />
              <span className="h-2.5 w-2.5 rounded-sm bg-white" />
            </div>
          </div>

          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/80">
              Smart QR Experience
            </p>
            <h1 className="text-xl font-black tracking-tight md:text-2xl">
              NeonPulse QR
            </h1>
          </div>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          <a href="#types" className="text-sm text-white/70 transition hover:text-white">
            Types de QR
          </a>
          <a href="#etapes" className="text-sm text-white/70 transition hover:text-white">
            Étapes
          </a>
          <a href="#benefices" className="text-sm text-white/70 transition hover:text-white">
            Avantages
          </a>
        </nav>

        <Link
          href="/signup"
          className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl transition hover:scale-[1.03] hover:bg-white/15"
        >
          S’inscrire
        </Link>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid min-h-[88vh] w-full max-w-7xl items-center gap-12 px-6 pb-16 pt-8 md:grid-cols-2 md:px-10 md:pb-24 md:pt-12">
        <div className="max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-cyan-300/20 bg-white/8 px-4 py-2 backdrop-blur-xl">
            <span className="h-2 w-2 rounded-full bg-cyan-300 animate-pulse" />
            <span className="text-sm text-white/80">
              Créez des QR codes puissants, élégants et mémorables
            </span>
          </div>

          <h2 className="text-5xl font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
            Donnez une
            <span className="block bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300 bg-clip-text text-transparent">
              nouvelle dimension
            </span>
            à vos QR codes
          </h2>

          <p className="mt-6 max-w-xl text-base leading-8 text-white/72 md:text-lg">
            Créez des QR codes pour des liens, PDF, accès Wi-Fi, cartes de visite,
            menus, promotions et bien plus. Personnalisez le design, suivez les
            scans, mettez à jour vos contenus et offrez une expérience premium à
            vos utilisateurs.
          </p>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full px-7 py-4 text-sm font-bold text-[#07111f] transition hover:scale-[1.03]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300" />
              <span className="absolute inset-0 opacity-0 transition group-hover:opacity-100 blur-xl bg-gradient-to-r from-cyan-300 via-white to-fuchsia-300" />
              <span className="relative">Commencer gratuitement</span>
            </Link>

            <a
              href="#etapes"
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/8 px-7 py-4 text-sm font-semibold text-white backdrop-blur-xl transition hover:bg-white/12"
            >
              Voir le fonctionnement
            </a>
          </div>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-4 sm:grid-cols-3">
            {["Rapide", "Élégant", "Dynamique", "Analytics", "Branding", "Premium"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/6 px-4 py-4 text-center text-sm font-medium text-white/85 backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/10"
                >
                  {item}
                </div>
              )
            )}
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
          <div className="absolute h-[26rem] w-[26rem] rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute h-[20rem] w-[20rem] rounded-full border border-white/10" />
          <div className="absolute h-[28rem] w-[28rem] rounded-full border border-fuchsia-300/10 animate-spinSlow" />

          <div className="relative rounded-[2rem] border border-white/12 bg-white/8 p-5 shadow-[0_0_80px_rgba(255,255,255,0.06)] backdrop-blur-2xl">
            <div className="rounded-[1.6rem] border border-white/12 bg-[#0b132b]/80 p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/70">
                    Aperçu
                  </p>
                  <h3 className="mt-1 text-lg font-bold">QR Code Designer</h3>
                </div>
                <div className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs text-white/70">
                  Live
                </div>
              </div>

              <div className="grid grid-cols-[1fr_auto] gap-5">
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-xs text-white/55">Type</p>
                    <p className="mt-1 font-semibold">Lien / URL</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-xs text-white/55">Destination</p>
                    <p className="mt-1 truncate font-semibold text-cyan-300">
                      https://neonpulse-qr.app
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/6 p-4">
                    <p className="text-xs text-white/55">Style</p>
                    <p className="mt-1 font-semibold">Gradient Pulse</p>
                  </div>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 rounded-[1.8rem] bg-gradient-to-br from-cyan-300/30 via-fuchsia-300/20 to-violet-400/30 blur-xl" />
                  <div className="relative rounded-[1.8rem] border border-white/15 bg-white p-5 shadow-2xl animate-floatFast">
                    <div className="grid grid-cols-7 gap-[4px]">
                      {Array.from({ length: 49 }).map((_, i) => {
                        const active =
                          [
                            0, 1, 2, 5, 6,
                            7, 9, 11, 12, 13,
                            14, 16, 18, 20,
                            21, 22, 23, 25, 27,
                            28, 30, 31, 33, 34,
                            35, 37, 39, 41,
                            42, 43, 44, 47, 48,
                          ].includes(i);

                        return (
                          <span
                            key={i}
                            className={`h-4 w-4 rounded-[3px] ${
                              active ? "bg-[#0b1020]" : "bg-[#dbeafe]"
                            }`}
                          />
                        );
                      })}
                    </div>
                    <div className="mt-4 rounded-xl bg-[#0b1020] px-3 py-2 text-center text-xs font-semibold text-white">
                      Scan me
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-3">
                {[
                  ["Scans", "12.4k"],
                  ["Taux d’action", "68%"],
                  ["Mises à jour", "Live"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/6 p-4 text-center"
                  >
                    <p className="text-xs text-white/50">{label}</p>
                    <p className="mt-1 text-lg font-black">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QR Types */}
      <section
        id="types"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-20"
      >
        <div className="mb-12 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/75">
            Types de QR codes
          </p>
          <h3 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            Créez un QR pour chaque usage
          </h3>
          <p className="mt-4 text-white/68 leading-8">
            Que vous soyez créateur, entreprise, restaurant, événementiel ou e-commerce,
            vous pouvez générer des QR codes adaptés à chaque besoin.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {qrTypes.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl transition duration-300 hover:-translate-y-2 hover:bg-white/10"
            >
              <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-300/10 blur-2xl transition group-hover:bg-fuchsia-300/15" />
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/10 text-2xl">
                {item.icon}
              </div>
              <h4 className="text-xl font-bold">{item.title}</h4>
              <p className="mt-3 leading-7 text-white/68">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Steps */}
      <section
        id="etapes"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-20"
      >
        <div className="mb-12 max-w-2xl">
          <p className="text-sm uppercase tracking-[0.35em] text-fuchsia-300/80">
            Workflow
          </p>
          <h3 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
            Un parcours simple, intelligent et puissant
          </h3>
          <p className="mt-4 text-white/68 leading-8">
            L’objectif n’est pas seulement de générer un QR code, mais de créer une
            vraie expérience de diffusion, d’identité visuelle et de performance.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
          {steps.map((step) => (
            <div
              key={step.number}
              className="relative rounded-[1.75rem] border border-white/10 bg-white/6 p-6 backdrop-blur-2xl transition hover:-translate-y-2 hover:bg-white/10"
            >
              <div className="mb-4 text-4xl font-black text-white/15">{step.number}</div>
              <h4 className="text-xl font-bold">{step.title}</h4>
              <p className="mt-3 text-sm leading-7 text-white/68">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section
        id="benefices"
        className="relative z-10 mx-auto w-full max-w-7xl px-6 py-10 md:px-10 md:py-20"
      >
        <div className="grid gap-8 md:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/6 p-8 backdrop-blur-2xl">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/75">
              Pourquoi NeonPulse QR
            </p>
            <h3 className="mt-4 text-3xl font-black tracking-tight md:text-5xl">
              Plus qu’un générateur :
              <span className="block bg-gradient-to-r from-white via-cyan-200 to-fuchsia-200 bg-clip-text text-transparent">
                une plateforme de présence intelligente
              </span>
            </h3>
            <p className="mt-5 max-w-2xl leading-8 text-white/68">
              Votre QR code devient un point d’entrée vers votre univers de marque :
              plus élégant, plus mesurable, plus flexible, plus efficace.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div
                  key={feature}
                  className="rounded-2xl border border-white/10 bg-[#0d1631]/60 px-4 py-4 text-white/85"
                >
                  ✦ {feature}
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-300/15 via-white/5 to-fuchsia-400/15 p-8 backdrop-blur-2xl">
              <p className="text-sm text-white/60">Création</p>
              <p className="mt-2 text-4xl font-black">Instantanée</p>
              <p className="mt-3 leading-7 text-white/70">
                Générez un QR code en quelques secondes avec un rendu premium.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-violet-400/15 via-white/5 to-cyan-300/15 p-8 backdrop-blur-2xl">
              <p className="text-sm text-white/60">Design</p>
              <p className="mt-2 text-4xl font-black">100% personnalisable</p>
              <p className="mt-3 leading-7 text-white/70">
                Adaptez chaque QR code à votre branding avec style et impact.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 via-fuchsia-300/10 to-cyan-300/10 p-8 backdrop-blur-2xl">
              <p className="text-sm text-white/60">Performance</p>
              <p className="mt-2 text-4xl font-black">Scalable</p>
              <p className="mt-3 leading-7 text-white/70">
                Idéal pour campagnes marketing, menus, événements, packaging et cartes de visite.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-10 md:px-10 md:pb-28">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-white/8 px-8 py-12 text-center backdrop-blur-2xl md:px-14 md:py-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(103,232,249,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(232,121,249,0.16),transparent_25%)]" />
          <div className="relative">
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-300/80">
              Ready to launch
            </p>
            <h3 className="mx-auto mt-4 max-w-3xl text-3xl font-black tracking-tight md:text-5xl">
              Impressionnez dès la première seconde avec des QR codes qui captent l’attention
            </h3>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-white/70">
              Lancez votre plateforme, créez une expérience moderne et donnez à vos utilisateurs
              une raison de revenir.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="rounded-full bg-white px-7 py-4 text-sm font-bold text-[#09111f] transition hover:scale-[1.03]"
              >
                Créer mon compte
              </Link>
              <a
                href="#types"
                className="rounded-full border border-white/15 bg-white/8 px-7 py-4 text-sm font-semibold text-white transition hover:bg-white/12"
              >
                Explorer les possibilités
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
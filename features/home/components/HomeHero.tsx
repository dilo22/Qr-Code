"use client";

type HomeHeroProps = {
  isMounted: boolean;
  onAuthClick: () => void;
  onScrollToSection: (id: string) => void;
};

function HeroQrBlock({isMounted,onAuthClick,}: {isMounted: boolean;onAuthClick: () => void;}) {
  return (
    <div className="relative mx-auto w-full max-w-[420px] aspect-square">
      <div className="absolute -inset-12 bg-cyan-500/20 blur-[120px] rounded-full opacity-70" />
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-cyan-400/10 via-white/[0.03] to-fuchsia-500/10 border border-white/10 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.45)] overflow-hidden" />

      <div className="absolute inset-0 rounded-[2.5rem] bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.12),transparent_28%)]" />

      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />

      <div className="relative z-10 h-full flex flex-col justify-between p-7 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] md:text-[11px] uppercase tracking-[0.35em] text-cyan-300 font-black">
              MY-X
            </p>
            <h3 className="mt-3 text-2xl md:text-3xl font-black italic uppercase leading-none">
              Scan the Future
            </h3>
          </div>

          <div className="px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 text-[10px] font-black uppercase tracking-widest">
            Live
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute w-[78%] h-[78%] rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative p-5 rounded-[2rem] bg-[#081018]/90 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
            <div className="grid grid-cols-9 gap-2">
              {Array.from({ length: 81 }).map((_, i) => {
                const row = Math.floor(i / 9);
                const col = i % 9;

                const isTopLeft = row < 3 && col < 3;
                const isTopRight = row < 3 && col > 5;
                const isBottomLeft = row > 5 && col < 3;
                const isCorner = isTopLeft || isTopRight || isBottomLeft;

                const activePattern = [
                  4, 13, 14, 22, 30, 32, 33, 36, 38, 40, 43, 46, 48, 50, 51,
                  54, 56, 58, 61, 66, 68, 70, 72, 75, 77, 79,
                ];

                const isActive = activePattern.includes(i);
                const animated = isMounted && isActive && i % 2 === 0;

                return (
                  <div
                    key={i}
                    className={`aspect-square w-7 rounded-[6px] transition-all duration-700 ${
                      isCorner
                        ? "bg-white"
                        : isActive
                          ? animated
                            ? "bg-cyan-400 shadow-[0_0_18px_rgba(34,211,238,0.45)] animate-pulse"
                            : "bg-cyan-400"
                          : "bg-white/10"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <p className="max-w-[220px] text-xs md:text-sm text-white/45 leading-relaxed italic">
            Un QR dynamique pensé comme un objet de marque, pas juste un code.
          </p>

          <button
            onClick={onAuthClick}
            className="px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 border border-white/10 text-[10px] md:text-[11px] font-black uppercase transition-all"
          >
            Générer
          </button>
        </div>
      </div>
    </div>
  );
}

export function HomeHero({
  isMounted,
  onAuthClick,
  onScrollToSection,
}: HomeHeroProps) {
  return (
    <section className="pt-32 md:pt-36 pb-16 px-5">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 md:gap-14 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-black italic uppercase tracking-widest text-cyan-400">
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
            Transformez chaque interaction physique en une expérience numérique
            immersive. Suivez et personnalisez votre image de marque.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onAuthClick}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-[11px] uppercase shadow-[0_20px_50px_rgba(34,211,238,0.2)] transition-all active:scale-95"
            >
              Générer mon QR
            </button>

            <button
              onClick={() => onScrollToSection("features")}
              className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md font-black text-[11px] uppercase transition-all"
            >
              Démo Interactive
            </button>
          </div>
        </div>

        <div onClick={onAuthClick} className="cursor-pointer">
          <HeroQrBlock isMounted={isMounted} />
        </div>
      </div>
    </section>
  );
}
"use client";

type HomeHeroProps = {
  isMounted: boolean;
  onAuthClick: () => void;
  onScrollToSection: (id: string) => void;
};

function HeroQrBlock({
  isMounted,
  onAuthClick,
}: {
  isMounted: boolean;
  onAuthClick: () => void;
}) {
  const activePattern = new Set([
    4, 13, 14, 22, 30, 32, 33, 36, 38, 40, 43, 46, 48, 50, 51, 58, 61, 67, 69,
    71, 75, 77, 79,
  ]);

  return (
    <div className="relative mx-auto w-full max-w-[420px] aspect-square">
      <div className="absolute -inset-14 rounded-full bg-cyan-500/20 blur-[120px] opacity-70" />

      <div className="absolute inset-0 overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-cyan-400/10 via-white/[0.03] to-fuchsia-500/10 backdrop-blur-3xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(217,70,239,0.12),transparent_28%)]" />
        <div className="absolute top-0 left-0 h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />
        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/8 to-transparent" />
        <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/8 to-transparent" />
      </div>

      <div className="relative z-10 flex h-full flex-col justify-between p-7 md:p-8">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.35em] text-cyan-300">
              MY-X
            </p>
            <h3 className="mt-4 text-xl md:text-2xl font-black italic uppercase leading-none tracking-tight text-white/90">
              Scan the future
            </h3>
          </div>

          <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-cyan-300">
            Live
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-[78%] w-[78%] rounded-full bg-cyan-400/10 blur-3xl opacity-70" />
          </div>

          <div
            className="group relative rounded-[2rem] border border-white/10 bg-[#060d14]/95 p-5 shadow-[0_40px_120px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:scale-[1.02]"
            onClick={onAuthClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onAuthClick();
              }
            }}
          >
            <div className="pointer-events-none absolute inset-0 scale-110 rounded-[2rem] bg-cyan-400/10 blur-3xl opacity-70" />

            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[2rem]">
              <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scanY" />
            </div>

            <div className="relative grid grid-cols-9 gap-2">
              {Array.from({ length: 81 }).map((_, i) => {
                const row = Math.floor(i / 9);
                const col = i % 9;

                const isTopLeft = row < 3 && col < 3;
                const isTopRight = row < 3 && col > 5;
                const isBottomLeft = row > 5 && col < 3;
                const isCorner = isTopLeft || isTopRight || isBottomLeft;

                const isActive = activePattern.has(i);
                const animated = isMounted && isActive && i % 2 === 0;

                return (
                  <div
                    key={i}
                    className={`aspect-square w-7 rounded-[6px] transition-all duration-700 ${
                      isCorner
                        ? "bg-white shadow-[0_0_14px_rgba(255,255,255,0.12)]"
                        : isActive
                          ? animated
                            ? "bg-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.7)] animate-pulse"
                            : "bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.45)]"
                          : "bg-white/10"
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-4">
          <p className="max-w-[220px] text-xs md:text-sm italic leading-relaxed text-white/45">
            Un QR dynamique pensé comme un objet de marque, pas juste un code.
          </p>

          <button
            onClick={onAuthClick}
            className="rounded-xl border border-white/10 bg-white/8 px-4 py-2.5 text-[10px] md:text-[11px] font-black uppercase transition-all hover:bg-white/12 active:scale-95"
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
    <section className="px-5 pb-10 pt-24 md:pb-16 md:pt-36">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 md:gap-14">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm">
            <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-widest text-cyan-400 italic">
              V3.0 Live
            </span>
          </div>

          <h1 className="text-4xl font-black uppercase italic leading-[0.92] tracking-tighter md:text-5xl lg:text-6xl">
            L'identité <br />
            <span className="bg-gradient-to-r from-cyan-300 via-white to-fuchsia-400 bg-clip-text text-transparent">
              Augmentée
            </span>
          </h1>

          <p className="max-w-md text-sm italic leading-relaxed text-white/50 md:text-base">
            Transformez chaque interaction physique en une expérience numérique
            immersive. Suivez et personnalisez votre image de marque.
          </p>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={onAuthClick}
              className="rounded-xl bg-cyan-500 px-6 py-3 text-[11px] font-black uppercase text-black shadow-[0_20px_50px_rgba(34,211,238,0.2)] transition-all hover:bg-cyan-400 active:scale-95"
            >
              Générer mon QR
            </button>

            <button
              onClick={() => onScrollToSection("features")}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-[11px] font-black uppercase backdrop-blur-md transition-all hover:bg-white/10"
            >
              Démo Interactive
            </button>
          </div>
        </div>

        <div className="hidden lg:block">
          <HeroQrBlock isMounted={isMounted} onAuthClick={onAuthClick} />
        </div>
      </div>
    </section>
  );
}
type HomeHeroProps = {
  isMounted: boolean;
  onAuthClick: () => void;
  onScrollToSection: (id: string) => void;
};

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

        <div className="relative group">
          <div className="absolute -inset-10 md:-inset-16 bg-cyan-500/20 rounded-full blur-[100px] animate-pulse" />
          <div
            className="relative mx-auto w-full max-w-[380px] md:max-w-[420px] aspect-square rounded-[2.25rem] border border-white/10 bg-white/5 backdrop-blur-3xl p-6 shadow-2xl overflow-hidden cursor-pointer hover:border-cyan-500/30 transition-colors"
            onClick={onAuthClick}
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan" />

            <div className="h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black italic uppercase">My-X</h3>
                  <p className="text-[9px] text-white/40 uppercase tracking-tighter font-black">
                    Dynamic Neural QR
                  </p>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-400 text-[9px] font-black italic">
                  READY
                </div>
              </div>

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
  );
}
import { accentStyles, featureStars, qrTypes } from "@/features/home/data/home.data";

type HomeFeaturesProps = {
  onCardClick: () => void;
};

export function HomeFeatures({ onCardClick }: HomeFeaturesProps) {
  return (
    <section
      id="features"
      className="relative py-10 md:py-24 px-5 max-w-7xl mx-auto"
    >
      {/* Fond intégré à la page, sans panneau global */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[500px] h-[200px] bg-[radial-gradient(circle,rgba(34,211,238,0.08),transparent_70%)] blur-[60px]" />
        <div className="absolute right-0 bottom-0 w-[220px] h-[220px] bg-[radial-gradient(circle,rgba(217,70,239,0.08),transparent_70%)] blur-[80px]" />
      </div>

      {/* Particules discrètes */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        {featureStars.map((star) => (
          <div
            key={star.id}
            className="absolute w-[2px] h-[2px] bg-white rounded-full"
            style={{
              top: star.top,
              left: star.left,
              opacity: star.opacity,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 mb-8 md:mb-14 text-center space-y-3">
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-[10px] font-black uppercase tracking-[0.22em] text-cyan-300">
          Protocoles QR Code
        </span>

        <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase italic">
          Créez votre format
        </h2>

        <p className="text-white/40 max-w-2xl mx-auto text-sm md:text-[15px] leading-relaxed">
          Choisissez un type de QR adapté à votre usage, avec une interface plus
          rapide, plus lisible et visuellement cohérente avec l’univers MyQR.
        </p>
      </div>

      <div className="relative z-10 -mx-5 flex gap-3 overflow-x-auto px-5 pb-3 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:pb-0 md:px-0 xl:grid-cols-4 snap-x snap-mandatory md:snap-none">
        {qrTypes.map((type) => {
          const colors = accentStyles[type.accent];
          const Icon = type.icon;

          return (
            <button
              key={type.id}
              onClick={onCardClick}
              className="group relative min-h-[150px] w-[148px] shrink-0 snap-start md:w-auto md:shrink md:min-h-[164px] rounded-[1.45rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.015))] text-left overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
            >
              <div
                className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${colors.from}/[0.10] ${colors.to}/[0.04]`}
              />

              <div
                className={`absolute left-0 top-3 bottom-3 w-[3px] rounded-full bg-gradient-to-b ${colors.from} ${colors.to} opacity-80`}
              />

              <div
                className={`absolute -left-10 top-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity bg-gradient-to-br ${colors.from} ${colors.to}`}
              />

              <div className="relative z-10 h-full px-5 py-5 md:px-6 md:py-6 flex flex-col items-center justify-center text-center">
                <div className="relative mb-5 w-13 h-13 md:w-14 md:h-14 rounded-2xl border border-white/10 bg-white/[0.03] flex items-center justify-center shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  <div
                    className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.from}/[0.10] ${colors.to}/[0.08]`}
                  />
                  <Icon className="relative z-10 w-5 h-5 md:w-5.5 md:h-5.5 text-white/90" />
                </div>

                <h3 className="text-[15px] md:text-[16px] font-extrabold tracking-tight text-white leading-tight">
                  {type.title}
                </h3>

                <p className="mt-2 text-white/35 text-[12px] md:text-[13px] leading-relaxed max-w-[180px]">
                  {type.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
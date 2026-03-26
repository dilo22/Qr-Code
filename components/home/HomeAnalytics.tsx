import { GlassCard } from "./ui/GlassCard";

export function HomeAnalytics() {
  return (
    <section
      id="analytics"
      className="py-16 md:py-20 px-5 max-w-7xl mx-auto"
    >
      <div className="text-center space-y-3 mb-12">
        <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter">
          Analytics Temps Réel
        </h2>
        <p className="text-white/40 max-w-2xl mx-auto italic text-sm">
          Mesurez les scans, optimisez vos campagnes et transformez vos QR codes
          en canal de croissance.
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
          <p className="text-fuchsia-400 text-xs mt-2">Sur vos QR dynamiques</p>
        </GlassCard>

        <GlassCard>
          <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
            Profils actifs
          </p>
          <h3 className="text-2xl md:text-3xl font-black italic">312</h3>
          <p className="text-emerald-400 text-xs mt-2">Campagnes en cours</p>
        </GlassCard>
      </div>
    </section>
  );
}
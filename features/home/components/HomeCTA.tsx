type HomeCTAProps = {
  onAuthClick: () => void;
};

export function HomeCTA({ onAuthClick }: HomeCTAProps) {
  return (
    <section className="py-20 md:py-24 px-5">
      <div className="max-w-5xl mx-auto relative rounded-[2.5rem] bg-gradient-to-br from-cyan-600 to-fuchsia-700 p-1 shadow-2xl transition-transform hover:scale-[1.01] duration-700">
        <div className="bg-[#02040a] rounded-[2.35rem] p-8 md:p-12 text-center space-y-7 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[220px] bg-cyan-500/20 blur-[100px] rounded-full" />
          <h2 className="text-2xl md:text-3xl font-black leading-tight relative z-10 uppercase italic">
            Prêt à numériser <br /> votre monde ?
          </h2>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
            <button
              onClick={onAuthClick}
              className="px-8 py-3 rounded-full bg-white text-black font-black uppercase text-[11px] hover:scale-105 transition-transform"
            >
              Créer mon compte
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
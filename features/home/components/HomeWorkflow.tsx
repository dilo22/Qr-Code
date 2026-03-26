import { stepComponents, steps } from "@/features/home/data/home.data";

type HomeWorkflowProps = {
  activeStep: number;
  progressKey: number;
  autoplayDuration: number;
  isProgressAnimating: boolean;
  onStepClick: (index: number) => void;
};

export function HomeWorkflow({
  activeStep,
  progressKey,
  autoplayDuration,
  isProgressAnimating,
  onStepClick,
}: HomeWorkflowProps) {
  const ActiveStepComponent = stepComponents[activeStep];

  return (
    <section id="workflow" className="relative py-20 md:py-24 px-5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-12 md:mb-16">
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center gap-4">
              
              
            </div>

            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.9]">
              Le parcours <span className="text-cyan-400">créatif</span> <br />
              de votre QR.
            </h2>

            <p className="text-white/40 italic text-sm md:text-base max-w-xl">
              Une démonstration vivante de votre produit : chaque étape prend le
              focus, révèle son interface réelle et raconte le flow de création.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[0.95fr_1.1fr] gap-10 md:gap-12 items-start">
          <div className="space-y-4 relative">
            <div className="absolute left-6 top-8 bottom-8 w-[1px] bg-gradient-to-b from-cyan-500/0 via-cyan-500/20 to-cyan-500/0" />

            {steps.map((step, index) => {
              const isActive = index === activeStep;
              const Icon = step.icon;

              return (
                <div
                  key={step.id}
                  onClick={() => onStepClick(index)}
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
                      <Icon className="w-5 h-5" />
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
                        isActive ? "text-white scale-[1.01]" : "text-white/30"
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

          <div className="lg:sticky lg:top-24 h-[420px] md:h-[520px] flex items-center justify-center">
            <div className="relative w-full h-full">
              <ActiveStepComponent key={activeStep} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
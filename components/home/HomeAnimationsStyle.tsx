export function HomeAnimationsStyle() {
  return (
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
  );
}
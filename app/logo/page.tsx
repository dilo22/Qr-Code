import { QrCode } from "lucide-react";

export default function LogoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-10">
      <div className="flex flex-col items-center gap-10">
        <div className="relative w-72 h-72 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-fuchsia-500 rounded-[3rem] rotate-12" />
          <QrCode className="relative w-40 h-40 text-white" strokeWidth={2.5} />
        </div>

        <div className="text-center">
          <h1 className="text-7xl font-bold tracking-tighter uppercase text-black">
            AETHER<span className="text-cyan-500">QR</span>
          </h1>
        </div>
      </div>
    </div>
  );
}
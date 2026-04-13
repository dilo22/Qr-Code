export function HomeFooter() {
  return (
    <footer className="py-6 md:py-10 border-t border-white/5 bg-[#02040a]">
      <div className="max-w-7xl mx-auto px-5 flex justify-between items-center">
        <span className="text-[10px] font-black tracking-widest opacity-30 uppercase">
          © 2026 MyQR Core Inc.
        </span>

        <div className="flex gap-6 text-[10px] font-black text-white/20 uppercase tracking-widest">
          <a href="#" className="hover:text-cyan-400 transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-cyan-400 transition-colors">
            Terms
          </a>
        </div>
      </div>
    </footer>
  );
}
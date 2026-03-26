type HomeBackgroundProps = {
  mousePos: {
    x: number;
    y: number;
  };
};

export function HomeBackground({ mousePos }: HomeBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <div
        className="absolute w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[120px] transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x / 10 - 300}px, ${mousePos.y / 10 - 300}px)`,
        }}
      />
      <div
        className="absolute right-0 w-[450px] h-[450px] rounded-full bg-purple-600/10 blur-[120px] transition-transform duration-1000 ease-out delay-75"
        style={{
          transform: `translate(${-mousePos.x / 15}px, ${-mousePos.y / 15}px)`,
        }}
      />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
    </div>
  );
}
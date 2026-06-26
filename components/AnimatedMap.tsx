export default function AnimatedMap() {
  return (
    <div className="relative w-full h-[300px] lg:h-[400px] bg-[#f5efe6] overflow-hidden border-y border-line">
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'linear-gradient(to right, #a89f91 1px, transparent 1px), linear-gradient(to bottom, #a89f91 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />

      {/* Abstract Line Map (Stylized Delhi Outline) */}
      <svg className="absolute inset-0 w-full h-full text-stone-300 opacity-[0.35]" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid slice" fill="none" stroke="currentColor" strokeWidth="2">
        {/* Simplified abstract shape resembling a region map with roads */}
        <path d="M 200,100 C 300,50 400,120 450,150 C 550,200 650,150 750,200 L 700,350 C 600,380 500,300 400,350 C 300,400 200,300 100,250 Z" strokeDasharray="8 8" />
        <path d="M 250,150 L 350,250 L 450,200 L 550,300" strokeWidth="1" strokeDasharray="4 4" />
        <path d="M 350,250 L 300,350" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* Pulsing Pins */}
      {/* Pin 1 - Center Black (Main HQ/Marker) */}
      <div className="absolute top-[48%] left-[50%] w-4 h-4 bg-ink rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-md"></div>
      
      {/* Pin 2 - Top Right Red */}
      <div className="absolute top-[28%] left-[67%] w-[14px] h-[14px] bg-[#e84e36] rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10 shadow-sm"></div>
      
      {/* Pin 3 - Bottom Right Red (Pulsing) */}
      <div className="absolute top-[58%] left-[61%] transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e84e36] opacity-30"></span>
          <span className="relative inline-flex rounded-full h-[14px] w-[14px] bg-[#e84e36]"></span>
        </div>
      </div>
      
      {/* Pin 4 - Top Left Red (Pulsing) */}
      <div className="absolute top-[35%] left-[38%] transform -translate-x-1/2 -translate-y-1/2 z-10">
        <div className="relative flex h-10 w-10 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e84e36] opacity-30"></span>
          <span className="relative inline-flex rounded-full h-[14px] w-[14px] bg-[#e84e36]"></span>
        </div>
      </div>

      {/* Label */}
      <div className="absolute bottom-5 left-5 font-mono text-[12px] lg:text-[14px] text-stone-500 tracking-wider z-20">
        [ Delhi map · store pins ]
      </div>
    </div>
  );
}

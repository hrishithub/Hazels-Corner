export function CompanionArt({ stage = "Sprig", large = false }: { stage?: string; large?: boolean }) {
  const isFinal = stage === "Astrafox";
  const isMiddle = stage === "Solari";

  return (
    <div className={`relative mx-auto ${large ? "h-64 w-64" : "h-44 w-44"} animate-floaty`}>
      <div className="absolute inset-x-6 bottom-4 h-8 rounded-full bg-plum/15 blur-md" />
      <div className="absolute left-1/2 top-4 h-32 w-32 -translate-x-1/2 rounded-[42%] bg-gradient-to-br from-butter via-rose to-lilac shadow-glow" />
      <div className="absolute left-[22%] top-4 h-20 w-12 rotate-[-25deg] rounded-[80%_20%_80%_20%] bg-[#8f5f54]" />
      <div className="absolute right-[22%] top-4 h-20 w-12 rotate-[25deg] rounded-[20%_80%_20%_80%] bg-[#8f5f54]" />
      <div className="absolute left-[27%] top-7 h-12 w-7 rotate-[-25deg] rounded-[80%_20%_80%_20%] bg-cream" />
      <div className="absolute right-[27%] top-7 h-12 w-7 rotate-[25deg] rounded-[20%_80%_20%_80%] bg-cream" />
      <div className="absolute left-1/2 top-14 h-28 w-36 -translate-x-1/2 rounded-[48%] bg-gradient-to-br from-[#c88d5f] via-[#e5b078] to-[#fff0be]" />
      <div className="absolute left-[38%] top-[45%] h-3 w-3 rounded-full bg-ink" />
      <div className="absolute right-[38%] top-[45%] h-3 w-3 rounded-full bg-ink" />
      <div className="absolute left-[31%] top-[54%] h-4 w-5 rounded-full bg-rose/70" />
      <div className="absolute right-[31%] top-[54%] h-4 w-5 rounded-full bg-rose/70" />
      <div className="absolute left-1/2 top-[55%] h-2 w-5 -translate-x-1/2 rounded-b-full border-b-2 border-ink/70" />
      <div className="absolute bottom-8 left-5 h-12 w-24 rotate-[-18deg] rounded-full bg-gradient-to-r from-[#a36a4c] to-[#fff0be]" />
      {(isMiddle || isFinal) && (
        <div className="absolute left-[28%] top-1 h-7 w-24 rounded-full border-t-2 border-butter/90 opacity-80" />
      )}
      {isFinal && (
        <>
          <span className="absolute right-5 top-12 h-3 w-3 rounded-full bg-butter shadow-[0_0_22px_8px_rgba(255,231,166,0.55)]" />
          <span className="absolute left-8 top-20 h-2 w-2 rounded-full bg-white shadow-[0_0_18px_6px_rgba(255,255,255,0.5)]" />
        </>
      )}
    </div>
  );
}

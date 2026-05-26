"use client";

export function AmbientParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {Array.from({ length: 26 }).map((_, index) => (
        <span
          className="absolute h-1 w-1 animate-twinkle rounded-full bg-butter/80"
          key={index}
          style={{
            left: `${(index * 17 + 9) % 96}%`,
            top: `${(index * 29 + 12) % 88}%`,
            animationDelay: `${index * 0.23}s`
          }}
        />
      ))}
      {Array.from({ length: 18 }).map((_, index) => (
        <span
          className="absolute h-8 w-px rotate-12 rounded-full bg-[#9cc4ff]/35"
          key={`rain-${index}`}
          style={{
            left: `${(index * 11 + 38) % 78}%`,
            top: `${(index * 13 + 2) % 42}%`,
            animationDelay: `${index * 0.18}s`
          }}
        />
      ))}
    </div>
  );
}

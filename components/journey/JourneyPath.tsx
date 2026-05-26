"use client";

export const worldPath =
  "M8 34 C15 30, 20 37, 27 33 C36 27, 40 25, 48 31 C57 38, 65 30, 75 31 C82 33, 86 42, 81 50 C76 58, 64 56, 58 63 C51 72, 38 61, 29 70 C20 79, 23 91, 35 89 C49 87, 57 78, 68 80 C79 82, 81 71, 88 66";

export function JourneyPath({ progress }: { progress: number }) {
  return (
    <svg className="pointer-events-none absolute inset-0 z-30 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d={worldPath} fill="none" stroke="rgba(255,235,208,.92)" strokeDasharray="1.2 2.4" strokeLinecap="round" strokeWidth="1.35" />
      <path
        d={worldPath}
        fill="none"
        stroke="rgba(255,231,166,.82)"
        strokeDasharray={`${progress * 1.85} 220`}
        strokeLinecap="round"
        strokeWidth="2.1"
      />
    </svg>
  );
}

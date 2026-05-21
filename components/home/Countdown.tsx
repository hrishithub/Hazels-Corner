"use client";

import { useEffect, useState } from "react";
import { getCountdownParts } from "@/lib/time";

export function Countdown() {
  const [parts, setParts] = useState<ReturnType<typeof getCountdownParts> | null>(null);

  useEffect(() => {
    setParts(getCountdownParts());
    const id = window.setInterval(() => setParts(getCountdownParts()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!parts) {
    return (
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {["days", "hours", "mins", "secs"].map((label) => (
          <div className="rounded-2xl bg-white/45 px-2 py-4 text-center" key={label}>
            <p className="font-display text-3xl text-plum sm:text-5xl">--</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/55">{label}</p>
          </div>
        ))}
      </div>
    );
  }

  const entries = [
    ["days", parts.days],
    ["hours", parts.hours],
    ["mins", parts.minutes],
    ["secs", parts.seconds]
  ];

  return (
    <div className="grid grid-cols-4 gap-2 sm:gap-4">
      {entries.map(([label, value]) => (
        <div className="rounded-2xl bg-white/45 px-2 py-4 text-center" key={label}>
          <p className="font-display text-3xl text-plum sm:text-5xl">{String(value).padStart(2, "0")}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-ink/55">{label}</p>
        </div>
      ))}
    </div>
  );
}

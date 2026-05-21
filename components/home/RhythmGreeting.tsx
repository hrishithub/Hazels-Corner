"use client";

import { useEffect, useState } from "react";
import { getIstMood, getRhythmGreeting } from "@/lib/time";

export function RhythmGreeting() {
  const [greeting, setGreeting] = useState(() => getRhythmGreeting("morning"));

  useEffect(() => {
    function syncGreeting() {
      setGreeting(getRhythmGreeting(getIstMood()));
    }

    syncGreeting();
    const id = window.setInterval(syncGreeting, 60_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <p className="mb-3 text-sm uppercase tracking-[0.24em] text-plum/70">{greeting.eyebrow}</p>
      <h1 className="max-w-3xl font-display text-4xl leading-tight text-ink sm:text-6xl">{greeting.title}</h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-ink/68">{greeting.note}</p>
    </>
  );
}

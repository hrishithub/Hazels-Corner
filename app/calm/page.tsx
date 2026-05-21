"use client";

import { useState } from "react";
import { useEffect } from "react";
import { Pause, Play, Wind } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

const phases = ["inhale", "hold", "exhale", "hold"];

export default function CalmPage() {
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setPhase((current) => (current + 1) % phases.length), 4000);
    return () => window.clearInterval(id);
  }, [running]);

  function toggle() {
    setRunning((value) => {
      if (value) {
        setPhase(0);
      }
      return !value;
    });
  }

  return (
    <div className="pb-10">
      <PageHeader eyebrow="calm corner" title="A room for breathing">
        <p>Nothing to optimize. Nothing to prove. Just a little space where the body can remember it is safe.</p>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="glass relative grid min-h-[540px] place-items-center overflow-hidden rounded-[2rem] p-6 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,255,255,0.64),transparent_28%),linear-gradient(180deg,rgba(216,194,255,0.42),rgba(243,180,200,0.24))]" />
          <div className="relative z-10">
            <div className={`mx-auto grid h-64 w-64 place-items-center rounded-full bg-plum/24 shadow-glow ${running ? "animate-breathe" : ""}`}>
              <div className="grid h-44 w-44 place-items-center rounded-full bg-white/48">
                <Wind className="mb-2 h-8 w-8 text-plum" />
                <p className="font-display text-4xl">{running ? phases[phase] : "breathe"}</p>
              </div>
            </div>
            <button
              className="mt-9 inline-flex h-12 items-center gap-2 rounded-full bg-plum px-6 text-sm text-white shadow-soft transition hover:-translate-y-1"
              onClick={toggle}
            >
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause" : "Start"}
            </button>
          </div>
        </section>

        <div className="space-y-5">
          <SoftCard>
            <p className="font-display text-3xl">Box breathing</p>
            <p className="mt-3 text-sm leading-7 text-ink/66">Four seconds in. Four seconds held. Four seconds out. Four seconds held. Let the circle keep time so you do not have to.</p>
          </SoftCard>
          <SoftCard>
            <p className="font-display text-3xl">Grounding</p>
            <p className="mt-3 font-hand text-2xl leading-relaxed text-ink/76">
              Name one thing you can see, one thing touching your skin, and one sound in the room. That is enough for this minute.
            </p>
          </SoftCard>
        </div>
      </div>
    </div>
  );
}

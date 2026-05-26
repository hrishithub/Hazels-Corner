"use client";

import { HeartPulse } from "lucide-react";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";

export function PokemonCenter() {
  const { completedTasks, completionPercent } = useJourneyProgress();
  const message =
    completedTasks === 0
      ? "Professor Oak: Your companion is waiting with you. Begin with one gentle task when you can."
      : completionPercent > 70
        ? "Nurse Joy: Your route lights are warm today. Please rest your eyes too."
        : "Professor Oak: Every small completion is one quiet step closer to Pediatrics.";

  return (
    <section className="glass rounded-[2rem] p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-rose/25 text-plum">
          <HeartPulse className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-plum/70">pokemon center</p>
          <p className="mt-2 font-hand text-2xl leading-relaxed text-ink">{message}</p>
        </div>
      </div>
    </section>
  );
}

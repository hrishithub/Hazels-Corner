"use client";

import {
  Bug,
  Mountain,
  Music4,
  Leaf,
  Zap,
  Sparkles,
  Eye,
  Snowflake
} from "lucide-react";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";

const badges = [
  { name: "Bug Badge", unlockAt: 5, Icon: Bug },
  { name: "Cliff Badge", unlockAt: 18, Icon: Mountain },
  { name: "Rumble Badge", unlockAt: 32, Icon: Music4 },
  { name: "Plant Badge", unlockAt: 46, Icon: Leaf },
  { name: "Voltage Badge", unlockAt: 60, Icon: Zap },
  { name: "Fairy Badge", unlockAt: 78, Icon: Sparkles },
  { name: "Psychic Badge", unlockAt: 92, Icon: Eye },
  { name: "Iceberg Badge", unlockAt: 985, Icon: Snowflake }
];

export function BadgeShelf() {
  const { journeyPercent } = useJourneyProgress();

  return (
    <section className="glass rounded-[2rem] p-5">
      <p className="mb-4 font-display text-3xl text-ink">Badge Shelf</p>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
        {badges.map(({ name, unlockAt, Icon }) => {
          const unlocked = journeyPercent >= unlockAt;
          return (
            <div
              className={`rounded-2xl border p-3 text-center transition ${
                unlocked ? "border-butter/70 bg-white/54 shadow-soft" : "border-white/30 bg-white/18 opacity-60"
              }`}
              key={name}
              title={name}
            >
              <div className={`mx-auto grid h-11 w-11 place-items-center rounded-full ${unlocked ? "bg-butter/55 text-plum" : "bg-dusk/35 text-white/60"}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-2 text-xs leading-4 text-ink/70">{unlocked ? name : "still glowing"}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

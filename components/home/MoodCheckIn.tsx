"use client";

import { useMemo } from "react";
import { Cloud, CloudRain, Heart, Moon, Sparkles } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";
import { getIstDateKey } from "@/lib/time";

const moods = [
  {
    id: "quiet",
    label: "quiet",
    Icon: Cloud,
    response: "that's okay, quiet days are still days."
  },
  {
    id: "heavy",
    label: "heavy",
    Icon: CloudRain,
    response: "heavy days count too, go smaller, not harsher."
  },
  {
    id: "foggy",
    label: "foggy",
    Icon: Moon,
    response: "not every day is meant to be clear."
  },
  {
    id: "soft",
    label: "soft",
    Icon: Heart,
    response: "hold that feeling, it's a good one."
  },
  {
    id: "steady",
    label: "steady",
    Icon: Sparkles,
    response: "look at you."
  }
];

export function MoodCheckIn() {
  const today = getIstDateKey();
  const [moodLog, setMoodLog] = useLocalStorage<Record<string, string>>("hazel:mood-checkins", {});
  const selected = moodLog[today];
  const selectedMood = useMemo(() => moods.find((mood) => mood.id === selected), [selected]);

  return (
    <div className="glass rounded-[1.5rem] p-5">
      <p className="font-display text-2xl">How are you feeling?</p>
      <p className="mt-2 text-sm text-ink/60">No wrong answer here.</p>
      <div className="mt-5 grid grid-cols-5 gap-2">
        {moods.map(({ id, label, Icon }) => {
          const active = selected === id;
          return (
            <button
              aria-label={`Feeling ${label}`}
              aria-pressed={active}
              className={`grid aspect-square place-items-center rounded-2xl transition hover:-translate-y-1 ${
                active ? "bg-plum text-white shadow-soft" : "bg-white/50 text-ink hover:bg-white/80"
              }`}
              key={id}
              onClick={() => setMoodLog({ ...moodLog, [today]: id })}
              title={label}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </div>
      <div className="mt-4 min-h-16 rounded-2xl bg-white/42 p-4">
        <p className="text-xs uppercase tracking-[0.18em] text-plum/70">{selectedMood ? selectedMood.label : "today"}</p>
        <p className="mt-2 text-sm leading-6 text-ink/68">
          {selectedMood ? selectedMood.response : "tap the closest feeling. it stays here just for you."}
        </p>
      </div>
    </div>
  );
}

"use client";

import { Check, Star } from "lucide-react";
import { useLocalStorage } from "@/lib/storage";

export function TinyWin() {
  const today = new Date().toISOString().slice(0, 10);
  const [wins, setWins] = useLocalStorage<Record<string, boolean>>("hazel:tiny-wins", {});
  const done = Boolean(wins[today]);

  return (
    <div className="glass rounded-[1.5rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-2xl">Tiny win today</p>
          <p className="mt-1 text-sm text-ink/62">Even opening the book with honesty counts.</p>
        </div>
        <Star className="h-7 w-7 fill-butter text-butter" />
      </div>
      <button
        className={`inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm shadow-soft transition ${
          done ? "bg-plum text-white" : "bg-white/70 text-plum hover:bg-white"
        }`}
        onClick={() => setWins({ ...wins, [today]: !done })}
      >
        <Check className="h-4 w-4" />
        {done ? "Held gently" : "Mark as win"}
      </button>
    </div>
  );
}

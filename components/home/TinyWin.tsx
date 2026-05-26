"use client";

import { Check, PencilLine, Star } from "lucide-react";
import { FormEvent, useEffect, useState } from "react";
import { useLocalStorage } from "@/lib/storage";
import { getIstDateKey, getPreviousIstDateKey } from "@/lib/time";

type TinyWinEntry = {
  text: string;
  savedAt: string;
};

export function TinyWin() {
  const today = getIstDateKey();
  const yesterday = getPreviousIstDateKey();
  const [wins, setWins] = useLocalStorage<Record<string, TinyWinEntry | boolean>>("hazel:tiny-wins", {});
  const todayWin = wins[today];
  const yesterdayWin = wins[yesterday];
  const savedText = typeof todayWin === "object" ? todayWin.text : "";
  const yesterdayText =
    typeof yesterdayWin === "object" ? yesterdayWin.text : yesterdayWin ? "I showed up gently today." : "";
  const done = Boolean(todayWin);
  const [draft, setDraft] = useState(savedText);

  useEffect(() => {
    setDraft(savedText);
  }, [savedText]);

  function saveWin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim() || "I showed up gently today.";
    setWins({
      ...wins,
      [today]: {
        text,
        savedAt: new Date().toISOString()
      }
    });
  }

  return (
    <div className="glass rounded-[1.5rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="font-display text-2xl">Tiny win today</p>
          <p className="mt-1 text-sm text-ink/62">small win of the day that deserves to be remembered</p>
        </div>
        <Star className="h-7 w-7 fill-butter text-butter" />
      </div>

      <form onSubmit={saveWin}>
        <label className="sr-only" htmlFor="tiny-win">
          Write a tiny win
        </label>
        <div className="flex items-center gap-2 rounded-2xl bg-white/48 px-3 py-2">
          <PencilLine className="h-4 w-4 shrink-0 text-plum" />
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-ink placeholder:text-ink/45 focus:outline-none"
            id="tiny-win"
            maxLength={90}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="leave a small win of the day here..."
            value={draft}
          />
        </div>
        <button
          className={`mt-3 inline-flex h-11 items-center gap-2 rounded-2xl px-4 text-sm shadow-soft transition ${
            done ? "bg-plum text-white" : "bg-white/70 text-plum hover:bg-white"
          }`}
          type="submit"
        >
          <Check className="h-4 w-4" />
          {done ? "Saved softly" : "Keep this win"}
        </button>
      </form>

      {done && (
        <div className="mt-4 rounded-2xl bg-white/38 p-3 text-sm leading-6 text-ink/68">
          <span className="font-medium text-plum">Today you:</span> {savedText || "I showed up gently today."}
        </div>
      )}

      {!done && yesterdayText && (
        <div className="mt-4 rounded-2xl bg-white/38 p-3 text-sm leading-6 text-ink/68">
          <span className="font-medium text-plum">Yesterday, you:</span> {yesterdayText}
        </div>
      )}
    </div>
  );
}

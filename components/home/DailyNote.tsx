"use client";

import { Moon } from "lucide-react";
import { useEffect, useState } from "react";
import dailyMessages from "@/content/dailyMessages.json";
import { getIstDateKey } from "@/lib/time";

function messageIndexForDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  const utcDayNumber = Math.floor(
    Date.UTC(year, month - 1, day) / 86_400_000
  );

  return utcDayNumber % dailyMessages.length;
}

function getMillisecondsUntilNextIstMidnight() {
  const now = new Date();

  // Convert current time to IST
  const utc = now.getTime() + now.getTimezoneOffset() * 60_000;
  const istNow = new Date(utc + 5.5 * 60 * 60 * 1000);

  // Next IST midnight
  const nextMidnight = new Date(istNow);
  nextMidnight.setHours(24, 0, 0, 0);

  return nextMidnight.getTime() - istNow.getTime();
}

export function DailyNote() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: number;

    function updateMessage() {
      setMessage(
        dailyMessages[messageIndexForDate(getIstDateKey())]
      );

      timeoutId = window.setTimeout(
        updateMessage,
        getMillisecondsUntilNextIstMidnight()
      );
    }

    updateMessage();

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex items-start gap-4">
      <span className="rounded-2xl bg-lilac/40 p-3 text-plum">
        <Moon className="h-5 w-5" />
      </span>

      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-plum/70">
          note of the day for Hazel  &hearts;
        </p>

        <p className="mt-3 font-hand text-2xl leading-relaxed text-ink sm:text-3xl">
          {message ?? "A soft note is arriving for today..."}
        </p>
      </div>
    </div>
  );
}
"use client";

import { motion } from "framer-motion";
import { CalendarDays, Sparkles } from "lucide-react";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";
import { PlannerDayColumn } from "@/components/planner/PlannerDayColumn";

export function WeeklyPlanner() {
  const { completionPercent, days, setDays, softXp } = useJourneyProgress();

  return (
    <div className="space-y-5">
      <section className="glass rounded-[2rem] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-lilac/35 text-plum">
              <CalendarDays className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.22em] text-plum/70">weekly planner</p>
              <h1 className="font-display text-4xl text-ink">Soft route planning</h1>
            </div>
          </div>
          <div className="pixel-corners bg-white/58 px-4 py-2 text-sm text-plum">{softXp} XP</div>
        </div>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-sm text-ink/62">
            <span>Route glow</span>
            <span>{completionPercent}% complete</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-white/48">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-rose via-lilac to-butter"
              animate={{ width: `${Math.max(8, completionPercent)}%` }}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-3 2xl:grid-cols-4">
        {days.map((day, index) => (
          <PlannerDayColumn
            day={day}
            key={day.day}
            onChange={(nextDay) => setDays(days.map((item, itemIndex) => (itemIndex === index ? nextDay : item)))}
          />
        ))}
      </section>

      <section className="glass rounded-[2rem] p-5">
        <div className="flex items-start gap-3">
          <Sparkles className="mt-1 h-5 w-5 text-butter" />
          <p className="font-hand text-2xl leading-relaxed text-ink">
            Completing tasks lights the route softly. Missing one does not darken anything.
          </p>
        </div>
      </section>
    </div>
  );
}

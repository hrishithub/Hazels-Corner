"use client";

import { createContext, useContext, useMemo } from "react";
import { useLocalStorage } from "@/lib/storage";
import { journeyTotalDays } from "@/lib/constants";
import { getDaysLeft } from "@/lib/time";

export type PlannerTask = {
  id: string;
  title: string;
  note: string;
  done: boolean;
};

export type PlannerDay = {
  day: string;
  focus: string;
  tasks: PlannerTask[];
};

type JourneyProgressContextValue = {
  days: PlannerDay[];
  setDays: (days: PlannerDay[]) => void;
  completedTasks: number;
  totalTasks: number;
  weeklyCompletionPercent: number;
  weeklyXp: number;
  companionEnergy: number;
  daysLeft: number;
  journeyPercent: number;
  companionStage: 1 | 2 | 3;
};

const defaultDays: PlannerDay[] = [
  {
    day: "Monday",
    focus: "Medicine",
    tasks: [
      { id: "mon-1", title: "Read one high-yield topic", note: "small and honest", done: false },
      { id: "mon-2", title: "Review wrong questions", note: "only patterns, no shame", done: false }
    ]
  },
  { day: "Tuesday", focus: "Surgery", tasks: [{ id: "tue-1", title: "One revision block", note: "steady, not perfect", done: false }] },
  { day: "Wednesday", focus: "OBG", tasks: [{ id: "wed-1", title: "Short notes pass", note: "make the page lighter", done: false }] },
  { day: "Thursday", focus: "Pediatrics", tasks: [{ id: "thu-1", title: "MCQ practice", note: "learn from the misses", done: false }] },
  { day: "Friday", focus: "Pharma", tasks: [{ id: "fri-1", title: "Revise one table", note: "one thing clearer", done: false }] },
  { day: "Saturday", focus: "Mixed", tasks: [{ id: "sat-1", title: "Mock review", note: "data, not verdict", done: false }] },
  { day: "Sunday", focus: "Healing", tasks: [{ id: "sun-1", title: "Gentle catch-up", note: "leave room to breathe", done: false }] }
];

const JourneyProgressContext = createContext<JourneyProgressContextValue | null>(null);

function clamp(value: number) {
  return Math.min(100, Math.max(0, value));
}

export function JourneyProgressProvider({ children }: { children: React.ReactNode }) {
  const [days, setDays] = useLocalStorage<PlannerDay[]>("hazel:weekly-planner", defaultDays);

  const value = useMemo(() => {
    const tasks = days.flatMap((day) => day.tasks);
    const completedTasks = tasks.filter((task) => task.done).length;
    const totalTasks = Math.max(1, tasks.length);
    const weeklyCompletionPercent = Math.round((completedTasks / totalTasks) * 100);
    const daysLeft = getDaysLeft();
    const elapsedDays = journeyTotalDays - daysLeft;
    const journeyPercent = Math.round(clamp((elapsedDays / journeyTotalDays) * 100));
    const weeklyXp = completedTasks * 45 + Math.round(weeklyCompletionPercent * 4);
    const companionEnergy = Math.max(12, weeklyCompletionPercent);
    const companionStage = daysLeft > 60 ? 1 : daysLeft > 30 ? 2 : 3;
    

    return {
      days,
      setDays,
      completedTasks,
      totalTasks,
      weeklyCompletionPercent,
      weeklyXp,
      companionEnergy,
      daysLeft,
      journeyPercent,
      companionStage: companionStage as 1 | 2 | 3
    };
  }, [days, setDays]);

  return <JourneyProgressContext.Provider value={value}>{children}</JourneyProgressContext.Provider>;
}

export function useJourneyProgress() {
  const context = useContext(JourneyProgressContext);
  if (!context) {
    throw new Error("useJourneyProgress must be used inside JourneyProgressProvider");
  }
  return context;
}

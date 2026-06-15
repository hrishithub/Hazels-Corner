import type { PlannerDay, PlannerTask } from "@/components/journey/JourneyProgressContext";

export type WeeklyReportAnalytics = {
  weekRange: {
    weekStart: string;
    weekEnd: string;
  };
  totalTasksCreated: number;
  totalTasksCompleted: number;
  completionPercentage: number;
  dailyBreakdown: Array<{
    day: string;
    focus: string;
    tasksPlanned: number;
    tasksCompleted: number;
    taskTitles: string[];
    taskNotes: string[];
    completedStatus: boolean[];
  }>;
  allTasks: Array<{
    title: string;
    note: string;
    completed: boolean;
    day: string;
  }>;
};

export type WeeklyReportData = {
  overview: {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    summary: string;
    consistencyAnalysis: string;
  };
  strengths: Array<{
    title: string;
    description: string;
  }>;
  improvements: Array<{
    issue: string;
    suggestion: string;
  }>;
  subjectAnalysis: Array<{
    topic: string;
    observation: string;
  }>;
  studyPatterns: {
    strongestDays: string[];
    weakerDays: string[];
    observations: string[];
  };
  recommendations: Array<{
    action: string;
    reason: string;
  }>;
};

export type StoredWeeklyReport = {
  id: string;
  weekStart: string;
  weekEnd: string;
  createdAt: string;
  plannerSnapshot: PlannerDay[];
  reportData: WeeklyReportData;
};

export function getIstDateParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(now);

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value),
    day: Number(parts.find((part) => part.type === "day")?.value)
  };
}

export function formatDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getCurrentIstWeekRange(now = new Date()) {
  const { year, month, day } = getIstDateParts(now);
  const todayUtc = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = todayUtc.getUTCDay();
  const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  const weekStart = new Date(todayUtc);
  weekStart.setUTCDate(todayUtc.getUTCDate() - daysFromMonday);
  const weekEnd = new Date(weekStart);
  weekEnd.setUTCDate(weekStart.getUTCDate() + 6);

  return {
    weekStart: formatDateKey(weekStart),
    weekEnd: formatDateKey(weekEnd),
    isSunday: dayOfWeek === 0
  };
}

export function buildWeeklyAnalytics(days: PlannerDay[], weekRange: { weekStart: string; weekEnd: string }): WeeklyReportAnalytics {
  const allTasks = days.flatMap((day) =>
    day.tasks.map((task: PlannerTask) => ({
      title: task.title,
      note: task.note,
      completed: task.done,
      day: day.day
    }))
  );
  const totalTasksCreated = allTasks.length;
  const totalTasksCompleted = allTasks.filter((task) => task.completed).length;
  const completionPercentage = totalTasksCreated === 0 ? 0 : Math.round((totalTasksCompleted / totalTasksCreated) * 100);

  return {
    weekRange,
    totalTasksCreated,
    totalTasksCompleted,
    completionPercentage,
    dailyBreakdown: days.map((day) => ({
      day: day.day,
      focus: day.focus,
      tasksPlanned: day.tasks.length,
      tasksCompleted: day.tasks.filter((task) => task.done).length,
      taskTitles: day.tasks.map((task) => task.title),
      taskNotes: day.tasks.map((task) => task.note),
      completedStatus: day.tasks.map((task) => task.done)
    })),
    allTasks
  };
}

import { examDate, pokemonStages } from "@/lib/constants";

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

export function getDaysLeft(now = new Date()) {
  const diff = new Date(examDate).getTime() - now.getTime();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export function getCountdownParts(now = new Date()): CountdownParts {
  const total = Math.max(0, new Date(examDate).getTime() - now.getTime());
  const days = Math.floor(total / 86_400_000);
  const hours = Math.floor((total / 3_600_000) % 24);
  const minutes = Math.floor((total / 60_000) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function getMoodByHour(hour: number) {
  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 16) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export function getIstHour(now = new Date()) {
  return Number(
    new Intl.DateTimeFormat("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false
    }).format(now)
  );
}

export function getIstMood(now = new Date()) {
  return getMoodByHour(getIstHour(now));
}

export function getRhythmGreeting(mood: string) {
  if (mood === "morning") {
    return {
      eyebrow: "a quiet corner for the morning you are carrying",
      title: "good morning, Hazel",
      note: "you've been holding it together for so long, just a little longer!"
    };
  }

  if (mood === "afternoon") {
    return {
      eyebrow: "a quiet corner for the middle of the day",
      title: "good afternoon, Hazel",
      note: "you've been holding it together since morning, the day's not done but neither are you!"
    };
  }

  if (mood === "evening") {
    return {
      eyebrow: "a quiet corner for the evening light",
      title: "good evening, Hazel",
      note: "you've been holding it together through another one, you can put it down now, just for a bit."
    };
  }

  return {
    eyebrow: "a quiet corner for the late-night internet",
    title: "good night, Hazel",
    note: "you've been holding it together all day, rest now, tomorrow's still yours!"
  };
}

export function getCompanionStage(daysLeft = getDaysLeft()) {
  return pokemonStages.find((stage) => daysLeft >= stage.minDaysLeft) ?? pokemonStages[pokemonStages.length - 1];
}

"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { badgeMilestones } from "@/components/journey/BadgeShelf";
import { companions } from "@/components/journey/CompanionEvolution";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";
import { routeMilestones } from "@/components/journey/JourneyMap";

type CelebrationType = "route" | "badge" | "evolution";

type CelebrationMilestone = {
  id: string;
  type: CelebrationType;
  title: string;
  message: string;
  image?: string;
};

const celebratedStorageKey = "hazel:celebrated-milestones";

const confettiColors = ["#f6a6c1", "#c8a7ef", "#ffe7a6", "#b8dfc2", "#f8d8c8"];

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function readCelebratedMilestones() {
  try {
    const stored = window.localStorage.getItem(celebratedStorageKey);
    const parsed = stored ? (JSON.parse(stored) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === "string") : [];
  } catch {
    return [];
  }
}

function writeCelebratedMilestones(ids: string[]) {
  try {
    window.localStorage.setItem(celebratedStorageKey, JSON.stringify(Array.from(new Set(ids))));
  } catch {
    // localStorage can fail in private modes; celebrations should never break the app.
  }
}

function getUnlockedMilestones(journeyPercent: number, companionStage: 1 | 2 | 3): CelebrationMilestone[] {
  const unlockedRoutes = routeMilestones
    .filter((route) => journeyPercent >= route.unlockAt && route.unlockAt > 0)
    .map((route) => ({
      id: `route-${slugify(route.name)}`,
      type: "route" as const,
      title: "Congratulations Hazel! Your New Route Unlocked",
      message: `You discovered ${route.name}. ${route.description}.`
    }));

  const unlockedBadges = badgeMilestones
    .filter((badge) => journeyPercent >= badge.unlockAt)
    .map((badge) => ({
      id: `badge-${slugify(badge.name)}`,
      type: "badge" as const,
      title: "Congratulations Hazel! You Earned New Badge",
      message: `You unlocked ${badge.name}.`
    }));

  const unlockedEvolutions = ([2, 3] as const)
    .filter((stage) => companionStage >= stage)
    .map((stage) => ({
      id: `evolution-stage-${stage}`,
      type: "evolution" as const,
      title: "Congratulations",
      message: `Fennekin evolved into ${companions[stage].name.trim()}. Your journey has grown a little further.`,
      image: companions[stage].src
    }));

  return [...unlockedRoutes, ...unlockedBadges, ...unlockedEvolutions];
}

export function MilestoneCelebration() {
  const { companionStage, journeyPercent } = useJourneyProgress();
  const [activeMilestone, setActiveMilestone] = useState<CelebrationMilestone | null>(null);
  const [pendingMilestones, setPendingMilestones] = useState<CelebrationMilestone[]>([]);

  const confetti = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, index) => ({
        id: index,
        color: confettiColors[index % confettiColors.length],
        left: `${(index * 23) % 100}%`,
        delay: (index % 8) * 0.12,
        rotate: (index * 47) % 180,
        width: index % 3 === 0 ? 8 : 6,
        height: index % 2 === 0 ? 14 : 9
      })),
    []
  );

  useEffect(() => {
    const celebrated = readCelebratedMilestones();
    const uncelebrated = getUnlockedMilestones(journeyPercent, companionStage).filter((milestone) => !celebrated.includes(milestone.id));

    if (uncelebrated.length === 0) return;

    const timer = window.setTimeout(() => {
      setPendingMilestones(uncelebrated.slice(1));
      setActiveMilestone(uncelebrated[0]);
      writeCelebratedMilestones([...celebrated, uncelebrated[0].id]);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [companionStage, journeyPercent]);

  useEffect(() => {
    if (!activeMilestone) return;

    const audio = new Audio("/sounds/celebration.mp3");
    audio.volume = 0.8;
    audio.play().catch(() => undefined);

    const closeTimer = window.setTimeout(() => {
      setActiveMilestone(null);
    }, 30000);

    return () => window.clearTimeout(closeTimer);
  }, [activeMilestone]);

  useEffect(() => {
    if (activeMilestone || pendingMilestones.length === 0) return;

    const timer = window.setTimeout(() => {
      const [nextMilestone, ...rest] = pendingMilestones;
      const celebrated = readCelebratedMilestones();
      setPendingMilestones(rest);
      setActiveMilestone(nextMilestone);
      writeCelebratedMilestones([...celebrated, nextMilestone.id]);
    }, 2500);

    return () => window.clearTimeout(timer);
  }, [activeMilestone, pendingMilestones]);

  function closeCelebration() {
    setActiveMilestone(null);
  }

  return (
    <AnimatePresence>
      {activeMilestone && (
        <motion.div
          aria-modal="true"
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-[#2b1f35]/42 px-4 py-8 backdrop-blur-sm"
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          role="dialog"
        >
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {confetti.map((piece) => (
              <motion.span
                className="absolute top-[-24px] rounded-full"
                key={piece.id}
                style={{
                  backgroundColor: piece.color,
                  height: piece.height,
                  left: piece.left,
                  rotate: piece.rotate,
                  width: piece.width
                }}
                initial={{ opacity: 0, y: -20, rotate: piece.rotate }}
                animate={{ opacity: [0, 1, 1, 0], y: "112vh", rotate: piece.rotate + 220 }}
                transition={{ delay: piece.delay, duration: 8, ease: "easeOut" }}
              />
            ))}
          </div>

          <motion.section
            className="glass relative w-full max-w-md overflow-hidden rounded-[2rem] border border-white/70 p-6 text-center shadow-soft sm:p-8"
            exit={{ opacity: 0, scale: 0.96, y: 14 }}
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 180, damping: 18 }}
          >
            <button
              aria-label="Close celebration"
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/50 text-ink/60 transition hover:bg-white/75"
              onClick={closeCelebration}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>

            <motion.div
              className="mx-auto grid h-16 w-16 place-items-center rounded-[1.35rem] bg-butter/55 text-plum shadow-soft"
              animate={{ y: [0, -8, 0], rotate: [0, -4, 4, 0] }}
              transition={{ duration: 1.6, repeat: 2, ease: "easeInOut" }}
            >
              {activeMilestone.image ? (
                <Image alt="" className="pixelated" height={48} src={activeMilestone.image} width={48} />
              ) : (
                <Sparkles className="h-7 w-7" />
              )}
            </motion.div>

            <p className="mt-5 text-xs uppercase tracking-[0.24em] text-plum/70">{activeMilestone.type} milestone</p>
            <h2 className="mt-2 font-display text-3xl leading-tight text-ink sm:text-4xl">{activeMilestone.title}</h2>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-7 text-ink/70">{activeMilestone.message}</p>
            <div className="mx-auto mt-6 h-1.5 w-32 overflow-hidden rounded-full bg-white/55">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-rose via-lilac to-butter" initial={{ width: "0%" }} animate={{ width: "100%" }} transition={{ duration: 30 }} />
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

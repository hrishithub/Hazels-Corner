"use client";

import { motion } from "framer-motion";
import { Lock, MapPin } from "lucide-react";

export type RouteCheckpointData = {
  name: string;
  description: string;
  x: number;
  y: number;
  unlockAt: number;
  weather: "forest" | "rain" | "center" | "night" | "spark" | "mountain" | "gym";
};

export function RouteCheckpoint({
  checkpoint,
  active,
  unlocked
}: {
  checkpoint: RouteCheckpointData;
  active: boolean;
  unlocked: boolean;
}) {
  return (
    <motion.div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${checkpoint.x}%`, top: `${checkpoint.y}%` }}
      animate={active ? { y: [0, -5, 0] } : undefined}
      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <div
        className={`pixel-corners relative min-w-36 border px-3 py-2 text-center shadow-soft ${
          unlocked ? "border-butter/70 bg-cream/86" : "border-white/35 bg-dusk/72 text-cream"
        } ${active ? "ring-4 ring-butter/45" : ""}`}
      >
        <div className="mx-auto mb-1 grid h-8 w-8 place-items-center rounded-full bg-white/70 text-plum">
          {unlocked ? <MapPin className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
        </div>
        <p className="text-xs font-semibold uppercase tracking-[0.08em]">{checkpoint.name}</p>
        <p className="mt-1 text-[11px] opacity-70">{checkpoint.description}</p>
      </div>
    </motion.div>
  );
}

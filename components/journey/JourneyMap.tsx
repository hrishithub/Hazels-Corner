"use client";

import { motion } from "framer-motion";
import { RouteCheckpoint, RouteCheckpointData } from "@/components/journey/RouteCheckpoint";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";

const checkpoints: RouteCheckpointData[] = [
  { name: "Quiet Forest", description: "begin gently", x: 16, y: 27, unlockAt: 0, weather: "forest" },
  { name: "Rainy Route", description: "keep walking", x: 39, y: 35, unlockAt: 15, weather: "rain" },
  { name: "Pokemon Center", description: "rest counts", x: 67, y: 24, unlockAt: 30, weather: "center" },
  { name: "Late Night Library", description: "soft focus", x: 25, y: 65, unlockAt: 44, weather: "night" },
  { name: "Final Stretch", description: "small brave steps", x: 61, y: 63, unlockAt: 62, weather: "spark" },
  { name: "Victory Road", description: "steady heart", x: 28, y: 86, unlockAt: 78, weather: "mountain" },
  { name: "Pediatrics Gym", description: "gentle courage", x: 78, y: 84, unlockAt: 92, weather: "gym" }
];

function interpolatePosition(progress: number) {
  const segment = Math.min(checkpoints.length - 1, Math.floor((progress / 100) * (checkpoints.length - 1)));
  const current = checkpoints[segment];
  const next = checkpoints[Math.min(checkpoints.length - 1, segment + 1)];
  const local = ((progress / 100) * (checkpoints.length - 1)) % 1;
  return {
    x: current.x + (next.x - current.x) * local,
    y: current.y + (next.y - current.y) * local
  };
}

export function JourneyMap() {
  const { journeyPercent } = useJourneyProgress();
  const player = interpolatePosition(journeyPercent);

  return (
    <section className="glass relative min-h-[660px] overflow-hidden rounded-[2rem] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-plum/70">the journey map</p>
          <h2 className="font-display text-3xl text-ink">Gentle route to becoming a doctor</h2>
        </div>
        <div className="pixel-corners bg-white/60 px-4 py-2 text-sm text-plum">{journeyPercent}% travelled</div>
      </div>

      <div className="pixel-corners relative h-[560px] overflow-hidden border border-white/60 bg-[#d8d5f3] shadow-soft">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(89,143,105,0.75)_0_8%,transparent_9%),radial-gradient(circle_at_70%_20%,rgba(246,128,116,0.55)_0_8%,transparent_9%),radial-gradient(circle_at_25%_64%,rgba(34,34,76,0.65)_0_12%,transparent_13%),radial-gradient(circle_at_76%_78%,rgba(234,238,255,0.85)_0_10%,transparent_11%),linear-gradient(135deg,#b9d7c5,#b8c5e9_45%,#7a5f99)]" />
        <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.25)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.25)_1px,transparent_1px)] [background-size:28px_28px]" />
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path
            d="M16 27 C28 22, 29 36, 39 35 S56 31, 67 24 C75 31, 69 50, 61 63 S42 61, 25 65 C20 75, 21 85, 28 86 S62 89, 78 84"
            fill="none"
            stroke="rgba(255,242,230,.92)"
            strokeDasharray="2 2"
            strokeWidth="1.5"
          />
          <path
            d="M16 27 C28 22, 29 36, 39 35 S56 31, 67 24 C75 31, 69 50, 61 63 S42 61, 25 65 C20 75, 21 85, 28 86 S62 89, 78 84"
            fill="none"
            stroke="rgba(255,231,166,.75)"
            strokeDasharray={`${journeyPercent * 1.65} 200`}
            strokeLinecap="round"
            strokeWidth="2.4"
          />
        </svg>

        {checkpoints.map((checkpoint, index) => {
          const unlockAt = checkpoint.unlockAt;
          const unlocked = journeyPercent >= unlockAt;
          const nextUnlock = checkpoints[index + 1]?.unlockAt ?? 101;
          const active = journeyPercent >= unlockAt && journeyPercent < nextUnlock;
          return <RouteCheckpoint active={active} checkpoint={checkpoint} key={checkpoint.name} unlocked={unlocked} />;
        })}

        <motion.div
          className="absolute z-20 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-4 border-white bg-plum text-2xl shadow-glow"
          style={{ left: `${player.x}%`, top: `${player.y}%` }}
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.8, repeat: Infinity }}
        >
          <span className="text-base">H</span>
        </motion.div>
      </div>
    </section>
  );
}

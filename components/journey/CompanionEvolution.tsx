"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";

export const companions = {
  1: { name: "Fennekin", src: "/companions/stage1.png", line: "A playful fire fox with oversized ears and a spark of curiosity!" },
  2: { name: "Braixen", src: "/companions/stage2.png", line: "A clever wand-wielding fox that fights like a young magician!" },
  3: { name: "Delphox ", src: "/companions/stage3.png", line: "A mystical fire mage whose flames burn with wisdom and power!" }
};

export function CompanionEvolution() {
  const { companionEnergy, companionStage, weeklyXp } = useJourneyProgress();
  const companion = companions[companionStage];

  return (
    <section className="glass rounded-[2rem] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-plum/70">your companion</p>
          <h2 className="font-display text-3xl text-ink">{companion.name}</h2>
          <p className="mt-1 text-sm text-ink/62">{companion.line}</p>
        </div>
        <Sparkles className="h-6 w-6 text-butter" />
      </div>

      <motion.div
        className="mx-auto mt-5 grid h-44 w-44 place-items-center rounded-[2rem] bg-white/42 shadow-soft"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image alt={companion.name} className="pixelated" height={132} src={companion.src} width={132} />
      </motion.div>

      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.16em] text-ink/55">
          <span>soft XP</span>
          <span>{weeklyXp} weekly XP</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/48">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-rose via-lilac to-butter" animate={{ width: `${companionEnergy}%` }} />
        </div>
        <p className="mt-3 text-sm leading-6 text-ink/62">
             Your companion grows alongside the journey.
        </p>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-center text-xs">
        {[1, 2, 3].map((stage) => (
          <div className={`rounded-2xl p-3 ${stage === companionStage ? "bg-plum text-white" : "bg-white/40 text-ink/62"}`} key={stage}>
            Stage {stage}
          </div>
        ))}
      </div>
    </section>
  );
}

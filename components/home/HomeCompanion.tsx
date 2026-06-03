"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";

const companions = {
  1: { name: "Fennekin", src: "/companions/stage1.png", line: "A playful fire fox with oversized ears and a spark of curiosity!" },
  2: { name: "Braixen", src: "/companions/stage2.png", line: "A clever wand-wielding fox that fights like a young magician!" },
  3: { name: "Delphox", src: "/companions/stage3.png", line: "A mystical fire mage whose flames burn with wisdom and power!" }
};

export function HomeCompanion() {
  const { companionEnergy, companionStage } = useJourneyProgress();
  const companion = companions[companionStage];

  return (
    <div className="glass flex h-full flex-col items-center justify-center overflow-hidden rounded-[1.5rem] p-5 text-center sm:p-6">
      <div className="mb-3 flex items-center gap-2 text-sm uppercase tracking-[0.18em] text-plum/70">
        <Sparkles className="h-4 w-4 text-butter" />
        companion
      </div>
      <motion.div
        className="grid h-44 w-44 place-items-center rounded-[2rem] bg-white/42 shadow-soft"
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        <Image alt={companion.name} className="pixelated" height={132} src={companion.src} width={132} />
      </motion.div>
      <p className="mt-5 font-display text-3xl text-ink">{companion.name}</p>
      <p className="mt-1 text-sm text-ink/60">{companion.line}</p>
      <div className="mt-5 h-3 w-full max-w-64 overflow-hidden rounded-full bg-white/48">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-rose via-lilac to-butter"
          animate={{ width: `${companionEnergy}%` }}
        />
      </div>
    </div>
  );
}

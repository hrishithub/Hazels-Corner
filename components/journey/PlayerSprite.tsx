"use client";

import { motion } from "framer-motion";

export function PlayerSprite({ x, y }: { x: number; y: number }) {
  return (
    <motion.div
      className="absolute z-40 -translate-x-1/2 -translate-y-full"
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ duration: 1.2, ease: "easeInOut" }}
    >
      <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.1, repeat: Infinity }}>
        <div className="relative h-14 w-10">
          <div className="absolute left-2 top-0 h-5 w-6 rounded-t-full bg-[#3b244f]" />
          <div className="absolute left-3 top-4 h-4 w-4 rounded-sm bg-[#f0b79f]" />
          <div className="absolute left-1 top-8 h-5 w-8 rounded-sm bg-[#fff2e6]" />
          <div className="absolute left-0 top-10 h-3 w-3 bg-rose" />
          <div className="absolute right-0 top-10 h-3 w-3 bg-rose" />
          <div className="absolute left-2 top-13 h-2 w-2 bg-dusk" />
          <div className="absolute right-2 top-13 h-2 w-2 bg-dusk" />
          <div className="absolute -right-2 top-8 h-5 w-3 rounded bg-plum" />
        </div>
      </motion.div>
    </motion.div>
  );
}

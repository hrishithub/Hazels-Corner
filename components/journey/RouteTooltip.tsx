"use client";

import { motion } from "framer-motion";

export function RouteTooltip({
  active,
  description,
  icon,
  name,
  revealed,
  x,
  y
}: {
  active: boolean;
  description: string;
  icon: string;
  name: string;
  revealed: boolean;
  x: number;
  y: number;
}) {
  return (
    <motion.div
      className={`absolute z-50 w-44 -translate-x-1/2 pixel-corners border px-4 py-3 shadow-soft ${
        active ? "border-butter/80 bg-[#151d34]/92 text-cream" : "border-white/30 bg-[#151d34]/72 text-cream/80"
      } ${revealed ? "" : "opacity-45"}`}
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={active ? { y: [0, -5, 0] } : undefined}
      transition={{ duration: 2.2, repeat: Infinity }}
    >
      <p className="font-display text-lg leading-5">{name}</p>
      <p className="mt-2 text-xs leading-5">
        <span className="mr-2">{icon}</span>
        {description}
      </p>
    </motion.div>
  );
}

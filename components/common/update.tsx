"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const MESSAGE =
  "✨ Weekly AI Study Reports are now available 📊 Check the PDF on Discord for more details ✨";

const START_TIME = new Date("2026-06-16T00:00:00+05:30").getTime();

const SHOW_FOR = 24 * 60 * 60 * 1000;

export function UpdateBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const expired = Date.now() - START_TIME > SHOW_FOR;

    if (!expired) {
      setShow(true);
    }
  }, []);

  if (!show) return null;

  return (
   
  <div
    className="
      fixed top-0 left-0 z-[9999]
      flex h-9 w-full items-center
      overflow-hidden
      bg-white/60
      backdrop-blur-xl
      border-b border-white/40
    "
  >

    <motion.div
      className="
        absolute
        whitespace-nowrap
        text-sm
        text-plum
        font-medium
      "
      initial={{
        left: "100%"
      }}
      animate={{
        left: "-100%"
      }}
      transition={{
        repeat: Infinity,
        duration: 18,
        ease: "linear"
      }}
    >
      {MESSAGE}
    </motion.div>

  </div>

  );
}
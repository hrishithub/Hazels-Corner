"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Mail, X } from "lucide-react";
import { useState } from "react";
import openWhen from "@/content/openWhen.json";
import { PageHeader } from "@/components/ui/PageHeader";

type Letter = (typeof openWhen)[number];

export default function OpenWhenPage() {
  const [active, setActive] = useState<Letter | null>(null);

  return (
    <div className="pb-10">
      <PageHeader eyebrow="open when" title="For the days that need a softer door">
        <p>Small letters for specific storms. They are not here to motivate you loudly, just to sit beside you for a minute.</p>
      </PageHeader>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {openWhen.map((letter, index) => (
          <motion.button
            className="glass group min-h-48 rounded-[1.5rem] p-5 text-left transition hover:-translate-y-1"
            key={letter.slug}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            onClick={() => setActive(letter)}
          >
            <span className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/55 text-plum">
              <Mail className="h-5 w-5" />
            </span>
            <p className="font-display text-2xl text-ink">{letter.title}</p>
            <p className="mt-3 text-sm leading-6 text-ink/62">{letter.preview}</p>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-ink/35 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.article
              className="paper relative max-h-[88vh] w-full max-w-2xl overflow-auto rounded-[2rem] border border-white/70 p-6 shadow-glow sm:p-9"
              initial={{ scale: 0.96, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 24 }}
            >
              <button
                className="absolute right-4 top-4 rounded-full bg-white/70 p-2 text-ink/60"
                onClick={() => setActive(null)}
                aria-label="Close letter"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="mb-2 text-sm uppercase tracking-[0.22em] text-plum/70">for this moment</p>
              <h2 className="font-display text-3xl text-ink sm:text-5xl">{active.title}</h2>
              <div className="mt-6 space-y-5 text-base leading-8 text-ink/76">
                {active.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              <div className="mt-7 rounded-2xl bg-white/54 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-plum/70">tiny action</p>
                <p className="mt-2 font-hand text-2xl text-ink">{active.tinyAction}</p>
              </div>
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

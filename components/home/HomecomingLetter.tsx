"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { ReactNode } from "react";

function renderInlineMarkdown(text: string) {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) nodes.push(text.slice(lastIndex, match.index));

    const token = match[0];
    nodes.push(token.startsWith("**")
      ? <strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>
      : <em key={`${match.index}-em`}>{token.slice(1, -1)}</em>);
    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
}

function renderMarkdown(markdown: string) {
  return markdown.trim().split(/\n{2,}/).map((block, index) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      return <h2 className="font-display text-3xl text-ink sm:text-4xl" key={index}>{renderInlineMarkdown(trimmed.slice(3))}</h2>;
    }
    if (trimmed.startsWith("# ")) {
      return <h1 className="font-display text-4xl text-ink sm:text-5xl" key={index}>{renderInlineMarkdown(trimmed.slice(2))}</h1>;
    }
    return (
      <p className="whitespace-pre-line text-base leading-8 text-ink/76 sm:text-lg sm:leading-9" key={index}>
        {trimmed.split("\n").map((line, lineIndex) => (
          <span key={lineIndex}>{lineIndex > 0 && <br />}{renderInlineMarkdown(line)}</span>
        ))}
      </p>
    );
  });
}

export function HomecomingLetter({ markdown }: { markdown: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [portalRoot, setPortalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalRoot(document.body);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  return (
    <>
      <button
        aria-label="Open your letter"
        className="group relative mt-7 block h-36 w-full max-w-2xl overflow-hidden rounded-[1.5rem] border border-[#d8bfd1] bg-[#f7e9ee] shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum/60 sm:h-44"
        onClick={() => setIsOpen(true)}
        type="button"
        aria-haspopup="dialog"
      >
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-[#fff8f0] via-[#f8e9ef] to-[#f0e8f5]" />
        <span
          aria-hidden="true"
          className="absolute inset-0 origin-top bg-gradient-to-br from-[#f3dfe8] to-[#ead9e9] transition-transform duration-300 group-hover:scale-y-[0.96]"
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 68%)" }}
        />
        <span aria-hidden="true" className="absolute left-1/2 top-[62%] grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/80 bg-[#8b5b96] text-white shadow-soft transition-transform duration-300 group-hover:scale-110">
          <Heart className="h-4 w-4 fill-white" />
        </span>
      </button>

      {portalRoot && createPortal(
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="fixed inset-0 z-[100] grid min-h-[100dvh] place-items-center bg-[#f5eaf1]/[0.98] p-3 backdrop-blur-2xl sm:p-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) setIsOpen(false);
              }}
            >
              <motion.article
                aria-labelledby="homecoming-letter-title"
                aria-modal="true"
                className="glass relative max-h-[88dvh] w-full max-w-2xl overflow-y-auto rounded-[1.75rem] border border-white/80 bg-white/75 p-6 shadow-glow sm:p-10"
                initial={{ opacity: 0, y: 12, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.99 }}
                role="dialog"
                transition={{ duration: 0.24, ease: "easeOut" }}
              >
                <button
                  aria-label="Close letter"
                  className="absolute right-4 top-4 z-10 inline-flex h-10 items-center gap-1.5 rounded-full border border-plum/15 bg-white/95 px-3 text-sm font-medium text-ink shadow-soft transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-plum/60"
                  onClick={() => setIsOpen(false)}
                  type="button"
                >
                  <X className="h-4 w-4" />
                  <span>Close</span>
                </button>
                <div className="mb-6 pr-20 text-xs uppercase tracking-[0.24em] text-plum/70" id="homecoming-letter-title">
                  A letter for Hazel
                </div>
                <div className="space-y-5">{renderMarkdown(markdown)}</div>
              </motion.article>
            </motion.div>
          )}
        </AnimatePresence>,
        portalRoot
      )}
    </>
  );
}

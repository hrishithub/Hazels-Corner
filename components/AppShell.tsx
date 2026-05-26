"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, CalendarDays, Heart, Home, Mail, Music, Sparkles, Wind } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { navItems } from "@/lib/constants";
import { getIstMood } from "@/lib/time";

const icons = [Home, Mail, Music, Sparkles, CalendarDays, BookOpen, Wind];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mood, setMood] = useState("day");

  useEffect(() => {
    function syncMood() {
      const currentMood = getIstMood();
      setMood(currentMood);
      document.body.dataset.mood = currentMood;
    }

    syncMood();
    const id = window.setInterval(syncMood, 60_000);
    return () => window.clearInterval(id);
  }, []);

  const greeting = useMemo(() => {
    if (mood === "morning") return "good morning";
    if (mood === "afternoon") return "soft afternoon";
    if (mood === "evening") return "soft evening";
    if (mood === "night") return "late-night corner";
    return "hello, Hazel";
  }, [mood]);

  return (
    <div className={mood === "night" ? "night" : ""}>
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[8%] top-[8%] h-56 w-56 rounded-full bg-rose/30 blur-3xl" />
        <div className="absolute bottom-[8%] right-[10%] h-64 w-64 rounded-full bg-lilac/30 blur-3xl" />
        {Array.from({ length: 18 }).map((_, index) => (
          <span
            className="absolute h-1 w-1 animate-twinkle rounded-full bg-white/80"
            key={index}
            style={{
              left: `${(index * 37) % 100}%`,
              top: `${(index * 19) % 95}%`,
              animationDelay: `${index * 0.3}s`
            }}
          />
        ))}
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1480px] flex-col gap-4 p-3 sm:p-5 lg:flex-row lg:p-6">
        <aside className="glass sticky top-3 z-20 flex items-center justify-between rounded-[1.5rem] px-4 py-3 lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-64 lg:flex-col lg:items-stretch lg:px-5 lg:py-6">
          <Link href="/" className="min-w-0">
            <p className="font-hand text-2xl text-plum lg:text-3xl">Hazel&apos;s Corner</p>
            <p className="hidden text-xs text-ink/60 lg:block dark:text-white/70">yours, always</p>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto lg:mt-8 lg:flex-col lg:items-stretch lg:gap-2">
            {navItems.map((item, index) => {
              const Icon = icons[index];
              const active = pathname === item.href;
              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={`flex h-11 shrink-0 items-center gap-3 rounded-2xl px-3 text-sm transition ${
                    active ? "bg-white/68 text-plum shadow-soft" : "text-ink/70 hover:bg-white/38"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline lg:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="hidden rounded-3xl border border-white/50 bg-white/34 p-4 text-sm text-ink/70 lg:block">
            <Heart className="mb-3 h-4 w-4 fill-rose text-rose" />
   Just be yourself, there is no one better 
          </div>
        </aside>

        <main className="min-w-0 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16, rotateX: 2 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.45, ease: "easeOut" }}
              className="min-h-[calc(100vh-2rem)]"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

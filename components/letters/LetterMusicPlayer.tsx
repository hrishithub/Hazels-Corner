"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

type LetterMusicPlayerProps = {
  songName: string;
  artistName: string;
  audioSrc: string;
  coverSrc?: string;
  note: string;
  triggerId: string;
  containerId: string;
  autoPlay?: boolean;
};

function Equalizer() {
  return (
    <span aria-hidden="true" className="flex h-5 items-end gap-0.5">
      {[0, 1, 2].map((bar) => (
        <span
          className="w-1 rounded-full bg-plum/75"
          key={bar}
          style={{
            animation: "letter-eq 0.9s ease-in-out infinite",
            animationDelay: `${bar * 0.16}s`
          }}
        />
      ))}
    </span>
  );
}

export function LetterMusicPlayer({ artistName, audioSrc, autoPlay = false, coverSrc, containerId, note, songName, triggerId }: LetterMusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const userPausedRef = useRef(false);
  const interactionAttemptedRef = useRef(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [coverAvailable, setCoverAvailable] = useState(Boolean(coverSrc));
  const [containerBounds, setContainerBounds] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = 0;
      audio.loop = true;
    }

    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  useEffect(() => {
    setCoverAvailable(Boolean(coverSrc));
  }, [coverSrc]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !autoPlay) return;

    audio.currentTime = 0;
    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [autoPlay]);

  useEffect(() => {
    if (!autoPlay) return;

    async function playAfterFirstInteraction() {
      if (interactionAttemptedRef.current || userPausedRef.current) return;
      interactionAttemptedRef.current = true;

      const audio = audioRef.current;
      if (!audio || !audio.paused) return;

      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }

    const events: Array<keyof WindowEventMap> = ["pointerdown", "touchstart", "keydown", "scroll"];
    events.forEach((eventName) => {
      window.addEventListener(eventName, playAfterFirstInteraction, { once: true, passive: true });
    });

    return () => {
      events.forEach((eventName) => {
        window.removeEventListener(eventName, playAfterFirstInteraction);
      });
    };
  }, [autoPlay]);

  useEffect(() => {
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.45
      }
    );

    observer.observe(trigger);
    return () => observer.disconnect();
  }, [triggerId]);

  useEffect(() => {
    function syncContainerBounds() {
      const container = document.getElementById(containerId);
      if (!container) return;

      const rect = container.getBoundingClientRect();
      setContainerBounds({ left: rect.left, width: rect.width });
    }

    syncContainerBounds();
    window.addEventListener("resize", syncContainerBounds);
    window.addEventListener("scroll", syncContainerBounds, { passive: true });
    return () => {
      window.removeEventListener("resize", syncContainerBounds);
      window.removeEventListener("scroll", syncContainerBounds);
    };
  }, [containerId]);

  async function togglePlayback() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        userPausedRef.current = false;
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      userPausedRef.current = true;
      audio.pause();
      setIsPlaying(false);
    }
  }

  function syncProgress() {
    const audio = audioRef.current;
    if (!audio?.duration) {
      setProgress(0);
      return;
    }
    setProgress(Math.min(100, Math.max(0, (audio.currentTime / audio.duration) * 100)));
  }

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-none fixed bottom-0 z-40 px-3 pb-3 sm:px-5 sm:pb-5"
            exit={{ opacity: 0, y: 18 }}
            initial={{ opacity: 0, y: 18 }}
            style={{
              left: containerBounds.width > 0 ? containerBounds.left : 0,
              width: containerBounds.width > 0 ? containerBounds.width : "100%"
            }}
            transition={{ duration: 0.35, ease: "easeOut" }}
          >
            <div className="pointer-events-auto mx-auto w-full max-w-[34rem]">
              <div className="glass rounded-[1.35rem] border border-white/70 p-3 shadow-soft sm:p-4">
                <div className="flex items-center gap-3">
                  <div className="relative grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-rose/45 via-lilac/45 to-butter/45 shadow-soft sm:h-14 sm:w-14">
                    {coverSrc && coverAvailable ? (
                      <Image alt="" className="object-cover" fill onError={() => setCoverAvailable(false)} sizes="56px" src={coverSrc} />
                    ) : (
                      <span className="font-hand text-xl text-plum">♪</span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className="truncate text-sm font-medium text-ink sm:text-base">{songName}</p>
                      {isPlaying && <Equalizer />}
                    </div>
                    <p className="mt-0.5 truncate text-xs text-ink/58 sm:text-sm">{artistName}</p>
                  </div>

                  <button
                    aria-label={isPlaying ? "Pause letter music" : "Play letter music"}
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-plum text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-mauve"
                    onClick={togglePlayback}
                    type="button"
                  >
                    {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="ml-0.5 h-4 w-4 fill-current" />}
                  </button>
                </div>

                <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/55">
                  <div className="h-full rounded-full bg-gradient-to-r from-rose via-lilac to-plum transition-[width]" style={{ width: `${progress}%` }} />
                </div>
              </div>

              <p className="mt-2 truncate px-3 text-center font-hand text-sm text-ink/62 sm:text-base">{note}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <audio
        loop
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        onTimeUpdate={syncProgress}
        preload="metadata"
        ref={audioRef}
        src={audioSrc}
      />

      <style jsx>{`
        @keyframes letter-eq {
          0%,
          100% {
            height: 0.35rem;
          }
          50% {
            height: 1.15rem;
          }
        }
      `}</style>
    </>
  );
}

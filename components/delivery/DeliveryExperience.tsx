"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, PackageOpen } from "lucide-react";
import { deliveryAssets, deliveryStorageKey, isDeliveryAvailable, parseDeliveryState } from "@/lib/delivery";

type DeliveryStep = "checking" | "intro" | "open" | "coffee" | "journey" | "expired";

function DeliveryVideo({
  label,
  muted,
  onEnded,
  playSignal,
  src
}: {
  label: string;
  muted?: boolean;
  onEnded: () => void;
  playSignal: number;
  src: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const lastSafeTimeRef = useRef(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || playSignal === 0) return;

    video.currentTime = 0;
    lastSafeTimeRef.current = 0;
    video.play().catch(() => undefined);
  }, [playSignal]);

  return (
    <video
      aria-label={label}
      className="aspect-video w-full rounded-[1.5rem] bg-night/20 object-contain shadow-soft"
      controls={false}
      controlsList="nodownload nofullscreen noplaybackrate"
      disablePictureInPicture
      muted={muted}
      onContextMenu={(event) => event.preventDefault()}
      onEnded={onEnded}
      onSeeking={(event) => {
        const video = event.currentTarget;
        if (Math.abs(video.currentTime - lastSafeTimeRef.current) > 0.75) {
          video.currentTime = lastSafeTimeRef.current;
        }
      }}
      onTimeUpdate={(event) => {
        lastSafeTimeRef.current = event.currentTarget.currentTime;
      }}
      playsInline
      preload="auto"
      ref={videoRef}
      src={src}
    />
  );
}

export function DeliveryExperience() {
  const router = useRouter();
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const [step, setStep] = useState<DeliveryStep>("checking");
  const [introSignal, setIntroSignal] = useState(0);
  const [coffeeSignal, setCoffeeSignal] = useState(0);

  useEffect(() => {
    const state = parseDeliveryState(window.localStorage.getItem(deliveryStorageKey));
    if (!isDeliveryAvailable(state)) {
      setStep("expired");
      return;
    }

    musicRef.current = new Audio(deliveryAssets.backgroundMusic);
    musicRef.current.loop = true;
    musicRef.current.preload = "auto";
    musicRef.current.volume = 0.45;

    setStep("intro");
    setIntroSignal((value) => value + 1);

    return () => {
      if (musicRef.current) {
        musicRef.current.pause();
        musicRef.current.currentTime = 0;
      }
    };
  }, []);

  function startCoffeeVideo() {
    setStep("coffee");
    window.setTimeout(() => setCoffeeSignal((value) => value + 1), 120);
  }

  function finishCoffeeVideo() {
    musicRef.current?.play().catch(() => undefined);
    setStep("journey");
  }

  function beginJourney() {
    if (musicRef.current) {
      musicRef.current.pause();
      musicRef.current.currentTime = 0;
    }

    window.localStorage.setItem(
      deliveryStorageKey,
      JSON.stringify({
        completed: true,
        completedAt: Date.now()
      })
    );

    window.dispatchEvent(new Event("hazel-delivery-updated"));
    router.push("/");
  }

  if (step === "checking") {
    return (
      <main className="grid min-h-screen place-items-center px-4">
        <div className="glass rounded-[2rem] px-6 py-5 text-sm text-ink/70">Preparing the delivery...</div>
      </main>
    );
  }

  if (step === "expired") {
    return (
      <main className="grid min-h-screen place-items-center px-4 py-8">
        <section className="glass max-w-md rounded-[2rem] p-7 text-center shadow-soft">
          <PackageOpen className="mx-auto mb-4 h-9 w-9 text-plum" />
          <h1 className="font-display text-4xl text-ink">Delivery completed</h1>
          <p className="mt-3 text-sm leading-7 text-ink/66">This little one-time corner has already been opened.</p>
          <button className="mt-6 rounded-2xl bg-plum px-5 py-3 text-sm text-white shadow-soft" onClick={() => router.push("/")} type="button">
            Back home
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-4 py-6 sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[12%] top-[12%] h-56 w-56 rounded-full bg-rose/30 blur-3xl" />
        <div className="absolute bottom-[10%] right-[10%] h-72 w-72 rounded-full bg-lilac/35 blur-3xl" />
        <div className="absolute left-[48%] top-[58%] h-48 w-48 rounded-full bg-butter/30 blur-3xl" />
      </div>

      <section className="glass relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/65 p-4 shadow-soft sm:p-6">
        <div className="mb-4 text-center">
          <p className="text-xs uppercase tracking-[0.28em] text-plum/70">special delivery. volume up</p>
          <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-6xl">Take a sip, all the best!</h1>
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {step === "intro" || step === "open" ? (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
                exit={{ opacity: 0, scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.98 }}
                key="intro"
                transition={{ duration: 0.45 }}
              >
                <DeliveryVideo label="Delivery intro video" muted onEnded={() => setStep("open")} playSignal={introSignal} src={deliveryAssets.introVideo} />
              </motion.div>
            ) : (
              <motion.div
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
                exit={{ opacity: 0, scale: 0.98 }}
                initial={{ opacity: 0, scale: 0.98 }}
                key="coffee"
                transition={{ duration: 0.45 }}
              >
                <DeliveryVideo label="Hazelnut coffee video" onEnded={finishCoffeeVideo} playSignal={coffeeSignal} src={deliveryAssets.coffeeVideo} />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step === "open" && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-center"
                exit={{ opacity: 0, y: 12 }}
                initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <button
                  className="inline-flex items-center gap-3 rounded-full bg-white/72 px-6 py-4 text-base font-medium text-plum shadow-soft transition hover:-translate-y-1 hover:bg-white"
                  onClick={startCoffeeVideo}
                  type="button"
                >
                  <PackageOpen className="h-5 w-5" />
                  Tap to Open
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {step === "journey" && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex justify-center"
                exit={{ opacity: 0, y: 12 }}
                initial={{ opacity: 0, y: 16 }}
                transition={{ duration: 0.55, ease: "easeOut" }}
              >
                <button
                  className="inline-flex items-center gap-3 rounded-full bg-plum px-6 py-4 text-base font-medium text-white shadow-soft transition hover:-translate-y-1"
                  onClick={beginJourney}
                  type="button"
                >
                  Begin Today&apos;s Journey
                  <ArrowRight className="h-5 w-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </main>
  );
}

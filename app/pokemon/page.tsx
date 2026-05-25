import Link from "next/link";
import { BadgeShelf } from "@/components/journey/BadgeShelf";
import { CompanionEvolution } from "@/components/journey/CompanionEvolution";
import { JourneyMap } from "@/components/journey/JourneyMap";
import { PokemonCenter } from "@/components/journey/PokemonCenter";

export default function PokemonJourneyPage() {
  return (
    <div className="space-y-5 pb-10 pt-4 sm:pt-8">
      <section className="glass rounded-[2rem] p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-plum/70">hazel&apos;s journey</p>
            <h1 className="mt-2 font-display text-4xl leading-tight text-ink sm:text-6xl">A gentle route toward becoming a doctor</h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-ink/68">
              A cozy progression map for the days ahead. The road moves with time, and the planner only adds a little glow.
            </p>
          </div>
          <Link className="inline-flex h-12 items-center justify-center rounded-2xl bg-plum px-5 text-sm text-white shadow-soft" href="/planner">
            Open weekly planner
          </Link>
        </div>
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <JourneyMap />
        <div className="space-y-5">
          <CompanionEvolution />
          <PokemonCenter />
        </div>
      </div>

      <BadgeShelf />
    </div>
  );
}

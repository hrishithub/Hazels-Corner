import { CheckCircle2, MapPin } from "lucide-react";
import { CompanionArt } from "@/components/ui/CompanionArt";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";
import { pokemonStages } from "@/lib/constants";
import { getCompanionStage, getDaysLeft } from "@/lib/time";

export default function PokemonJourneyPage() {
  const daysLeft = getDaysLeft();
  const current = getCompanionStage(daysLeft);

  return (
    <div className="pb-10">
      <PageHeader eyebrow="journey" title="A tiny companion for the road">
        <p>A nostalgic progression map for the last stretch. The companion changes as the exam comes closer, without turning life into a scoreboard.</p>
      </PageHeader>

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <SoftCard className="text-center">
          <CompanionArt stage={current.name} large />
          <p className="font-display text-4xl">{current.name}</p>
          <p className="mt-2 text-sm text-ink/60">{current.line}</p>
          <div className="mx-auto mt-6 max-w-xs rounded-2xl bg-white/48 p-4 text-left">
            <p className="font-hand text-xl leading-relaxed">
              NPC: The road is long, Hazel. But you have already crossed so much of it.
            </p>
          </div>
        </SoftCard>

        <section className="space-y-4">
          {pokemonStages.map((stage) => {
            const unlocked = daysLeft >= stage.minDaysLeft || stage.name === current.name;
            return (
              <div
                className={`pixel-corners border p-5 shadow-soft ${
                  stage.name === current.name
                    ? "border-plum/40 bg-white/62"
                    : "border-white/42 bg-white/32"
                }`}
                key={stage.name}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-display text-2xl">{stage.name}</p>
                    <p className="mt-1 text-sm text-ink/62">{stage.line}</p>
                  </div>
                  {unlocked ? <CheckCircle2 className="h-6 w-6 text-plum" /> : <MapPin className="h-6 w-6 text-ink/35" />}
                </div>
                <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/55">
                  <div
                    className="h-full rounded-full"
                    style={{ width: stage.name === current.name ? "74%" : unlocked ? "100%" : "18%", background: stage.color }}
                  />
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </div>
  );
}

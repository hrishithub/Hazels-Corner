import { Heart, Moon, Sparkles } from "lucide-react";
import dailyMessages from "@/content/dailyMessages.json";
import { Countdown } from "@/components/home/Countdown";
import { MoodCheckIn } from "@/components/home/MoodCheckIn";
import { RhythmGreeting } from "@/components/home/RhythmGreeting";
import { TinyWin } from "@/components/home/TinyWin";
import { CompanionArt } from "@/components/ui/CompanionArt";
import { SoftCard } from "@/components/ui/SoftCard";
import { getCompanionStage, getDaysLeft } from "@/lib/time";

export default function HomePage() {
  const daysLeft = getDaysLeft();
  const stage = getCompanionStage(daysLeft);
  const message = dailyMessages[daysLeft % dailyMessages.length];

  return (
    <div className="space-y-5 pb-10">
      <section className="grid gap-5 pt-4 lg:grid-cols-[1.3fr_0.7fr] lg:pt-8">
        <div className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-8">
          <div className="absolute right-0 top-0 h-56 w-56 rounded-full bg-butter/30 blur-3xl" />
          <RhythmGreeting />
          <div className="mt-7 max-w-2xl">
            <p className="mb-3 font-display text-xl">NEET PG exam in</p>
            <Countdown />
          </div>
        </div>

        <SoftCard className="flex flex-col items-center justify-center overflow-hidden text-center">
          <CompanionArt stage={stage.name} />
          <p className="font-display text-3xl">{stage.name}</p>
          <p className="mt-1 text-sm text-ink/60">{stage.line}</p>
        </SoftCard>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <SoftCard className="lg:col-span-2">
          <div className="flex items-start gap-4">
            <span className="rounded-2xl bg-lilac/40 p-3 text-plum">
              <Moon className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-plum/70">today&apos;s comfort</p>
              <p className="mt-3 font-hand text-2xl leading-relaxed text-ink sm:text-3xl">{message}</p>
            </div>
          </div>
        </SoftCard>

        <TinyWin />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <MoodCheckIn />

        <div className="paper rounded-[1.5rem] border border-white/70 p-7 shadow-soft">
          <Sparkles className="mb-3 h-5 w-5 text-plum" />
          <p className="font-hand text-2xl leading-relaxed text-ink sm:text-3xl">
            You are doing something today that your future self will understand with tenderness.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {[
          ["Open When", "letters for the day that needs a little extra hug"],
          ["Music Corner", "songs that understand without asking too much"],
          ["Calm Corner", "a breathing room when the page feels too sharp"]
        ].map(([title, copy]) => (
          <SoftCard className="transition hover:-translate-y-1" key={title}>
            <Heart className="mb-4 h-5 w-5 fill-rose text-rose" />
            <p className="font-display text-2xl">{title}</p>
            <p className="mt-2 text-sm leading-6 text-ink/62">{copy}</p>
          </SoftCard>
        ))}
      </section>
    </div>
  );
}

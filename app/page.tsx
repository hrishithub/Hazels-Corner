import Link from "next/link";
import { Heart, Sparkles } from "lucide-react";
import { Countdown } from "@/components/home/Countdown";
import { DailyNote } from "@/components/home/DailyNote";
import { HomeCompanion } from "@/components/home/HomeCompanion";
import { MoodCheckIn } from "@/components/home/MoodCheckIn";
import { RhythmGreeting } from "@/components/home/RhythmGreeting";
import { TinyWin } from "@/components/home/TinyWin";
import { SoftCard } from "@/components/ui/SoftCard";

const quickLinks = [
  {
    title: "Open When",
    copy: "letters for the day that needs a little extra hug",
    href: "/open-when"
  },
  {
    title: "Music Corner",
    copy: "songs that understand without asking too much",
    href: "/music"
  },
  {
    title: "Calm Corner",
    copy: "a breathing room to calm yourself down",
    href: "/calm"
  }
];

export default function HomePage() {
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

        <HomeCompanion />
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        <SoftCard className="lg:col-span-2">
          <DailyNote />
        </SoftCard>

        <TinyWin />
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
        <MoodCheckIn />

      <div className="paper rounded-[1.5rem] border border-white/70 p-7 shadow-soft">
 
  <Sparkles className="mb-3 h-5 w-5 text-plum" />

  <div className="max-h-52 sm:max-h-64 md:max-h-72 overflow-y-auto pr-2">
    <p className="font-hand text-2xl leading-relaxed text-ink sm:text-3xl whitespace-pre-line">
      {`In your life, you will inevitably: misspeak, trust the wrong person, underreact, overreact, hurt the people who didn't deserve it, overthink, not think at all, self sabotage, create a reality where only your experience exists, ruin perfectly good moments for yourself and others, deny any wrongdoing, not take the steps to make it right, feel very guilty, let the guilt eat at you, hit rock bottom, finally address the pain you caused, try to do better next time, rinse, repeat.

These mistakes will cause you to lose things. But, losing things doesn't just mean losing. A lot of the time, when we lose things, we gain things too.

Life can be heavy, especially if you try to carry it all at once. Part of growing up and moving into new chapters of your life is about catch and release; you can't carry all things, decide what is yours to hold and let the rest go. Oftentimes, the good things in your life are lighter anyway, so there's more room for them.

NEVER BE ASHAMED OF TRYING. 

- Dr. Taylor Alison Swift`} 

    </p>
  </div>
</div>
      </section>

      <section className="grid gap-5 md:grid-cols-3">
        {quickLinks.map((item) => (
          <Link href={item.href} key={item.title}>
            <SoftCard className="cursor-pointer transition hover:-translate-y-1">
              <Heart className="mb-4 h-5 w-5 fill-rose text-rose" />
              <p className="font-display text-2xl">{item.title}</p>
              <p className="mt-2 text-sm leading-6 text-ink/62">{item.copy}</p>
            </SoftCard>
          </Link>
        ))}
      </section>
    </div>
  );
}

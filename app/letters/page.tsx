import { Lock, MailOpen } from "lucide-react";
import letters from "@/content/letters.json";
import { PageHeader } from "@/components/ui/PageHeader";
import { getDaysLeft } from "@/lib/time";

export default function LettersPage() {
  const daysLeft = getDaysLeft();

  return (
    <div className="pb-10">
      <PageHeader eyebrow="letters" title="Little envelopes for later">
        <p>
          Some words are meant to arrive at the right time. Until then, they can
          wait quietly.
        </p>
      </PageHeader>

      <div className="grid gap-5 md:grid-cols-2">
        {letters.map((letter) => {
          const unlocked = daysLeft <= letter.unlockAtDaysLeft;

          return (
            <article
              className={`paper h-96 rounded-[1.5rem] border p-6 shadow-soft ${
                unlocked ? "border-white/80" : "border-white/45 opacity-75"
              }`}
              key={letter.id}
            >
              <div className="flex items-center justify-between">
                <span className="rounded-2xl bg-white/58 p-3 text-plum">
                  {unlocked ? (
                    <MailOpen className="h-5 w-5" />
                  ) : (
                    <Lock className="h-5 w-5" />
                  )}
                </span>

                <span className="font-hand text-lg text-plum">
                  {unlocked
                    ? "opened"
                    : `${letter.unlockAtDaysLeft} days`}
                </span>
              </div>

              <h2 className="mt-7 font-display text-3xl">
                {letter.title}
              </h2>

              <div className="mt-5 max-h-52 overflow-y-auto pr-2 sm:max-h-56">
                <p className="whitespace-pre-line text-base leading-8 text-ink/76">
                  {unlocked
                    ? letter.body
                    : "This one is still folded. It will be here when the day comes."}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
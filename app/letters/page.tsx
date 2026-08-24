import type { ReactNode } from "react";
import { readFile } from "fs/promises";
import path from "path";
import { ArrowLeft, ArrowRight, MailOpen } from "lucide-react";
import { LetterMusicPlayer } from "@/components/letters/LetterMusicPlayer";

const currentLetter = {
  title: "All the Best, Shreya",
  description: "Just wanted to say this before the big day.",
  filename: "pre-exam.md"
};

const letterMusic = {
  songName: "You're on Your Own, Kid",
  artistName: "Taylor Swift",
  audioSrc: "/letters/music/song.mp3",
  coverSrc: "/letters/music/cover.jpg",
  note: "Checkout this page a day after your exam :)",
  triggerId: "letters-music-trigger",
  containerId: "letters-reading-section",
  autoPlay: true
};

function renderInlineMarkdown(text: string) {
  const nodes: ReactNode[] = [];
  const pattern = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={`${match.index}-strong`}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(<em key={`${match.index}-em`}>{token.slice(1, -1)}</em>);
    }

    lastIndex = match.index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

function renderLines(lines: string[]) {
  return lines.flatMap((line, index) => [
    <span key={`${index}-line`}>{renderInlineMarkdown(line)}</span>,
    index < lines.length - 1 ? <br key={`${index}-break`} /> : null
  ]);
}

function renderMarkdown(markdown: string) {
  const blocks = markdown.trim().split(/\n{2,}/);

  return blocks.map((block, index) => {
    const trimmed = block.trim();
    const lines = trimmed.split("\n");

    if (trimmed.startsWith("### ")) {
      return (
        <h3 className="mt-9 font-display text-2xl leading-tight text-ink sm:text-3xl" key={index}>
          {renderInlineMarkdown(trimmed.replace(/^###\s+/, ""))}
        </h3>
      );
    }

    if (trimmed.startsWith("## ")) {
      return (
        <h2 className="mt-10 font-display text-3xl leading-tight text-ink sm:text-4xl" key={index}>
          {renderInlineMarkdown(trimmed.replace(/^##\s+/, ""))}
        </h2>
      );
    }

    if (trimmed.startsWith("# ")) {
      return (
        <h1 className="font-display text-4xl leading-tight text-ink sm:text-6xl" key={index}>
          {renderInlineMarkdown(trimmed.replace(/^#\s+/, ""))}
        </h1>
      );
    }

    return (
      <p className="text-base leading-8 text-ink/76 sm:text-lg sm:leading-9" key={index}>
        {renderLines(lines)}
      </p>
    );
  });
}

async function getLetterMarkdown() {
  const filePath = path.join(process.cwd(), "content", "letters", currentLetter.filename);
  return readFile(filePath, "utf8");
}

export default async function LettersPage() {
  const markdown = await getLetterMarkdown();

  return (
    <main className="pb-56 pt-4 sm:pb-64 sm:pt-8">
      <section className="mx-auto w-full max-w-4xl" id="letters-reading-section">
        <nav className="glass mb-5 flex items-center justify-between gap-3 rounded-[1.5rem] px-4 py-3 text-sm text-ink/70 sm:px-5">
          <button
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl px-3 py-2 opacity-45"
            disabled
            type="button"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous letter
          </button>
          <button
            aria-disabled="true"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-2xl px-3 py-2 opacity-45"
            disabled
            type="button"
          >
            Next letter
            <ArrowRight className="h-4 w-4" />
          </button>
        </nav>

        <article className="paper rounded-[2rem] border border-white/70 px-5 py-7 shadow-soft sm:px-9 sm:py-10 lg:px-12">
          <header className="mb-8 border-b border-plum/10 pb-7">
            <span className="mb-5 inline-grid h-12 w-12 place-items-center rounded-2xl bg-white/58 text-plum shadow-soft">
              <MailOpen className="h-5 w-5" />
            </span>
            <p className="text-xs uppercase tracking-[0.26em] text-plum/70">letters</p>
            <h1 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-6xl">{currentLetter.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-ink/62 sm:text-base">{currentLetter.description}</p>
          </header>

          <div className="space-y-6">{renderMarkdown(markdown)}</div>
        </article>
        <div aria-hidden="true" className="h-32 sm:h-36" id="letters-music-trigger" />
      </section>
      <LetterMusicPlayer {...letterMusic} />
    </main>
  );
}

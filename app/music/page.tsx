import { ExternalLink, Music2 } from "lucide-react";
import music from "@/content/music.json";
import { PageHeader } from "@/components/ui/PageHeader";
import { SoftCard } from "@/components/ui/SoftCard";

export default function MusicPage() {
  return (
    <div className="pb-10">
      <PageHeader eyebrow="music corner" title="Songs for every kind of quiet">
        <p>Curated like a bedside lamp: not too bright, just enough to make the room feel less alone.</p>
      </PageHeader>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="space-y-5">
          {music.map((playlist) => (
            <article className="glass overflow-hidden rounded-[1.5rem] p-4 sm:p-5" key={playlist.title}>
              <div className="mb-4 flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-2xl">{playlist.title}</p>
                  <p className="mt-1 text-sm leading-6 text-ink/62">{playlist.mood}</p>
                </div>
                <a
                  className="rounded-full bg-white/60 p-3 text-plum transition hover:bg-white"
                  href={playlist.spotifyUrl.replace("/embed", "")}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Open ${playlist.title} on Spotify`}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
              <div className="spotify-frame">
                <iframe
                  src={playlist.spotifyUrl}
                  width="100%"
                  height="152"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={playlist.title}
                />
              </div>
            </article>
          ))}
        </section>

        <aside className="space-y-5">
          <SoftCard>
            <Music2 className="mb-4 h-6 w-6 text-plum" />
            <p className="font-display text-3xl"></p>
            <p className="mt-4 font-hand text-2xl leading-relaxed text-ink/78 whitespace-pre-line">
              {`People haven't always been there for me, but music always has.
              
              - Taylor Swift`}
            </p>
          </SoftCard>
        </aside>
      </div>
    </div>
  );
}

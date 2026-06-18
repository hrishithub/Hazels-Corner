"use client";

import { AmbientParticles } from "@/components/journey/AmbientParticles";
import { JourneyPath } from "@/components/journey/JourneyPath";
import { MapRegion } from "@/components/journey/MapRegion";
import { PlayerSprite } from "@/components/journey/PlayerSprite";
import { RouteTooltip } from "@/components/journey/RouteTooltip";
import { useJourneyProgress } from "@/components/journey/JourneyProgressContext";

export const routeMilestones = [
  {
    name: "Quiet Forest",
    description: "breathe, begin, continue",
    icon: "leaf",
    unlockAt: 0,
    x: 23,
    y: 27,
    tipX: 22,
    tipY: 18
  },
  {
    name: "Rainy Route",
    description: "keep going on hard days",
    icon: "rain",
    unlockAt: 13,
    x: 48,
    y: 31,
    tipX: 50,
    tipY: 13
  },
  {
    name: "Pokemon Center",
    description: "rest is part of the route",
    icon: "heart",
    unlockAt: 27,
    x: 75,
    y: 31,
    tipX: 82,
    tipY: 34
  },
  {
    name: "Late Night Library",
    description: "learn quietly, return softly",
    icon: "book",
    unlockAt: 40,
    x: 29,
    y: 67,
    tipX: 23,
    tipY: 63
  },
  {
    name: "Study Town",
    description: "small consistency gathers light",
    icon: "star",
    unlockAt: 52,
    x: 58,
    y: 63,
    tipX: 55,
    tipY: 70
  },
  {
    name: "Final Stretch",
    description: "almost there, still gentle",
    icon: "spark",
    unlockAt: 66,
    x: 80,
    y: 50,
    tipX: 79,
    tipY: 55
  },
  {
    name: "Victory Road",
    description: "the final climb is still one step",
    icon: "mountain",
    unlockAt: 80,
    x: 35,
    y: 88,
    tipX: 29,
    tipY: 78
  },
  {
    name: "Pediatrics Gym",
    description: "one step closer to Pediatrics",
    icon: "crown",
    unlockAt: 93,
    x: 88,
    y: 66,
    tipX: 88,
    tipY: 72
  }
];

const pathPoints = [
  { x: 8, y: 34 },
  { x: 23, y: 34 },
  { x: 48, y: 31 },
  { x: 75, y: 31 },
  { x: 58, y: 63 },
  { x: 29, y: 70 },
  { x: 35, y: 89 },
  { x: 68, y: 80 },
  { x: 88, y: 66 }
];

function getSpritePosition(progress: number) {
  const scaled = (progress / 100) * (pathPoints.length - 1);
  const index = Math.min(pathPoints.length - 2, Math.floor(scaled));
  const local = scaled - index;
  const from = pathPoints[index];
  const to = pathPoints[index + 1];

  return {
    x: from.x + (to.x - from.x) * local,
    y: from.y + (to.y - from.y) * local
  };
}

function Tree({ left, top, scale = 1 }: { left: number; top: number; scale?: number }) {
  return (
    <div className="absolute" style={{ left: `${left}%`, top: `${top}%`, transform: `scale(${scale})` }}>
      <div className="h-7 w-8 rounded-t-full bg-[#1d5d49] shadow-[0_0_18px_rgba(72,164,112,.22)]" />
      <div className="-mt-3 ml-1 h-6 w-6 rounded-t-full bg-[#2f7d54]" />
      <div className="mx-auto -mt-1 h-5 w-2 bg-[#5a3d2f]" />
    </div>
  );
}

function Lamp({ left, top }: { left: number; top: number }) {
  return (
    <div className="absolute z-20" style={{ left: `${left}%`, top: `${top}%` }}>
      <div className="mx-auto h-3 w-3 rounded-full bg-butter shadow-[0_0_18px_7px_rgba(255,231,166,.5)]" />
      <div className="mx-auto h-8 w-1 bg-[#4b3855]" />
    </div>
  );
}

function House({ left, top, roof = "red", large = false }: { left: number; top: number; roof?: "red" | "blue" | "green"; large?: boolean }) {
  const roofColor = roof === "blue" ? "bg-[#315d90]" : roof === "green" ? "bg-[#3e7b68]" : "bg-[#9d3f42]";
  return (
    <div className="absolute z-20" style={{ left: `${left}%`, top: `${top}%` }}>
      <div className={`${large ? "h-10 w-28" : "h-7 w-16"} ${roofColor} pixel-corners shadow-soft`} />
      <div className={`${large ? "h-14 w-24" : "h-10 w-14"} mx-auto -mt-1 rounded-sm border border-white/20 bg-[#eed0ac]`}>
        <div className="mx-auto mt-3 h-4 w-3 bg-[#4c3547]" />
        <div className="ml-3 mt-[-14px] h-3 w-3 bg-butter shadow-[0_0_10px_rgba(255,231,166,.7)]" />
        <div className="ml-auto mr-3 mt-[-12px] h-3 w-3 bg-butter shadow-[0_0_10px_rgba(255,231,166,.7)]" />
      </div>
    </div>
  );
}

export function JourneyMap() {
  const { journeyPercent } = useJourneyProgress();
  const sprite = getSpritePosition(journeyPercent);

  return (
    <section className="glass relative overflow-hidden rounded-[2rem] p-4 sm:p-6">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-plum/70">the route map</p>
          <h2 className="font-display text-3xl text-ink">Toward Pediatrics</h2>
          <p className="mt-1 text-sm text-ink/62">A symbolic route through revision, rest, endurance, and quiet courage.</p>
        </div>
        <div className="pixel-corners bg-white/60 px-4 py-2 text-sm text-plum">{journeyPercent}% travelled</div>
      </div>

      <div className="overflow-x-auto pb-2">
        <div className="pixel-corners relative h-[690px] min-w-[1040px] overflow-hidden border border-white/55 bg-[#10233a] shadow-soft">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_18%,rgba(34,104,73,.85),transparent_20%),radial-gradient(circle_at_72%_24%,rgba(54,118,75,.82),transparent_22%),radial-gradient(circle_at_76%_62%,rgba(94,53,126,.82),transparent_24%),radial-gradient(circle_at_24%_74%,rgba(26,31,67,.82),transparent_24%),linear-gradient(180deg,#0b1830,#132c3f_44%,#251c45)]" />
          <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.13)_1px,transparent_1px)] [background-size:18px_18px]" />

          <MapRegion className="left-[2%] top-[8%] h-[34%] w-[38%] rounded-[45%] bg-[#1f6f4f]/65" revealed={journeyPercent >= 0}>
            {Array.from({ length: 16 }).map((_, index) => (
              <Tree key={index} left={(index * 13 + 4) % 86} top={(index * 19 + 5) % 74} scale={index % 3 === 0 ? 1.2 : 1} />
            ))}
            <House left={6} top={56} />
          </MapRegion>

          <MapRegion className="left-[36%] top-[3%] h-[42%] w-[33%] rounded-[38%] bg-[#334d78]/62" revealed={journeyPercent >= 13}>
            <div className="absolute inset-x-[8%] top-[54%] h-16 rounded-[50%] bg-[#234f86] shadow-[0_0_24px_rgba(74,136,214,.35)]" />
            <div className="absolute left-[38%] top-[56%] h-8 w-28 rounded-lg border-4 border-[#8d6748] bg-[#6c4a33]" />
          </MapRegion>

          <MapRegion className="left-[67%] top-[8%] h-[38%] w-[31%] rounded-[40%] bg-[#245d48]/72" revealed={journeyPercent >= 27}>
            {Array.from({ length: 12 }).map((_, index) => (
              <Tree key={index} left={(index * 16 + 6) % 86} top={(index * 23 + 4) % 74} scale={0.95} />
            ))}
            <House left={38} top={22} large roof="red" />
            <Lamp left={34} top={58} />
            <Lamp left={78} top={52} />
          </MapRegion>

          <MapRegion className="left-[5%] top-[52%] h-[30%] w-[35%] rounded-[32%] bg-[#171d45]/78" revealed={journeyPercent >= 40}>
            <House left={24} top={22} large roof="blue" />
            <div className="absolute left-[38%] top-[6%] text-3xl text-butter">crescent</div>
            <Lamp left={18} top={54} />
            <Lamp left={66} top={50} />
          </MapRegion>

          <MapRegion className="left-[36%] top-[47%] h-[28%] w-[31%] rounded-[36%] bg-[#3d774f]/68" revealed={journeyPercent >= 52}>
            <House left={16} top={22} roof="blue" />
            <House left={42} top={18} roof="red" />
            <House left={65} top={24} roof="green" />
            <div className="absolute left-[42%] top-[55%] h-12 w-12 rounded-full border-4 border-[#9cc4ff] bg-[#406e9f] shadow-[0_0_24px_rgba(156,196,255,.45)]" />
            <Lamp left={34} top={64} />
            <Lamp left={68} top={60} />
          </MapRegion>

          <MapRegion className="left-[65%] top-[43%] h-[27%] w-[32%] rounded-[36%] bg-[#62358c]/72" revealed={journeyPercent >= 66}>
            <Lamp left={18} top={40} />
            <Lamp left={73} top={48} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_40%,rgba(255,180,214,.32),transparent_22%)]" />
          </MapRegion>

          <MapRegion className="left-[6%] top-[76%] h-[21%] w-[34%] rounded-[34%] bg-[#333145]/82" revealed={journeyPercent >= 80}>
            <div className="absolute left-[18%] top-[20%] h-24 w-36 bg-[#4d4a5f] [clip-path:polygon(10%_100%,35%_20%,54%_100%)]" />
            <div className="absolute left-[38%] top-[18%] h-28 w-40 bg-[#373244] [clip-path:polygon(6%_100%,45%_4%,82%_100%)]" />
            <div className="absolute left-[23%] top-[57%] h-12 w-16 rounded-t-full bg-[#141320]" />
            <Lamp left={66} top={52} />
          </MapRegion>

          <MapRegion className="left-[61%] top-[70%] h-[27%] w-[36%] rounded-[36%] bg-[#244d42]/78" revealed={journeyPercent >= 93}>
            <House left={26} top={12} large roof="green" />
            <div className="absolute left-[43%] top-[53%] h-16 w-16 rounded-full border-4 border-[#9cc4ff] bg-[#315d90] shadow-[0_0_24px_rgba(156,196,255,.45)]" />
            <Lamp left={20} top={58} />
            <Lamp left={76} top={58} />
          </MapRegion>

          <div className="absolute left-[30%] top-[39%] h-[45%] w-[10%] rotate-[-8deg] rounded-full bg-[#165a8d] shadow-[0_0_22px_rgba(74,136,214,.35)]" />
          <div className="absolute left-[34%] top-[47%] h-12 w-32 rounded-lg border-4 border-[#8d6748] bg-[#6c4a33]" />
          <div className="absolute left-[35%] top-[86%] h-10 w-36 rounded-lg border-4 border-[#8d6748] bg-[#6c4a33]" />

          <JourneyPath progress={journeyPercent} />
          <PlayerSprite x={sprite.x} y={sprite.y} />
          <AmbientParticles />

          {routeMilestones.map((region, index) => {
            const nextUnlock = routeMilestones[index + 1]?.unlockAt ?? 101;
            const active = journeyPercent >= region.unlockAt && journeyPercent < nextUnlock;
            return (
              <RouteTooltip
                active={active}
                description={region.description}
                icon={region.icon}
                key={region.name}
                name={`${index + 1}. ${region.name}`}
                revealed={journeyPercent >= region.unlockAt}
                x={region.tipX}
                y={region.tipY}
              />
            );
          })}

          <div className="absolute bottom-4 left-4 z-50 pixel-corners border border-white/40 bg-[#151d34]/86 px-4 py-3 text-xs leading-5 text-cream">
            <p className="font-display text-lg">Legend</p>
            <p>H - Hazel&apos;s route</p>
            <p>dotted path - the days ahead</p>
            <p>fog - still waiting to be discovered</p>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

export function FogOverlay({ revealed }: { revealed: boolean }) {
  if (revealed) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20 bg-dusk/38 backdrop-blur-[1.5px]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,transparent_0_22%,rgba(24,21,44,.55)_52%,rgba(24,21,44,.72)_100%)]" />
    </div>
  );
}

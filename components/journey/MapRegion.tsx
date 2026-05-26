"use client";

import { FogOverlay } from "@/components/journey/FogOverlay";

export function MapRegion({
  children,
  className,
  revealed = true,
  style
}: {
  children?: React.ReactNode;
  className: string;
  revealed?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <div className={`absolute overflow-hidden ${className}`} style={style}>
      {children}
      <FogOverlay revealed={revealed} />
    </div>
  );
}

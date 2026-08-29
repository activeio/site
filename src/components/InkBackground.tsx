"use client";

import dynamic from "next/dynamic";

// Loaded client-only, after the initial critical-path bundle — the
// simulation code has no business blocking first paint of the hero.
const Suminagashi = dynamic(
  () => import("@/components/Suminagashi").then((mod) => mod.Suminagashi),
  { ssr: false }
);

/**
 * Hero background: a low-opacity suminagashi marbling wash, purely
 * ambient — no variant switch, no interaction prompt.
 */
export function InkBackground() {
  return (
    <div className="sumi-fade pointer-events-none absolute inset-0 -z-10 opacity-60">
      <Suminagashi />
    </div>
  );
}

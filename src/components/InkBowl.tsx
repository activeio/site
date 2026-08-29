"use client";

import dynamic from "next/dynamic";

// Loaded client-only, after the initial critical-path bundle — the
// simulation code has no business blocking first paint of the about section.
const FluidInk = dynamic(
  () => import("@/components/FluidInk").then((mod) => mod.FluidInk),
  { ssr: false }
);

/**
 * The hero artifact: a quiet bowl of water running the fluid-ink
 * simulation. Move the cursor through it to stir; click to drop ink.
 */
export function InkBowl() {
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-background shadow-[0_8px_40px_-12px_rgba(43,42,38,0.12)]">
        <FluidInk />
      </div>
      <p className="mt-3 select-none text-center font-mono text-xs uppercase tracking-[0.18em] text-muted">
        touch the water
      </p>
    </div>
  );
}

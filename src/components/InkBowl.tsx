import { FluidInk } from "@/components/FluidInk";

/**
 * The hero artifact: a quiet bowl of water running the fluid-ink
 * simulation. Move the cursor through it to stir; click to drop ink.
 */
export function InkBowl() {
  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-background shadow-[0_8px_40px_-12px_rgba(43,42,38,0.12)]">
        <FluidInk />
        <span
          lang="ja"
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-3 font-display text-sm text-ink/30"
        >
          水
        </span>
      </div>
      <p className="mt-3 select-none text-center text-xs tracking-[0.18em] text-muted">
        <span lang="ja" className="font-display">
          水に触れる
        </span>
        <span className="font-mono"> — touch the water</span>
      </p>
    </div>
  );
}

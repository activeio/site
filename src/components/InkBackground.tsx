"use client";

import { useState } from "react";
import { Suminagashi } from "@/components/Suminagashi";
import { FluidInk } from "@/components/FluidInk";

const VARIANTS = [
  { id: "sumi", kanji: "墨", label: "sumi — marbled ink (suminagashi)" },
  { id: "mizu", kanji: "水", label: "mizu — flowing water" },
] as const;

type VariantId = (typeof VARIANTS)[number]["id"];

/**
 * Hero background: suminagashi marbling by default, with a quiet kanji
 * toggle to switch to the fluid-simulation variant.
 */
export function InkBackground() {
  const [variant, setVariant] = useState<VariantId>("sumi");

  return (
    <>
      <div className="sumi-fade pointer-events-none absolute inset-0 -z-10">
        {variant === "sumi" ? <Suminagashi /> : <FluidInk />}
      </div>

      <div className="absolute bottom-4 right-5 z-10 flex gap-1.5">
        {VARIANTS.map((v) => (
          <button
            key={v.id}
            type="button"
            onClick={() => setVariant(v.id)}
            title={v.label}
            aria-label={v.label}
            aria-pressed={variant === v.id}
            className={`flex h-8 w-8 items-center justify-center rounded-full border text-sm transition-colors ${
              variant === v.id
                ? "border-ink/50 bg-white/70 text-ink"
                : "border-line text-muted hover:border-ink/30 hover:text-ink"
            }`}
          >
            <span lang="ja" className="font-display">
              {v.kanji}
            </span>
          </button>
        ))}
      </div>
    </>
  );
}

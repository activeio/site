import { MagneticButton } from "@/components/MagneticButton";
import { InkBackground } from "@/components/InkBackground";
import { InkBowl } from "@/components/InkBowl";
import { site, mailtoHref } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <InkBackground />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          {/* left — pitch */}
          <div>
            <p className="mb-6 flex items-baseline gap-3 text-muted">
              <span lang="ja" className="font-display text-lg text-accent">
                ものづくり
              </span>
              <span className="font-mono text-xs uppercase tracking-[0.18em]">
                the art of making things
              </span>
            </p>
            <h1 className="text-balance font-display text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {site.hero.headline}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              {site.hero.sub}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <MagneticButton
                href={mailtoHref}
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
              >
                Start a project →
              </MagneticButton>
              <a
                href="#work"
                className="border-b border-muted/40 pb-0.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
              >
                See our work
              </a>
            </div>
          </div>

          {/* right — a bowl of water */}
          <div className="lg:pl-2">
            <InkBowl />
          </div>
        </div>
      </div>
    </section>
  );
}

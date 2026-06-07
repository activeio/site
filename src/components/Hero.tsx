import Terminal from "@/components/terminal/Terminal";
import { MagneticButton } from "@/components/MagneticButton";
import { site, mailtoHref } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 -z-10" />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-14 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          {/* left — pitch */}
          <div>
            <p className="mb-5 inline-flex items-center rounded-full border border-line bg-white/60 px-3 py-1 font-mono text-xs text-accent">
              software &amp; apps building lab
            </p>
            <h1 className="text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {site.hero.headline}
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-muted">
              {site.hero.sub}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton
                href={mailtoHref}
                className="inline-flex items-center justify-center rounded-lg bg-ink px-5 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
              >
                Start a project →
              </MagneticButton>
              <a
                href="#work"
                className="inline-flex items-center justify-center rounded-lg border border-line px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
              >
                See our work
              </a>
            </div>
            <p className="mt-5 font-mono text-xs text-muted">
              psst — the box on the right is real. try typing{" "}
              <span className="text-accent">help</span>.
            </p>
          </div>

          {/* right — interactive terminal */}
          <div className="lg:pl-2">
            <Terminal />
          </div>
        </div>
      </div>
    </section>
  );
}

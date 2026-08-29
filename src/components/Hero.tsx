import { MagneticButton } from "@/components/MagneticButton";
import { InkBackground } from "@/components/InkBackground";
import { site, mailtoHref } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      <InkBackground />
      <div className="mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-14">
          {/* left — pitch */}
          <div>
            <p className="mb-6 font-mono text-xs uppercase tracking-[0.18em] text-muted">
              the art of making things
            </p>
            <h1 className="text-balance font-display text-4xl font-normal leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              {site.hero.headline}
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
              {site.hero.sub}
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-6">
              <MagneticButton
                href="#work"
                className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
              >
                View my work →
              </MagneticButton>
              <a
                href={mailtoHref}
                className="border-b border-muted/40 pb-0.5 text-sm text-muted transition-colors hover:border-ink hover:text-ink"
              >
                Email me
              </a>
            </div>

            {/* fact strip — real numbers pulled from the Grain case study below */}
            <dl className="mt-10 flex flex-wrap gap-x-8 gap-y-4 font-mono text-xs">
              {site.projects[0].metrics.map((m) => (
                <div key={m.label}>
                  <dt className="uppercase tracking-[0.14em] text-muted/70">
                    {m.label}
                  </dt>
                  <dd className="mt-1 text-ink">{m.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* right — placeholder for a real portrait photo, dropped in later */}
          <div className="lg:pl-2">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-line bg-background shadow-[0_8px_40px_-12px_rgba(43,42,38,0.12)]">
              <span
                aria-hidden="true"
                className="grid h-24 w-24 place-items-center rounded-full bg-accent-soft font-display text-4xl text-accent"
              >
                P
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

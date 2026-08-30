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

          {/* right — the Grain platform at a glance: the system that's actually live */}
          <div className="lg:pl-2">
            <div className="rounded-2xl border border-line bg-background p-6 shadow-[0_8px_40px_-12px_rgba(43,42,38,0.12)] sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                  in production — grain
                </p>
                <span className="flex items-center gap-2 font-mono text-[11px] text-accent">
                  <span
                    aria-hidden="true"
                    className="h-2 w-2 animate-pulse-dot rounded-full bg-accent"
                  />
                  live
                </span>
              </div>

              <div className="mt-6 space-y-2.5 font-mono text-[11px] leading-snug">
                <div className="grid grid-cols-3 gap-2">
                  <div className="rounded-lg border border-line bg-white/40 px-2 py-2.5 text-center text-muted">
                    Storefront
                    <span className="mt-0.5 block text-[10px] text-muted/60">
                      Next.js
                    </span>
                  </div>
                  <div className="rounded-lg border border-line bg-white/40 px-2 py-2.5 text-center text-muted">
                    Admin app
                    <span className="mt-0.5 block text-[10px] text-muted/60">
                      React Native
                    </span>
                  </div>
                  <div className="rounded-lg border border-line bg-white/40 px-2 py-2.5 text-center text-muted">
                    Web admin
                    <span className="mt-0.5 block text-[10px] text-muted/60">
                      React
                    </span>
                  </div>
                </div>

                <div aria-hidden="true" className="text-center text-muted/50">
                  ↓
                </div>

                <div className="rounded-lg border border-line bg-accent-soft px-3 py-2.5 text-center text-ink">
                  API — Bun + Hono
                </div>

                <div aria-hidden="true" className="text-center text-muted/50">
                  ↓
                </div>

                <div className="rounded-lg border border-line bg-white/40 px-3 py-2.5 text-center text-muted">
                  Supabase · Postgres · Storage · RLS
                  <span className="mt-0.5 block text-[10px] text-muted/60">
                    one DigitalOcean droplet · nginx
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 text-[10px] uppercase tracking-[0.12em] text-muted/70">
                  <span>GitHub Actions — ci/cd</span>
                  <span>Sentry — monitoring</span>
                </div>
              </div>

              <p className="mt-5 border-t border-line pt-4 font-mono text-[11px] text-muted">
                3 apps · 1 API · 1 droplet — designed, built &amp; run by one
                engineer
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

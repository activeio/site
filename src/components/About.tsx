import { Reveal } from "@/components/Reveal";
import { InkBowl } from "@/components/InkBowl";
import { site } from "@/lib/site";

export function About() {
  return (
    <section id="about" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            about
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-normal tracking-tight sm:text-4xl">
            One engineer, start to finish.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 lg:grid-cols-2 lg:gap-14">
          {/* left — bio + secondary ink touch */}
          <Reveal delay={0.06}>
            <div>
              <p className="max-w-md text-lg leading-relaxed text-muted">
                I&apos;m {site.name}, a solo full-stack engineer. I design,
                build, and operate production software end-to-end — product
                decisions, backend, infrastructure, and the security and
                DevOps work most teams split across a room. If it breaks in
                production, I&apos;m the one who fixes it.
              </p>

              <div className="mt-6 flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">
                {site.socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noreferrer"
                    className="border-b border-muted/40 pb-0.5 transition-colors hover:border-ink hover:text-ink"
                  >
                    {s.label}
                  </a>
                ))}
              </div>

              <div className="mt-10 max-w-xs">
                <InkBowl />
              </div>
            </div>
          </Reveal>

          {/* right — skills */}
          <Reveal delay={0.12}>
            <div className="space-y-4">
              {site.skills.map((group) => (
                <div
                  key={group.category}
                  className="rounded-xl border border-line bg-white/40 p-5 transition-colors hover:border-ink/25"
                >
                  <h3 className="font-mono text-xs uppercase tracking-[0.14em] text-muted">
                    {group.category}
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-line px-3 py-1 font-mono text-xs text-ink"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>

        {/* experience strip */}
        <Reveal delay={0.18}>
          <div className="mt-6">
            {site.experience.map((e) => (
              <div
                key={e.title}
                className="rounded-xl border border-line bg-background p-6 transition-colors hover:border-ink/25 sm:flex sm:items-baseline sm:gap-6"
              >
                <div className="flex items-baseline gap-3 sm:shrink-0">
                  <h3 className="text-base font-medium">{e.title}</h3>
                  <span className="font-mono text-xs text-muted">
                    {e.period}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:mt-0">
                  {e.blurb}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

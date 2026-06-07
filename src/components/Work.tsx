import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Work() {
  return (
    <section id="work" className="border-t border-line bg-white/40">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            // selected work
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            A few things we&apos;ve built.
          </h2>
          <p className="mt-3 max-w-md text-sm text-muted">
            Sample projects shown below — yours could be next.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          {site.projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <article className="group flex h-full flex-col justify-between rounded-xl border border-line bg-background p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-black/5">
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{p.name}</h3>
                    <span className="font-mono text-xs text-muted transition-colors group-hover:text-accent">
                      ↗
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-accent">{p.kind}</p>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {p.blurb}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

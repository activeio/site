import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export function Services() {
  return (
    <section id="services" className="border-t border-line">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            // what we do
          </p>
          <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl">
            From idea to shipped product.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {site.services.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.06}>
              <article className="group h-full rounded-xl border border-line bg-white/50 p-6 transition-all hover:-translate-y-1 hover:border-accent hover:shadow-lg hover:shadow-black/5">
                <span className="font-mono text-xs text-muted">
                  0{i + 1}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {s.blurb}
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {s.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-md bg-accent-soft px-2 py-0.5 font-mono text-[11px] text-accent"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

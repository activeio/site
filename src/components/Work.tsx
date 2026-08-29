"use client";

import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import type { CaseStudy } from "@/lib/site";

function CaseStudyRow({
  project,
  defaultExpanded,
}: {
  project: CaseStudy;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(!!defaultExpanded);
  const { live, repo } = project.links ?? {};

  return (
    <article className="rounded-xl border border-line bg-background p-6 transition-colors hover:border-ink/25">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full flex-col items-start gap-3 text-left"
      >
        <div className="flex w-full items-center justify-between gap-4">
          <div className="flex items-baseline gap-3">
            <h3 className="text-xl font-medium">{project.name}</h3>
            <span className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
              {project.role}
            </span>
          </div>
          <span className="shrink-0 font-mono text-xs text-muted">
            {expanded ? "close −" : "expand +"}
          </span>
        </div>

        <p className="max-w-2xl text-sm leading-relaxed text-muted">
          {project.oneLiner}
        </p>

        <div className="flex flex-wrap gap-2 pt-1">
          {project.metrics.map((m) => (
            <span
              key={m.label}
              className="rounded-full border border-line bg-white/40 px-3 py-1 font-mono text-[11px] text-ink"
            >
              {m.label}: {m.value}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {project.stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-line px-2.5 py-0.5 font-mono text-[11px] text-muted"
            >
              {s}
            </span>
          ))}
        </div>
      </button>

      {expanded && (
        <div className="mt-6 space-y-5 border-t border-line pt-6">
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
              Problem
            </h4>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {project.body.problem}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
              Decisions
            </h4>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {project.body.decisions}
            </p>
          </div>
          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.14em] text-accent">
              Outcome
            </h4>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
              {project.body.outcome}
            </p>
          </div>

          {(live || repo) && (
            <div className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-[0.14em] text-muted">
              {live && (
                <a
                  href={live}
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-muted/40 pb-0.5 transition-colors hover:border-ink hover:text-ink"
                >
                  Live ↗
                </a>
              )}
              {repo && (
                <a
                  href={repo}
                  target="_blank"
                  rel="noreferrer"
                  className="border-b border-muted/40 pb-0.5 transition-colors hover:border-ink hover:text-ink"
                >
                  Repo ↗
                </a>
              )}
            </div>
          )}
        </div>
      )}
    </article>
  );
}

export function Work() {
  return (
    <section id="work" className="border-t border-line bg-white/30">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:py-24">
        <Reveal>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
            selected work
          </p>
          <h2 className="mt-3 max-w-xl font-display text-3xl font-normal tracking-tight sm:text-4xl">
            A few things I&apos;ve built.
          </h2>
        </Reveal>

        <div className="mt-12 space-y-4">
          {site.projects.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.06}>
              <CaseStudyRow project={p} defaultExpanded={i === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

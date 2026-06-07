import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 sm:flex-row sm:items-center">
        <div>
          <a href="#top" className="font-mono text-sm font-medium">
            <span className="text-accent">active</span>_io_labs
          </a>
          <p className="mt-1 text-xs text-muted">
            Software &amp; apps building lab · {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <a
            href={`mailto:${site.email}`}
            className="font-mono text-muted transition-colors hover:text-ink"
          >
            {site.email}
          </a>
          {site.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="text-muted transition-colors hover:text-ink"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

import { site } from "@/lib/site";

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <a
          href="#top"
          className="font-mono text-sm font-medium tracking-tight text-ink"
        >
          <span className="text-accent">active</span>_io_labs
        </a>

        <div className="flex items-center gap-5 text-sm sm:gap-7">
          {site.nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hidden text-muted transition-colors hover:text-ink sm:inline"
            >
              {item.label}
            </a>
          ))}
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-muted">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse-dot" />
            available
          </span>
        </div>
      </nav>
    </header>
  );
}

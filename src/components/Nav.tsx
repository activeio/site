"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { Brand } from "@/components/Brand";

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Brand />

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
            open to work
          </span>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="-mr-1.5 inline-flex h-8 w-8 items-center justify-center rounded-md text-ink sm:hidden"
          >
            <span className="sr-only">
              {open ? "Close menu" : "Open menu"}
            </span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden="true"
            >
              {open ? (
                <path
                  d="M3 3l12 12M15 3L3 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M2 5h14M2 9h14M2 13h14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <div
          id="mobile-nav"
          className="border-t border-line/70 px-5 py-3 sm:hidden"
        >
          <div className="flex flex-col gap-3 text-sm">
            {site.nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-muted transition-colors hover:text-ink"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

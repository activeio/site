"use client";

import { useState } from "react";
import { site } from "@/lib/site";

export function CopyEmail() {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard unavailable — no-op
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className="inline-flex items-center justify-center gap-2 rounded-lg border border-line px-5 py-3 font-mono text-sm text-ink transition-colors hover:border-ink"
    >
      {copied ? "copied ✓" : site.email}
    </button>
  );
}

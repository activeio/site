/**
 * Brand mark: 活 (katsu — "active, alive") as a soft ink seal,
 * with a quiet serif wordmark.
 */
export function Brand({ size = "md" }: { size?: "md" | "sm" }) {
  const sm = size === "sm";
  return (
    <a href="#top" className="group inline-flex items-center gap-2.5">
      <span
        lang="ja"
        aria-hidden="true"
        className={`grid place-items-center rounded-full bg-accent-soft font-display text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-background ${
          sm ? "h-7 w-7 text-sm" : "h-9 w-9 text-base"
        }`}
      >
        活
      </span>
      <span
        className={`font-display tracking-wide text-ink ${
          sm ? "text-base" : "text-lg"
        }`}
      >
        active <span className="text-accent">io</span> labs
      </span>
    </a>
  );
}

"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { site } from "@/lib/site";
import {
  runCommand,
  publicCommandNames,
  allCommandNames,
  type CommandContext,
} from "./commands";

type Line = { id: number; node: ReactNode };

const PROMPT_USER = "visitor@activeiolabs";

function Prompt() {
  return (
    <span className="shrink-0 select-none">
      <span className="text-term-green">{PROMPT_USER}</span>
      <span className="text-term-dim">:~$</span>{" "}
    </span>
  );
}

export default function Terminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [boot, setBoot] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"shell" | "guess">("shell");

  const idRef = useRef(0);
  const historyRef = useRef<string[]>([]);
  const histIndexRef = useRef<number | null>(null);
  const targetRef = useRef(0);
  const attemptsRef = useRef(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  const push = useCallback((nodes: ReactNode | ReactNode[]) => {
    const arr = Array.isArray(nodes) ? nodes : [nodes];
    setLines((prev) => [
      ...prev,
      ...arr.map((node) => ({ id: idRef.current++, node })),
    ]);
  }, []);

  const ctx: CommandContext = {
    clear: () => {
      setLines([]);
      setBoot(null);
    },
    startGuess: () => {
      setMode("guess");
      targetRef.current = Math.floor(Math.random() * 100) + 1;
      attemptsRef.current = 0;
    },
  };

  // Boot sequence — typewriter the first line, then print the welcome.
  useEffect(() => {
    const bootLine = `${site.brandMark} // booting interactive shell…`;
    const welcome: ReactNode[] = [
      <span className="text-term-dim">
        welcome — this site is a terminal. type a command and hit enter.
      </span>,
      <span>
        try{" "}
        <span className="text-term-green">help</span>,{" "}
        <span className="text-term-green">about</span>,{" "}
        <span className="text-term-green">services</span>,{" "}
        <span className="text-term-green">contact</span> or{" "}
        <span className="text-term-green">play</span>.
      </span>,
      <span> </span>,
    ];

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    inputRef.current?.focus({ preventScroll: true });

    if (reduce) {
      setBoot(bootLine);
      push(welcome);
      return;
    }

    let i = 0;
    const t = setInterval(() => {
      i += 1;
      setBoot(bootLine.slice(0, i));
      if (i >= bootLine.length) {
        clearInterval(t);
        push(welcome);
      }
    }, 26);
    return () => clearInterval(t);
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Keep the view pinned to the latest output.
  useEffect(() => {
    const el = screenRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines, boot, mode]);

  const focusInput = () => inputRef.current?.focus({ preventScroll: true });

  const handleGuess = (value: string) => {
    const v = value.trim().toLowerCase();
    if (v === "quit" || v === "exit" || v === "q") {
      setMode("shell");
      push(<span className="text-term-dim">👋 left the game — run `play` to retry.</span>);
      return;
    }
    const n = Number.parseInt(v, 10);
    if (Number.isNaN(n)) {
      push(<span className="text-term-text">that&apos;s not a number — try 1–100, or `quit`.</span>);
      return;
    }
    attemptsRef.current += 1;
    if (n === targetRef.current) {
      const tries = attemptsRef.current;
      setMode("shell");
      push(
        <span className="text-term-yellow">
          🎉 correct! {targetRef.current} in {tries} {tries === 1 ? "try" : "tries"}. gg —
          type `help` for more.
        </span>,
      );
    } else if (n < targetRef.current) {
      push(<span className="text-term-text">📈 higher…</span>);
    } else {
      push(<span className="text-term-text">📉 lower…</span>);
    }
  };

  // Echo the entered line, then dispatch by mode.
  const execute = useCallback(
    (value: string) => {
      push(
        <span>
          <Prompt />
          <span className="text-term-text">{value}</span>
        </span>,
      );
      const trimmed = value.trim();
      if (trimmed) {
        historyRef.current.push(trimmed);
        if (historyRef.current.length > 100) historyRef.current.shift();
      }
      histIndexRef.current = null;

      if (mode === "guess") {
        handleGuess(value);
      } else {
        const out = runCommand(value, ctx);
        if (out && out.length) push(out);
      }
    },
    // ctx/handleGuess are stable enough for this mount; mode is the real dep
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, push],
  );

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    execute(input);
    setInput("");
  };

  const runFromChip = (cmd: string) => {
    execute(cmd);
    setInput("");
    focusInput();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      navHistory(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navHistory(1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key.toLowerCase() === "l" && e.ctrlKey) {
      e.preventDefault();
      ctx.clear();
    }
  };

  const navHistory = (dir: -1 | 1) => {
    const h = historyRef.current;
    if (!h.length) return;
    let idx = histIndexRef.current ?? h.length;
    idx += dir;
    if (idx < 0) idx = 0;
    if (idx >= h.length) {
      histIndexRef.current = h.length;
      setInput("");
      return;
    }
    histIndexRef.current = idx;
    setInput(h[idx]);
  };

  const complete = () => {
    if (mode !== "shell") return;
    const frag = input.trim().toLowerCase();
    if (!frag) return;
    const matches = allCommandNames.filter((n) => n.startsWith(frag));
    if (matches.length === 1) {
      setInput(matches[0]);
    } else if (matches.length > 1) {
      push(<span className="text-term-dim">{matches.join("  ")}</span>);
    }
  };

  const chips =
    mode === "guess"
      ? ["quit"]
      : ["help", "about", "services", "work", "contact", "play"].filter((c) =>
          publicCommandNames.includes(c),
        );

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#1d2421] bg-term-bg font-mono text-[13px] leading-relaxed shadow-2xl shadow-black/20 sm:text-sm">
      {/* title bar */}
      <div className="flex items-center gap-2 border-b border-[#1d2421] bg-term-bar px-4 py-2.5">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-2 truncate text-xs text-term-dim">
          {PROMPT_USER}: ~ — zsh
        </span>
      </div>

      {/* screen */}
      <div
        ref={screenRef}
        onClick={focusInput}
        className="term-screen h-[360px] cursor-text overflow-y-auto px-4 py-3 text-term-text sm:h-[420px]"
      >
        {boot !== null && (
          <div className="whitespace-pre-wrap break-words text-term-green">
            {boot}
          </div>
        )}

        <div role="log" aria-live="polite" aria-label="terminal output">
          {lines.map((line) => (
            <div key={line.id} className="whitespace-pre-wrap break-words">
              {line.node}
            </div>
          ))}
        </div>

        {/* live input line */}
        <form onSubmit={onSubmit} className="flex items-center">
          <Prompt />
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            aria-label="terminal input"
            className="w-full flex-1 border-0 bg-transparent text-term-text caret-term-green outline-none"
          />
        </form>
      </div>

      {/* command chips */}
      <div className="flex flex-wrap gap-2 border-t border-[#1d2421] bg-term-bar px-4 py-3">
        {chips.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => runFromChip(c)}
            className="rounded-md border border-[#27302c] px-2.5 py-1 text-xs text-term-dim transition-colors hover:border-term-green hover:text-term-green"
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

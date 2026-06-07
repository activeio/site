import type { ReactNode } from "react";
import { site, mailtoHref } from "@/lib/site";

/** Side-effects the shell can trigger (owned by the Terminal component). */
export type CommandContext = {
  clear: () => void;
  startGuess: () => void;
};

/** A handler returns the lines to print, or null when it prints nothing. */
export type CommandHandler = (
  args: string[],
  ctx: CommandContext,
) => ReactNode[] | null;

type Command = {
  desc: string;
  hidden?: boolean;
  run: CommandHandler;
};

/** Highlights a command name in output text. */
function Cmd({ children }: { children: ReactNode }) {
  return <span className="text-term-green">{children}</span>;
}

const dim = (text: string) => <span className="text-term-dim">{text}</span>;

export const commands: Record<string, Command> = {
  help: {
    desc: "list everything you can type",
    run: () => {
      const visible = Object.entries(commands).filter(([, c]) => !c.hidden);
      return [
        dim("available commands —"),
        ...visible.map(([name, c]) => (
          <span>
            {"  "}
            <Cmd>{name.padEnd(10)}</Cmd>
            <span className="text-term-dim">{c.desc}</span>
          </span>
        )),
        <span> </span>,
        dim("tip: ↑/↓ for history · Tab to autocomplete · a few commands are hidden 😉"),
      ];
    },
  },

  about: {
    desc: "who we are",
    run: () => [
      <span className="text-term-text">
        <span className="text-term-green">{site.name}</span> — a small software &
        apps studio.
      </span>,
      dim("We design, build and ship web & mobile products end-to-end."),
      dim("Remote-first. Small team, senior hands, no hand-offs."),
      <span>
        <span className="text-term-green">●</span>{" "}
        <span className="text-term-text">Currently taking on new projects.</span>
      </span>,
    ],
  },

  services: {
    desc: "what we build",
    run: () => [
      dim("what we build —"),
      ...site.services.map((s) => (
        <span>
          {"  "}
          <span className="text-term-cyan">{s.title}</span>
          <span className="text-term-dim"> — {s.blurb}</span>
        </span>
      )),
    ],
  },

  work: {
    desc: "selected work",
    run: () => [
      dim("selected work —"),
      ...site.projects.map((p) => (
        <span>
          {"  "}
          <span className="text-term-cyan">{p.name}</span>
          <span className="text-term-dim">
            {" "}
            ({p.kind}) — {p.blurb}
          </span>
        </span>
      )),
      <span> </span>,
      dim("(sample work — your project could be on this list.)"),
    ],
  },

  stack: {
    desc: "our toolbox",
    run: () => [
      dim("toolbox —"),
      <span className="text-term-text">
        {"  "}TypeScript · React · Next.js · React Native · Node · Postgres
      </span>,
      <span className="text-term-text">
        {"  "}Tailwind · Cloud (Vercel/AWS) · LLMs & vector search
      </span>,
    ],
  },

  contact: {
    desc: "get in touch",
    run: () => [
      <span className="text-term-text">Got an idea? We reply to every email.</span>,
      <span>
        {"  "}email:{" "}
        <a
          href={mailtoHref}
          className="text-term-green underline underline-offset-2 hover:text-term-cyan"
        >
          {site.email}
        </a>
      </span>,
      dim("  → click the address above to open your mail app."),
    ],
  },

  play: {
    desc: "play a quick game 🎮",
    run: (_args, ctx) => {
      ctx.startGuess();
      return [
        <span className="text-term-yellow">
          🎮 guess-the-number — I&apos;m thinking of a number between 1 and 100.
        </span>,
        dim("type a number and hit enter · type `quit` to leave."),
      ];
    },
  },

  clear: {
    desc: "clear the screen",
    run: (_args, ctx) => {
      ctx.clear();
      return null;
    },
  },

  // --- hidden / easter-egg commands -------------------------------------
  whoami: {
    desc: "",
    hidden: true,
    run: () => [
      <span className="text-term-text">
        visitor — a person with excellent taste. welcome 👋
      </span>,
    ],
  },
  ls: {
    desc: "",
    hidden: true,
    run: () => [
      <span className="text-term-text">
        about.txt{"  "}services/{"  "}work/{"  "}contact.md{"  "}
        <span className="text-term-green">play.sh*</span>
      </span>,
    ],
  },
  echo: {
    desc: "",
    hidden: true,
    run: (args) => [
      <span className="text-term-text">{args.join(" ") || " "}</span>,
    ],
  },
  date: {
    desc: "",
    hidden: true,
    run: () => [<span className="text-term-text">{new Date().toString()}</span>],
  },
  sudo: {
    desc: "",
    hidden: true,
    run: () => [
      <span className="text-term-text">
        nice try 😏 — you already have root over your own products.
      </span>,
    ],
  },
  hello: {
    desc: "",
    hidden: true,
    run: () => [<span className="text-term-text">hey there 👋 type `help` to explore.</span>],
  },
};

/** Parse and run a line. Handles unknown commands. Returns lines to print. */
export function runCommand(
  raw: string,
  ctx: CommandContext,
): ReactNode[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const [name, ...args] = trimmed.split(/\s+/);
  const cmd = commands[name.toLowerCase()];
  if (!cmd) {
    return [
      <span className="text-term-text">
        <span className="text-term-yellow">{name}</span>: command not found — type{" "}
        <span className="text-term-green">help</span>.
      </span>,
    ];
  }
  return cmd.run(args, ctx);
}

/** Names offered in chips / used for Tab completion. */
export const publicCommandNames = Object.entries(commands)
  .filter(([, c]) => !c.hidden)
  .map(([name]) => name);

export const allCommandNames = Object.keys(commands);

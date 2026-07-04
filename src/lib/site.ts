/**
 * Single source of truth for all editable site content.
 * Change copy, services, projects and contact details here.
 */

export type Service = {
  id: string;
  kanji: string;
  title: string;
  blurb: string;
};

export type Project = {
  id: string;
  name: string;
  kind: string;
  blurb: string;
  href?: string;
};

export const site = {
  name: "active IO labs",
  brandMark: "active_io_labs",
  domain: "activeiolabs.com",
  email: "sweswepradeep@gmail.com",

  description:
    "A small software studio. Ideas become web & mobile products — quietly, carefully, fast.",

  hero: {
    headline: "We craft software & apps.",
    sub: "A tiny product studio. Ideas become web & mobile products — quietly, carefully, fast.",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],

  services: [
    {
      id: "web",
      kanji: "網",
      title: "Web apps",
      blurb: "Fast, modern web apps that hold up under real users.",
    },
    {
      id: "mobile",
      kanji: "携",
      title: "Mobile apps",
      blurb: "iOS & Android from one codebase, with a native feel.",
    },
    {
      id: "mvp",
      kanji: "芽",
      title: "MVPs",
      blurb: "The smallest thing that proves the idea works.",
    },
    {
      id: "ai",
      kanji: "知",
      title: "AI features",
      blurb: "Useful AI, wired in without the hype.",
    },
  ] satisfies Service[],

  projects: [
    {
      id: "easel",
      name: "Easel",
      kind: "Dev tools · MCP server",
      blurb: "A local MCP server that puts a human in an AI agent's image loop.",
      href: "https://easel-web-one.vercel.app",
    },
    {
      id: "ledger",
      name: "Ledger",
      kind: "Fintech · Web app",
      blurb: "A realtime money dashboard with reconciliation and reporting.",
    },
    {
      id: "pulse",
      name: "Pulse",
      kind: "Health · Mobile",
      blurb: "A habit & fitness tracker with offline-first sync.",
    },
    {
      id: "forge",
      name: "Forge",
      kind: "Internal tools · Web app",
      blurb: "An internal platform that replaced a dozen spreadsheets.",
    },
    {
      id: "atlas",
      name: "Atlas",
      kind: "Logistics · MVP",
      blurb: "A route-planning MVP shipped in six weeks.",
    },
  ] satisfies Project[],

  socials: [
    { label: "GitHub", href: "https://github.com/activeio" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pradeep-swe/" },
  ],
} as const;

export const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
  "Project enquiry — active IO labs",
)}&body=${encodeURIComponent(
  "Hi active IO labs,\n\nI'd love to talk about a project.\n\n",
)}`;

/**
 * Single source of truth for all editable site content.
 * Change copy, services, projects and contact details here.
 */

export type Service = {
  id: string;
  title: string;
  blurb: string;
  tags: string[];
};

export type Project = {
  id: string;
  name: string;
  kind: string;
  blurb: string;
};

export const site = {
  name: "active IO labs",
  brandMark: "active_io_labs",
  domain: "activeiolabs.com",
  email: "sweswepradeep@gmail.com",

  description:
    "A small software & apps studio. We take ideas from blank screen to shipped — web, mobile, and the messy bits in between.",

  hero: {
    headline: "We build software & apps.",
    sub: "active IO labs is a tiny product studio. We turn ideas into fast, well-crafted web and mobile products — from first prototype to production.",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
  ],

  services: [
    {
      id: "web",
      title: "Web apps",
      blurb:
        "Fast, modern web apps with Next.js & React and a backend that holds up under real users.",
      tags: ["Next.js", "React", "APIs"],
    },
    {
      id: "mobile",
      title: "Mobile apps",
      blurb:
        "iOS & Android from one codebase. Native feel, smooth animations, quick iteration.",
      tags: ["React Native", "iOS", "Android"],
    },
    {
      id: "mvp",
      title: "MVPs & prototypes",
      blurb:
        "Validate an idea in weeks, not quarters. We build the smallest thing that proves it works.",
      tags: ["Discovery", "Prototype", "Launch"],
    },
    {
      id: "ai",
      title: "AI features",
      blurb:
        "Genuinely useful AI — assistants, search, automation — wired into your product without the hype.",
      tags: ["LLMs", "Search", "Automation"],
    },
  ] satisfies Service[],

  projects: [
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

  // Placeholder social links — swap in real URLs when ready.
  socials: [
    { label: "GitHub", href: "https://github.com/activeio" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/81358237/" },
  ],
} as const;

export const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
  "Project enquiry — active IO labs",
)}&body=${encodeURIComponent(
  "Hi active IO labs,\n\nI'd love to talk about a project.\n\n",
)}`;

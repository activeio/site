/**
 * Single source of truth for all editable site content.
 * Change copy, skills, experience, case studies and contact details here.
 */

export type SkillGroup = {
  category: string;
  items: string[];
};

export type Experience = {
  title: string;
  period: string;
  blurb: string;
};

export type CaseStudy = {
  id: string;
  name: string;
  oneLiner: string;
  role: "solo build" | "contributed";
  stack: string[];
  metrics: { label: string; value: string }[];
  body: {
    problem: string;
    decisions: string;
    outcome: string;
  };
  links?: {
    live?: string;
    repo?: string;
  };
};

export const site = {
  name: "Pradeep",
  brandMark: "Pradeep",
  domain: "activeiolabs.com",
  email: "pradeexsu@gmail.com",

  description:
    "I build web & mobile products — quietly, carefully, fast.",

  hero: {
    headline: "I build software & apps.",
    sub: "A solo full-stack engineer. Ideas become web & mobile products — quietly, carefully, fast.",
  },

  nav: [
    { label: "Work", href: "#work" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ],

  skills: [
    {
      category: "Languages",
      items: ["TypeScript"],
    },
    {
      category: "Frontend",
      items: ["React", "Next.js", "React Native / Expo", "Tailwind CSS", "Motion"],
    },
    {
      category: "Backend",
      items: ["Node.js", "Bun", "Hono"],
    },
    {
      category: "Data & Infra",
      items: ["Postgres", "Supabase", "DigitalOcean", "nginx", "GitHub Actions"],
    },
    {
      category: "Integrations & Ops",
      items: [
        "Razorpay",
        "WhatsApp Cloud API",
        "Resend",
        "Shiprocket",
        "Sentry",
        "Playwright",
      ],
    },
  ] satisfies SkillGroup[],

  experience: [
    {
      title: "Independent — Solo Full-Stack Engineer",
      period: "Ongoing",
      blurb:
        "Freelance, full-stack, end to end — product, backend, DevOps and security. See the Grain case study below for a full breakdown.",
    },
  ] satisfies Experience[],

  projects: [
    {
      id: "grain",
      name: "Grain",
      role: "solo build",
      oneLiner:
        "Solo full-stack engineer for a factory-direct furniture e-commerce platform — a Next.js storefront, a Bun/Hono API, and a React Native admin app, shipped end-to-end with the DevOps, cost engineering, and security review to run it in production.",
      stack: [
        "TypeScript",
        "Next.js 15",
        "React Native / Expo",
        "Bun",
        "Hono",
        "Supabase (Postgres, Auth, Storage, RLS)",
        "nginx",
        "GitHub Actions",
        "DigitalOcean",
        "Razorpay",
        "WhatsApp Cloud API",
        "Resend",
        "Shiprocket",
        "Sentry",
        "Playwright",
      ],
      metrics: [
        { label: "Video payload", value: "2MB to 317KB" },
        { label: "Order-count queries", value: "N queries to 1 RPC" },
        { label: "Backend test suite", value: "1,600+ tests" },
        { label: "Client surfaces", value: "3 apps, 1 monorepo, solo-run" },
      ],
      body: {
        problem:
          "Diagnosed a Supabase Cached-Egress overage to root cause: crawler traffic x image variants x cold caches, with no CDN in front of storage.",
        decisions:
          "Remediated across the stack — image thumbnails, next/image tuning, video re-encoding, payload/DTO trimming, DB query consolidation (N count-queries collapsed into one RPC), and a CDN architecture plan. Also built the product's multi-party 'white-label' order flow (a distributor buys on credit; a different end-customer receives it and sees a fully white-labeled tracking page — no brand, no price), GitHub Actions CI/CD coordinating backend + web + web-admin deploys, a native Android APK build with a custom in-app self-updater distributed via Supabase Storage, service-key/RLS and price-integrity security audits, and a 1,600+ test backend suite plus Playwright E2E.",
        outcome:
          "A production e-commerce platform running live for real users on a single DigitalOcean droplet — designed, built, and operated solo, with the egress overage remediated and a coordinated multi-app release pipeline in place.",
      },
    },
  ] satisfies CaseStudy[],

  socials: [
    { label: "GitHub", href: "https://github.com/activeio" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pradeep-swe/" },
  ],
} as const;

export const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(
  "Project enquiry",
)}&body=${encodeURIComponent(
  "Hi Pradeep,\n\nI'd love to talk about a project.\n\n",
)}`;

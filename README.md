# Pradeep — activeiolabs.com

Personal portfolio site for Pradeep, a solo full-stack engineer. A clean,
minimal landing page with a hand-built twist: the hero background is a live
**suminagashi ink-marbling simulation**, and the About section has a small
**fluid-ink bowl** you can stir.

Built with **Next.js 16** (App Router), **TypeScript**, **Tailwind CSS v4**, and
**Motion** for scroll/hover animations.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start   # production build
```

## Where things live

| Path | What |
|------|------|
| `src/lib/site.ts` | **Edit content here** — name, email, skills, experience, case studies, socials |
| `src/components/{Nav,Hero,About,Work,Contact,Footer}.tsx` | Page sections |
| `src/components/{Suminagashi,FluidInk,InkBackground,InkBowl}.tsx` | The ink/fluid canvas simulations (hero background + About's touch-the-water bowl) |
| `src/app/page.tsx` | Composes the page |
| `src/app/globals.css` | Theme tokens (colors, accent) + keyframes |
| `src/app/layout.tsx` | Fonts + SEO metadata |
| `src/app/{sitemap,robots,opengraph-image}.tsx` | SEO: sitemap, robots.txt, OG/Twitter share image |

### Case studies

`src/lib/site.ts`'s `projects` array holds real, shipped work only — each
entry needs a `oneLiner`, real `metrics` (sourced numbers, not estimates),
and a `body` (`problem` / `decisions` / `outcome`). `Work.tsx` renders them
as an expandable list; add a project by appending to that array.

## Deploy

Push to GitHub, import into [Vercel](https://vercel.com/new) (zero config), then
point the `activeiolabs.com` domain at the project.

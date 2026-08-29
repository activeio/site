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
npm run build     # static export -> out/
npm run preview   # serve out/ at http://localhost:3000
```

## Where things live

| Path | What |
|------|------|
| `src/lib/site.ts` | **Edit content here** — name, email, skills, experience, case studies, socials |
| `src/components/{Nav,Hero,About,Work,Contact,Footer}.tsx` | Page sections |
| `src/components/{Suminagashi,FluidInk,InkBackground,InkBowl}.tsx` | The ink/fluid canvas simulations (hero background + About's touch-the-water bowl) |
| `src/components/{Reveal,MagneticButton,Brand,CopyEmail}.tsx` | Small shared pieces |
| `src/app/page.tsx` | Composes the page |
| `src/app/globals.css` | Theme tokens (colors, accent) + keyframes |
| `src/app/layout.tsx` | Fonts + SEO metadata |
| `src/app/{sitemap,robots,opengraph-image}.tsx` | SEO: sitemap, robots.txt, OG/Twitter share image |

### Case studies

`src/lib/site.ts`'s `projects` array holds real, shipped work only — each
entry needs a `oneLiner` and (for a fuller entry) real `metrics` (sourced
numbers, not estimates) plus a `body` (`problem` / `decisions` / `outcome`).
A lighter entry can skip `metrics`/`body` and just link out via `links.live`.
`Work.tsx` renders them as an expandable list; add a project by appending to
that array.

### The ink

- `FluidInk` advects a coarse velocity grid and projects it divergence-free
  each frame; pointer movement injects velocity, a click drops pigment.
- `Suminagashi` is the cheaper background effect — ink rings pushed outward by
  each new drop.
- Both are canvas client components, lazy-loaded client-side only; under
  `prefers-reduced-motion: reduce` they do much less work per frame.
- Contact email is read from `src/lib/site.ts` — change it in one place.

## Deploy

The site is a static export (`output: "export"`) hosted on **Hostinger** shared
hosting: `next build` produces `out/`, which is served straight from
`public_html`. Pushing to `main` builds and uploads it via
`.github/workflows/deploy-hostinger.yml`.

See **[DEPLOY.md](./DEPLOY.md)** for the FTP secrets, the `activeiolabs.com`
domain/DNS/SSL setup, the manual `npm run package:hostinger` upload path, and
troubleshooting.

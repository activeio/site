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
| `src/app/rankreels/privacy/page.tsx` | Privacy policy for the RankReels Android app (`/rankreels/privacy/`, linked from its Play listing) |

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

The site is a static export (`output: "export"`): `next build` produces `out/`.
Since 2026-09-30 it is served by **nginx on the DigitalOcean droplet**
(168.144.20.21) from `/var/www/activeiolabs`:

```bash
./scripts/deploy-droplet.sh     # build + rsync out/ to the droplet
```

See **[DEPLOY.md](./DEPLOY.md)** — the droplet section at the top covers the
nginx site, DNS and HTTPS. The older Hostinger shared-hosting path
(`npm run package:hostinger`, and the FTP workflow now limited to manual runs)
is kept below it but no longer serves the domain.

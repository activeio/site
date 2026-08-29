# active IO labs — activeiolabs.com

The marketing site for **active IO labs**, a software & apps building studio.
A clean, minimal landing page with a twist: the hero is a **bowl of water
running a live ink simulation** — move the cursor through it to stir, click to
drop ink. Sumi ink on warm paper, one muted pine accent.

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
| `src/lib/site.ts` | **Edit content here** — name, email, tagline, services, projects, socials |
| `src/components/{Nav,Hero,Services,Work,Contact,Footer}.tsx` | Page sections |
| `src/components/InkBowl.tsx` | The hero artifact — interactive bowl of ink-in-water |
| `src/components/FluidInk.tsx` | The fluid simulation the bowl renders (stable-fluids on canvas) |
| `src/components/{Suminagashi,InkBackground}.tsx` | Ink-marbling canvas behind the hero |
| `src/components/{Reveal,MagneticButton,Brand,CopyEmail}.tsx` | Small shared pieces |
| `src/app/page.tsx` | Composes the page |
| `src/app/globals.css` | Theme tokens (colors, accent, type) + keyframes |
| `src/app/layout.tsx` | Fonts + SEO metadata |

### The ink
- `FluidInk` advects a coarse velocity grid and projects it divergence-free
  each frame; pointer movement injects velocity, a click drops pigment.
- `Suminagashi` is the cheaper background effect — ink rings pushed outward by
  each new drop.
- Both are canvas client components; under
  `prefers-reduced-motion: reduce` they settle into a static composition
  instead of animating.
- Contact email is read from `src/lib/site.ts` — change it in one place.

## Deploy

The site is a static export (`output: "export"`) hosted on **Hostinger** shared
hosting: `next build` produces `out/`, which is served straight from
`public_html`. Pushing to `main` builds and uploads it via
`.github/workflows/deploy-hostinger.yml`.

See **[DEPLOY.md](./DEPLOY.md)** for the FTP secrets, the `activeiolabs.com`
domain/DNS/SSL setup, the manual `npm run package:hostinger` upload path, and
troubleshooting.

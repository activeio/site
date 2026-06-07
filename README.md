# active IO labs — activeiolabs.com

The marketing site for **active IO labs**, a software & apps building studio.
A clean, minimal landing page with a twist: the hero is a **live interactive
terminal** (the name is _active IO labs_ → input/output). Visitors can type
commands like `help`, `about`, `services`, `contact`, and even `play` a small
guess-the-number game.

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
| `src/lib/site.ts` | **Edit content here** — name, email, tagline, services, projects, socials |
| `src/components/terminal/Terminal.tsx` | The interactive hero terminal (client component) |
| `src/components/terminal/commands.tsx` | Command registry (`help`, `about`, `play`, …). Add commands here |
| `src/components/{Nav,Hero,Services,Work,Contact,Footer}.tsx` | Page sections |
| `src/app/page.tsx` | Composes the page |
| `src/app/globals.css` | Theme tokens (colors, accent, terminal palette) + keyframes |
| `src/app/layout.tsx` | Fonts + SEO metadata |

### The terminal
- Type a command and hit enter. `↑`/`↓` walks history, `Tab` autocompletes,
  `Ctrl+L` clears.
- Add a command: drop an entry into the `commands` map in
  `commands.tsx`. Mark `hidden: true` to keep it out of `help` (an easter egg).
- Contact email is read from `src/lib/site.ts` — change it in one place.

## Deploy

Push to GitHub, import into [Vercel](https://vercel.com/new) (zero config), then
point the `activeiolabs.com` domain at the project.

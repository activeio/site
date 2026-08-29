# Deploying activeiolabs.com to Hostinger

The site is a **static export**. `next build` writes a self-contained
`out/` folder (HTML, CSS, JS, self-hosted fonts, icons and `.htaccess`) that
Hostinger's shared hosting can serve directly from `public_html` — no Node
runtime, no `next start`.

```bash
npm ci
npm run build      # -> out/
npm run preview    # serve out/ at http://localhost:3000 to check it locally
```

> Anything that needs a server (Route Handlers reading a request, Server
> Actions, ISR, `next/image` optimization, redirects/headers in
> `next.config.ts`) is unavailable on shared hosting. If the site ever needs
> those, move to a Hostinger VPS and drop `output: "export"`.

---

## 0. First: move the domain off Website Builder

As of this writing `activeiolabs.com` already resolves to Hostinger and serves
a **Hostinger Website Builder** placeholder ("Our exciting new website will
launch soon"):

```console
$ curl -sSI https://activeiolabs.com/ | grep -i '^server\|^x-hcdn'
server: hcdn
x-hcdn-cache-status: HIT
$ curl -sS https://activeiolabs.com/ | grep -o 'generator" content="[^"]*"'
generator" content="Hostinger Website Builder"
```

Website Builder is a separate product from shared hosting: it publishes
through Hostinger's own CDN, **not** from a `public_html` document root. While
the domain is attached to it, uploading files over FTP changes nothing that
visitors see — `https://activeiolabs.com/manifest.webmanifest` currently
returns 404, which is the Builder responding, not Apache.

So before either deploy path below will do anything:

hPanel -> **Websites** -> the `activeiolabs.com` entry -> confirm it is a
Website Builder site, then detach the domain from it and attach the domain to
the **hosting plan** instead (Website Builder -> *Manage* -> domain settings,
or *Add Website* on the hosting plan and point `activeiolabs.com` at it).

**This replaces the live placeholder page** — it is a visible change to a
domain that is currently serving, so make it deliberately. The Builder site
itself is not deleted by detaching the domain; it stays reachable on its
`*.hostingersite.com` preview URL.

Once the domain serves from `public_html`, an unconfigured document root shows
Hostinger's default index instead of the Builder page — that is the signal
that step 2 can proceed.

## 1. Point the hosting at the domain

In [hPanel](https://hpanel.hostinger.com):

1. **Websites -> Add Website** (or *Add domain to plan*) and enter
   `activeiolabs.com`. Hostinger creates `public_html` for it — note whether
   the path is `/public_html` (primary domain) or
   `/domains/activeiolabs.com/public_html` (addon domain); the deploy
   workflow's `server-dir` must match.
2. **DNS** — the domain already resolves to Hostinger
   (`2a02:4780:…`), so this is likely already done. Only if it stops
   resolving, or you move the domain to another registrar:
   - *Domain registered at Hostinger*: nothing to do — it is already pointed.
   - *Registered elsewhere*: at the current registrar, either
     - set the nameservers to Hostinger's (`ns1.dns-parking.com`,
       `ns2.dns-parking.com` — confirm the exact pair shown in
       hPanel -> Domains -> your domain), **or**
     - keep the registrar's DNS and add records pointing at the hosting IP
       from hPanel -> Websites -> Dashboard:

       | Type  | Name | Value                  |
       |-------|------|------------------------|
       | A     | `@`  | *server IP from hPanel* |
       | CNAME | `www`| `activeiolabs.com`     |

   Propagation is usually minutes, up to 24h.
3. **SSL**: hPanel -> Security -> SSL -> install the free Let's Encrypt
   certificate for `activeiolabs.com` and `www.activeiolabs.com`.
   Leave hPanel's **Force HTTPS toggle off** — `public/.htaccess` already
   issues the HTTPS redirect, and enabling both causes a redirect loop on
   some plans.

`public/.htaccess` (shipped into `out/.htaccess`) also handles: `www` ->
apex redirect, the `/route` -> `/route/` trailing slash, the custom 404,
gzip, long-lived caching for hashed assets with always-revalidated HTML,
and basic security headers.

---

## 2a. Deploy automatically (recommended)

`.github/workflows/deploy-hostinger.yml` builds on every push to `main` and
FTPS-syncs `out/` into `public_html`.

Add these repository secrets (**Settings -> Secrets and variables ->
Actions**), taking the values from hPanel -> Files -> **FTP Accounts**:

| Secret | Value |
|--------|-------|
| `HOSTINGER_FTP_HOST` | FTP hostname, e.g. `ftp.activeiolabs.com` |
| `HOSTINGER_FTP_USERNAME` | e.g. `u123456789.activeiolabs.com` |
| `HOSTINGER_FTP_PASSWORD` | that account's password |

Then run the workflow once from the **Actions** tab (*Deploy to Hostinger ->
Run workflow*) to verify, and it will run on each `main` push after that.

If the site lives in an addon-domain folder, change `server-dir` in the
workflow to `/domains/activeiolabs.com/public_html/`.

The sync mirrors `out/` — files in `public_html` that are not in the build
are deleted, except the excluded paths (`.well-known/` for certificate
renewal, `default.php`, dotfiles).

## 2b. Deploy by hand

```bash
npm run package:hostinger     # -> activeiolabs-site.zip
```

hPanel -> **File Manager** -> open `public_html` -> delete the placeholder
(`default.php` / Hostinger's index page) -> upload `activeiolabs-site.zip`
-> right-click -> **Extract** -> delete the zip.

`index.html` and `.htaccess` must sit **directly** in `public_html`, not in a
nested folder. Turn on "show hidden files" in File Manager to confirm
`.htaccess` extracted.

---

## 3. Verify

```bash
curl -sSI http://activeiolabs.com        | head -1   # 301 -> https
curl -sSI https://www.activeiolabs.com   | head -1   # 301 -> apex
curl -sS  https://activeiolabs.com       | grep -o "<title>[^<]*"
curl -sSI https://activeiolabs.com/manifest.webmanifest | grep -i content-type
```

Then in a browser: the hero ink bowl stirs as the cursor moves through it, the
scroll animations run, and an unknown URL such as
`https://activeiolabs.com/nope` renders the 404 page.

### If something looks wrong

| Symptom | Cause |
|---------|-------|
| "Website will launch soon" placeholder | The domain is still attached to Website Builder, not the hosting plan — see step 0. Nothing uploaded to `public_html` will show until that is changed. |
| Hostinger placeholder page | `public_html` still has `default.php`/`index.php` — Apache prefers it over `index.html`. Delete it. |
| Site loads, no CSS/JS | The `_next/` folder did not upload. Re-upload; make sure hidden/underscore folders are included. |
| Redirect loop | hPanel "Force HTTPS" is on *and* `.htaccess` redirects. Turn the toggle off. |
| 404 on every page but `/` | `.htaccess` missing (it is a dotfile — easy to lose in a manual upload). |
| Stale content after a deploy | Hostinger's LiteSpeed/Cloudflare cache — purge in hPanel -> Advanced -> Cache Manager. |

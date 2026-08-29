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

## 1. Point the hosting at the domain

In [hPanel](https://hpanel.hostinger.com):

1. **Websites -> Add Website** (or *Add domain to plan*) and enter
   `activeiolabs.com`. Hostinger creates `public_html` for it — note whether
   the path is `/public_html` (primary domain) or
   `/domains/activeiolabs.com/public_html` (addon domain); the deploy
   workflow's `server-dir` must match.
2. **DNS**
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
| Hostinger placeholder page | `public_html` still has `default.php`/`index.php` — Apache prefers it over `index.html`. Delete it. |
| Site loads, no CSS/JS | The `_next/` folder did not upload. Re-upload; make sure hidden/underscore folders are included. |
| Redirect loop | hPanel "Force HTTPS" is on *and* `.htaccess` redirects. Turn the toggle off. |
| 404 on every page but `/` | `.htaccess` missing (it is a dotfile — easy to lose in a manual upload). |
| Stale content after a deploy | Hostinger's LiteSpeed/Cloudflare cache — purge in hPanel -> Advanced -> Cache Manager. |

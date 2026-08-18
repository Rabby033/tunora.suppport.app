# Tunora — Support Website

A fast, static, dependency-free support website for **Tunora — Music Player** (iOS).
Built for use as the official **Support URL** in App Store Connect.

Everything lives in this one folder. There is **no build step** — it's plain HTML, CSS,
and a little vanilla JavaScript, so it hosts anywhere that serves static files.

## Pages

| File | Purpose |
| --- | --- |
| `index.html` | Support landing — search, categories, popular questions |
| `help.html` | Help Center — searchable FAQ (playback, search, library, playlists, premium, settings) |
| `troubleshooting.html` | Step-by-step fixes for common issues |
| `premium.html` | Tunora Pro, managing/canceling/restoring subscriptions |
| `music-content.html` | How third-party music/content works |
| `contact.html` | Contact form + direct support email |
| `privacy.html` | Privacy Policy |
| `terms.html` | Terms of Service |
| `404.html` | Not-found page |
| `styles.css` | All styling (dark, SF-Pro aesthetic) |
| `config.js` | **Editable** site config (email, legal links, subscription link) |
| `main.js` | Progressive enhancement (nav, search, FAQ deep-links, contact form) |
| `assets/logo.png`, `assets/apple-touch-icon.png` | App icon used for the brand mark and favicon |
| `assets/screenshots/` | Optimized app screenshots shown in the "A quick look" strip on the home page |
| `robots.txt`, `sitemap.xml` | SEO |
| `.nojekyll` | Tells GitHub Pages to serve files as-is |

## Configuration (one place)

Open **`config.js`** and edit the values:

```js
window.TUNORA_CONFIG = {
  supportEmail: "tunora.support@gmail.com",
  privacyUrl: "privacy.html",   // or an external URL
  termsUrl: "terms.html",       // or an external URL
  manageSubscriptionsUrl: "https://apps.apple.com/account/subscriptions",
  appStoreUrl: ""
};
```

These are applied across every page automatically. The HTML also contains
sensible default links, so the site still works if JavaScript is disabled.

> The support email `tunora.support@gmail.com` is hard-linked in the HTML as a
> `mailto:` fallback, so contacting support works even without JavaScript.

## Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
cd tunora-support
python3 -m http.server 8080
# visit http://localhost:8080
```

## Deploy to GitHub Pages

**Option A — this folder is its own repository (simplest):**

1. Create a new GitHub repo and push the **contents of this folder** to the repo root.
2. In the repo: **Settings → Pages → Build and deployment → Source: Deploy from a branch**.
3. Choose branch `main` and folder `/ (root)`. Save.
4. Your site goes live at `https://<username>.github.io/<repo>/`.

**Option B — keep it inside your app's repo:**

1. Move/keep this folder in your repo (e.g. `docs/`), or set Pages source to this folder.
2. **Settings → Pages** → pick the branch and the `/docs` (or root) folder.

Because every internal link is **relative**, the site works whether it's served
from the domain root or a sub-path — no changes needed.

### After deploying
- Update the base URL in `sitemap.xml` and `robots.txt` to your live domain.
- Set the **Support URL** in App Store Connect to the deployed `index.html` URL.

## Notes for the App Store
- The site is publicly accessible with **no login** required.
- It clearly identifies **Tunora — Music Player** and provides a working
  support contact (`tunora.support@gmail.com`).
- No placeholder text, no "coming soon" sections, no download-music claims.

© 2026 Rabby

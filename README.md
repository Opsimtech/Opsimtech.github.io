# OpSimTech — opsimtech.com

Static marketing site for OpSimTech. Deployed via **GitHub Pages** at [opsimtech.com](https://opsimtech.com).

## Stack

- Plain HTML + CSS — no build step, no framework
- `style.css` — shared design system tokens (palette, type scale, components)
- Google Fonts: **Geist** (display + body), **JetBrains Mono** (labels)
- GitHub Pages serves the `main` branch root

## Pages

| URL | File |
| --- | --- |
| `/` | `index.html` |
| `/method.html` | Method + simulation toolkit |
| `/insights.html` | Blog archive |
| `/industry-aerodynamics.html` | Industry vertical |
| `/industry-maritime-wasp.html` | Industry vertical |
| `/industry-thermal-systems.html` | Industry vertical |
| `/industry-battery-manufacturing.html` | Industry vertical |
| `/product-opsimbat.html` | Product page |
| `/product-opsimheat.html` | Product page |
| `/request-demo.html` · `/talk-to-engineer.html` · `/send-project-brief.html` | Contact landing pages |
| `/404.html` | Branded 404 |

OpSimNav is an **external** product hosted at [opsimnav.com](https://opsimnav.com) — linked from nav/footer, not in this repo.

## Design system (locked)

- **Background:** `#000`
- **Accent:** `#1AE0B5` (teal, matches OpSimNav)
- **Gradient on colored headlines:** `linear-gradient(135deg, #83f2a1, #1ae0b5 45%, #45c1ff)`
- **Headlines:** Title Case, never UPPERCASE
- **Subtle dot-grid background** on hero / page chrome

## Local development

No build step. Open any `.html` file in a browser, or run a tiny static server so internal links resolve:

```bash
# Option A — Python
python3 -m http.server 8000
# → visit http://localhost:8000

# Option B — Node
npx serve .
```

Or use the **Live Server** VS Code extension for auto-reload on save.

## Deploy

GitHub Pages is configured to serve from the `main` branch root. Every push deploys automatically (1–2 min).

```bash
git add .
git commit -m "Update content"
git push origin main
```

### One-time setup

1. **Repo settings → Pages**
   - Source: *Deploy from a branch*
   - Branch: `main`, folder: `/ (root)`
2. **Custom domain**
   - `CNAME` file in repo root contains `opsimtech.com` (already in place)
   - At your DNS provider, add records pointing to GitHub Pages:
     ```
     A     @     185.199.108.153
     A     @     185.199.109.153
     A     @     185.199.110.153
     A     @     185.199.111.153
     CNAME www   opsimtech.github.io.
     ```
   - GitHub → Settings → Pages → Custom domain: `opsimtech.com` → **Enforce HTTPS**
3. **Wait for DNS** (5 min – 24 h). Then `https://opsimtech.com` serves the site.

## SEO

- `sitemap.xml` lists all public pages — keep it in sync when adding pages
- `robots.txt` allows all crawlers, points to the sitemap
- Each page should have `<title>`, `<meta name="description">`, and Open Graph tags

## Files NOT for deploy

These live in the project for reference / design tooling but should be excluded or ignored on the live site:

- `Opsimtech Site v1–v4.html` — legacy design iterations
- `Opsimtech Logo.html`, `Opsimtech Site Light.html` — design explorations
- `design-canvas.jsx`, `tweaks-panel.jsx`, `marks.jsx` — design-system tooling
- `uploads/` — design tool scratch

If they end up in the repo they're harmless (orphaned, no links), but a clean deploy would omit them.

## Future

- **Decap CMS** at `/admin/` for dashboard-based content editing
- The original Laravel/Inertia codebase is preserved on a separate branch as a backup

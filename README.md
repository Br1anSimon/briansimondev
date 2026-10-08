# briansimon.dev

Portfolio site for Brian Simon, web design and development for local businesses.
Static HTML, CSS, and JavaScript with a three.js scene. Hosted on GitHub Pages.

## Structure

```
.
├── index.html            # Page markup
├── 404.html              # GitHub Pages "not found" page
├── CNAME                 # Custom domain for GitHub Pages
├── .nojekyll             # Serve files as-is (skip Jekyll)
├── robots.txt
├── sitemap.xml
├── demos/              # Concept sites (noindex), one folder each
└── assets/
    ├── css/
    │   ├── tokens.css    # Colors, fonts, type scale, spacing
    │   ├── base.css      # Reset, element defaults, utilities
    │   └── layout.css    # Header, hero, work, services, process, about, contact
    ├── js/
    │   ├── main.js       # Entry point; loads the 3D stage with a fallback
    │   ├── stage.js      # three.js scene (frames, lights, dust, scroll anchoring)
    │   ├── mockups.js    # Canvas-drawn site mockups + flat fallback
    │   └── ui.js         # Copy-email button, footer year
    └── img/
        ├── favicon.svg
        └── work/         # Client screenshots (icinghouse.jpg, powerhouse.jpg)
```

three.js 0.170.0 loads from jsDelivr through the import map in `index.html`. No build step.

## Run locally

ES modules don't load from `file://`, so serve the folder:

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy (GitHub Pages)

1. Push to `main`.
2. Repo **Settings → Pages**: Source "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Custom domain: `briansimon.dev` (already in `CNAME`). Turn on **Enforce HTTPS** once the certificate is issued.
4. DNS at your registrar:
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www`: `<your-github-username>.github.io`

## Adding a project

1. Add an `<article class="case">` in `index.html` with a `<a class="case-visual" id="anchor-N">`.
2. Add an entry to `PROJECTS` in `assets/js/mockups.js` (same order as the anchors) with a `draw` function, or drop a screenshot at `assets/img/work/<slug>.jpg`.
3. Add a hero position for it in `FAN` in `assets/js/stage.js`.

## Adding a concept site

1. Copy the site's `index.html` to `demos/<slug>/index.html`.
2. Keep the "Concept site by Brian Simon" note and `noindex` meta tag at the top/bottom of the page.
3. Add an `<article class="demo">` card in the `#concepts` section of `index.html`.

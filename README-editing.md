# Nway Millets — Quick deploy & edit guide

## Files in this package
- HTML pages: index.html, products.html, recipes.html, testimonials.html, about.html, contact.html, faq.html
- css/: vars.css, style.css
- js/: site.js
- content/: products.json, recipes.json, testimonials.json, site.json
- images/: (not included) — upload images referenced in content (filenames below)

## Required image filenames (placeholders)
- images/logo-text.png
- images/hero.jpg
- images/millet-kodo.jpg
- images/millet-foxtail.jpg
- images/millet-barnyard.jpg
- images/millet-browntop.jpg
- images/millet-little.jpg
- images/product-safflower.jpg
- images/product-niger.jpg
- images/product-palm-jaggery.jpg
- images/product-copper-bottle.jpg
- images/recipe-kodo-upma.jpg
- images/recipe-foxtail-dosa.jpg
- images/recipe-barnyard-idli.jpg
- images/testi1.jpg
- images/testi2.jpg
- images/testi3.jpg

## Quick local test (recommended)
1. Put all files in one folder (keep subfolders).
2. Run a simple local server (necessary because pages fetch JSON):
   - Python 3: `python -m http.server 8000`
   - Open: `http://localhost:8000/index.html`
3. If you double-click HTML (file://) the products/recipes will not load due to browser security.

## Deploy to GitHub Pages
1. Create a new repository on GitHub (e.g., nway-millets).
2. Upload all files and folders (Add file → Upload files). Keep folder structure.
3. Settings → Pages → Source: `main` branch, root `/` → Save.
4. Wait ~1 minute, then visit `https://<yourusername>.github.io/nway-millets/`

## Editing content after deploy
- Replace images: repo → images folder → Upload with same filename (overwrite).
- Edit products/recipes/testimonials: repo → content → open JSON → edit → commit.
- Invite collaborator: repo → Settings → Manage access → Invite collaborator.

## Troubleshooting
- If products don't show: ensure `content/products.json` exists and is valid JSON; check browser console for errors.
- If CSS looks off: confirm `css/vars.css` and `css/style.css` are uploaded and linked.

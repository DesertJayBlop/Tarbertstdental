# Tarbert Street Dental

Modular static website for the practice.

## Run locally

From this folder, run `python3 -m http.server 4173`, then open `http://localhost:4173/Home.dc.html`.

## Practice editor

Open `http://localhost:4173/admin.html` or select **Practice login** in the footer. Staff can edit, add, and remove team members and services, and update the hero and practice image URLs. Changes are stored in the browser's `localStorage`, so the editor is intentionally a lightweight content tool for the current static site rather than a shared cloud CMS.

## File structure

- `Home.dc.html` is the parent page.
- `styles/home.css` and `styles/admin.css` contain page-specific styling.
- `scripts/content.js` owns editable content defaults and persistence.
- `scripts/image-slot.js` owns image overrides.
- `scripts/home.js` and `scripts/admin.js` contain page behavior.
- `scripts/support.js` contains shared DOM and escaping helpers.
- `Service-CEREC-Crowns.dc.html` and `Service-Root-Canal.dc.html` are the two initial service pages prepared for business approval.
- `styles/service.css` and `scripts/service.js` are shared by both service pages.
- `assets/icons.svg` provides the reusable inline SVG icon set used across the public pages.

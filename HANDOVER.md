# OZ Park Hotel Website — Antigravity Guide

This folder contains the complete source code and local assets for the bilingual OZ Park Hotel website, configured for local backend development in Antigravity (all ChatGPT Sites authentication and hosting lock-in removed).

## Run the Website Anytime

1. **One-click launch:** Double-click `start-website.bat` to start the local backend server and open the website in your browser.
2. **Terminal launch:**
   ```bash
   npm run dev
   ```
   Open **http://localhost:3000** in your browser.

## Important Files

- `app/page.tsx` — Page structure, bilingual text, sliders, and interactions
- `app/globals.css` — Complete styling, responsive rules, and Arabic RTL layout
- `app/layout.tsx` — Site metadata and global page shell
- `public/` — Hero image, social preview images, favicon, and other local assets
- `vite.config.ts` — Clean Vite + `vinext` configuration

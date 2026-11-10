# OZ Park Hotel Website (Antigravity Edition)

Bilingual (Arabic RTL & English LTR) luxury lakeside resort website running on Vite + `vinext` with zero external login/auth lock-in.

## Quick Start (Local Backend)

You can start the backend server at any time by either:
- Double-clicking `start-website.bat`, or
- Running the following in your terminal:

```bash
npm run dev
```

Then open **http://localhost:3000** in your browser.

## Production Build

```bash
npm run build
npm run start
```

## Project Structure

- `app/page.tsx` — Page structure, bilingual text (`ar` / `en`), sliders, and interactions
- `app/globals.css` — Complete styling, responsive rules, and Arabic RTL layout
- `app/layout.tsx` — Site metadata and global page shell
- `public/` — Hero image, social preview images, favicon, and local assets
- `db/` & `drizzle.config.ts` — Optional Drizzle ORM + D1 database configuration

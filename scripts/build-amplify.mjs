import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "out");
const assetsDir = path.join(outDir, "assets");
const outImagesDir = path.join(outDir, "images", "ozpark");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(outImagesDir, { recursive: true });

// 1. Find all referenced images/videos in app/page.tsx + oz-park-icon.png
const pageSource = fs.readFileSync(path.join(projectRoot, "app", "page.tsx"), "utf8");
const referencedPaths = new Set([
  ...(pageSource.match(/\/images\/ozpark\/[a-zA-Z0-9._-]+/g) || []),
  "/images/ozpark/oz-park-icon.png",
  "/images/ozpark/hero-main.png",
]);

const pngToJpgMap = new Map();

for (const relPath of referencedPaths) {
  const fileName = path.basename(relPath);
  const srcDir = path.join(projectRoot, "public", "images", "ozpark");
  const srcFile = path.join(srcDir, fileName);

  if (fileName.endsWith(".png") && fileName !== "oz-park-icon.png") {
    const jpgName = fileName.replace(/\.png$/i, ".jpg");
    const srcJpg = path.join(srcDir, jpgName);
    if (fs.existsSync(srcJpg)) {
      pngToJpgMap.set(relPath, `/images/ozpark/${jpgName}`);
      fs.copyFileSync(srcJpg, path.join(outImagesDir, jpgName));
      continue;
    }
  }

  if (fs.existsSync(srcFile)) {
    fs.copyFileSync(srcFile, path.join(outImagesDir, fileName));
  }
}

// 1b. Copy optimized room gallery subdirectories (public/images/ozpark/rooms/**)
const srcRoomsDir = path.join(projectRoot, "public", "images", "ozpark", "rooms");
if (fs.existsSync(srcRoomsDir)) {
  fs.cpSync(srcRoomsDir, path.join(outImagesDir, "rooms"), { recursive: true });
}

// 2. Minify CSS from app/globals.css
await esbuild.build({
  entryPoints: [path.join(projectRoot, "app", "globals.css")],
  bundle: false,
  minify: true,
  outfile: path.join(assetsDir, "styles.css"),
});

// 3. Create temporary client entry and bundle React + app/page.tsx
const tempEntry = path.join(projectRoot, ".amplify-entry.tsx");
fs.writeFileSync(
  tempEntry,
  `import React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./app/page";

const container = document.getElementById("root");
if (container) {
  createRoot(container).render(<HomePage />);
}
`,
  "utf8"
);

const appJsPath = path.join(assetsDir, "app.js");
try {
  await esbuild.build({
    entryPoints: [tempEntry],
    bundle: true,
    minify: true,
    format: "esm",
    target: ["es2020"],
    jsx: "automatic",
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    outfile: appJsPath,
  });
} finally {
  fs.rmSync(tempEntry, { force: true });
}

// Replace converted .png photo paths with .jpg in compiled app.js
let appJsContent = fs.readFileSync(appJsPath, "utf8");
for (const [oldPath, newPath] of pngToJpgMap.entries()) {
  appJsContent = appJsContent.split(oldPath).join(newPath);
}
fs.writeFileSync(appJsPath, appJsContent, "utf8");

// 4. Write index.html at root of outDir
const indexHtml = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>فندق أوز بارك — القنفذة | OZ Park Hotel Al Qunfudhah</title>
  <meta name="description" content="في سواحل القنفذة وعلى مقربةٍ من البحر الأحمر، يقدّم فندق أوز بارك إقامة ساحلية فاخرة تجمع بين الخصوصية والرفاهية وإطلالات البحر الهادئة." />
  <link rel="icon" href="/images/ozpark/oz-park-icon.png" />
  <link rel="shortcut icon" href="/images/ozpark/oz-park-icon.png" />
  <meta property="og:title" content="فندق أوز بارك — OZ Park Hotel" />
  <meta property="og:description" content="جمال القنفذة من نافذة أوز بارك — Where Comfort Meets the Sea in Al Qunfudhah." />
  <meta property="og:image" content="/images/ozpark/hero-main.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="فندق أوز بارك — OZ Park Hotel" />
  <meta name="twitter:description" content="جمال القنفذة من نافذة أوز بارك — Where Comfort Meets the Sea in Al Qunfudhah." />
  <meta name="twitter:image" content="/images/ozpark/hero-main.jpg" />
  <link rel="stylesheet" href="/assets/styles.css" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/assets/app.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(outDir, "index.html"), indexHtml, "utf8");
console.log("Built AWS Amplify static output in:", outDir);

import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import * as esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const workspaceRoot = path.resolve(projectRoot, "..");
const outDir = path.join(workspaceRoot, "OZ-Park-Hotel-Cloudflare-Deploy");
const assetsDir = path.join(outDir, "assets");
const outImagesDir = path.join(outDir, "images", "ozpark");

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(assetsDir, { recursive: true });
fs.mkdirSync(outImagesDir, { recursive: true });

// 1. Find all referenced images in app/page.tsx + oz-park-icon.png
const pageSource = fs.readFileSync(path.join(projectRoot, "app", "page.tsx"), "utf8");
const referencedPaths = new Set([
  ...(pageSource.match(/\/images\/ozpark\/[a-zA-Z0-9._-]+/g) || []),
  "/images/ozpark/oz-park-icon.png",
  "/images/ozpark/hero-main.png",
]);

const pngToJpgMap = new Map();

for (const relPath of referencedPaths) {
  const fileName = path.basename(relPath);
  const srcFile = path.join(projectRoot, "public", "images", "ozpark", fileName);
  if (!fs.existsSync(srcFile)) continue;

  if (fileName.endsWith(".png") && fileName !== "oz-park-icon.png") {
    const jpgName = fileName.replace(/\.png$/i, ".jpg");
    const destJpg = path.join(outImagesDir, jpgName);
    pngToJpgMap.set(relPath, `/images/ozpark/${jpgName}`);
    // Copy temporarily for PowerShell System.Drawing conversion
    fs.copyFileSync(srcFile, path.join(outImagesDir, fileName));
  } else {
    fs.copyFileSync(srcFile, path.join(outImagesDir, fileName));
  }
}

// Convert large photo PNGs in outImagesDir to high-res 88% quality JPGs using .NET System.Drawing
const psScript = `
Add-Type -AssemblyName System.Drawing
$dir = '${outImagesDir.replace(/'/g, "''")}'
$codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
$ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 88L)

Get-ChildItem -Path $dir -Filter *.png | Where-Object { $_.Name -ne 'oz-park-icon.png' } | ForEach-Object {
  $img = [System.Drawing.Image]::FromFile($_.FullName)
  $jpgPath = [System.IO.Path]::ChangeExtension($_.FullName, '.jpg')
  $bmp = New-Object System.Drawing.Bitmap($img.Width, $img.Height)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.Clear([System.Drawing.Color]::White)
  $g.DrawImage($img, 0, 0, $img.Width, $img.Height)
  $bmp.Save($jpgPath, $codec, $ep)
  $g.Dispose()
  $bmp.Dispose()
  $img.Dispose()
  Remove-Item $_.FullName -Force
}
`;
execFileSync("powershell.exe", ["-NoProfile", "-Command", psScript], { stdio: "inherit" });

// 2. Minify CSS from app/globals.css
await esbuild.build({
  entryPoints: [path.join(projectRoot, "app", "globals.css")],
  bundle: false,
  minify: true,
  outfile: path.join(assetsDir, "styles.css"),
});

// 3. Create temporary client entry and bundle React + app/page.tsx
const tempEntry = path.join(projectRoot, ".cloudflare-entry.tsx");
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

// 5. Create POSIX-compliant zip file (with "/" forward slashes) for Cloudflare drag-and-drop
const zipPath = path.join(workspaceRoot, "oz-park-hotel-cloudflare.zip");
const zipPsScript = `
Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem
$sourceDir = '${outDir.replace(/'/g, "''")}'
$zipFile = '${zipPath.replace(/'/g, "''")}'
if (Test-Path $zipFile) { Remove-Item $zipFile -Force }
$ fileStream = [System.IO.File]::Open($zipFile, [System.IO.FileMode]::Create)
$archive = New-Object System.IO.Compression.ZipArchive($fileStream, [System.IO.Compression.ZipArchiveMode]::Create)
Get-ChildItem -Path $sourceDir -Recurse -File | ForEach-Object {
  $rel = $_.FullName.Substring($sourceDir.Length).TrimStart('\\', '/').Replace('\\', '/')
  [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($archive, $_.FullName, $rel, [System.IO.Compression.CompressionLevel]::Optimal) | Out-Null
}
$archive.Dispose()
$fileStream.Dispose()
`;
execFileSync("powershell.exe", ["-NoProfile", "-Command", zipPsScript.replace("$ fileStream", "$fileStream")], { stdio: "inherit" });

console.log("Built optimized Cloudflare folder:", outDir);
console.log("Built POSIX Cloudflare zip:", zipPath);

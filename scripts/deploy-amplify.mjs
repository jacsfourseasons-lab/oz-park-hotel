import fs from "node:fs/promises";
import path from "node:path";
import zlib from "node:zlib";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const outDir = path.join(projectRoot, "out");
const REGION = process.env.AWS_REGION || "us-east-1";
const BRANCH_NAME = "main";

async function runAws(args) {
  const { stdout } = await execFileAsync("aws", [...args, "--region", REGION, "--output", "json"]);
  return JSON.parse(stdout);
}

function createZipBuffer(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  for (const { name, data, compress } of files) {
    const nameBuf = Buffer.from(name, "utf8");
    const crc = zlib.crc32(data) >>> 0;
    const uncompressedSize = data.length;
    const compressedData = compress ? zlib.deflateRawSync(data, { level: 6 }) : data;
    const compressedSize = compressedData.length;
    const method = compress ? 8 : 0;

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0x0800, 6);
    localHeader.writeUInt16LE(method, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0x5962, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedSize, 18);
    localHeader.writeUInt32LE(uncompressedSize, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);

    localParts.push(localHeader, nameBuf, compressedData);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0x0800, 8);
    centralHeader.writeUInt16LE(method, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0x5962, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedSize, 20);
    centralHeader.writeUInt32LE(uncompressedSize, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);

    centralParts.push(centralHeader, nameBuf);
    offset += localHeader.length + nameBuf.length + compressedData.length;
  }

  const centralDirSize = centralParts.reduce((s, b) => s + b.length, 0);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirSize, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, ...centralParts, eocd]);
}

async function walk(dir) {
  const out = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else if (entry.isFile()) out.push(full);
  }
  return out;
}

// 1. Find or create AWS Amplify app "oz-park-hotel"
const appsRes = await runAws(["amplify", "list-apps"]);
let app = appsRes.apps?.find((a) => a.name === "oz-park-hotel");

if (!app) {
  console.log("Creating AWS Amplify app 'oz-park-hotel'...");
  const createAppRes = await runAws([
    "amplify",
    "create-app",
    "--name",
    "oz-park-hotel",
    "--platform",
    "WEB",
    "--custom-rules",
    "source=/<*>,target=/index.html,status=404-200",
  ]);
  app = createAppRes.app;
}
const appId = app.appId;
console.log(`Using AWS Amplify App ID: ${appId} (${app.defaultDomain})`);

// 2. Ensure branch "main" exists
const branchesRes = await runAws(["amplify", "list-branches", "--app-id", appId]);
const hasMain = branchesRes.branches?.some((b) => b.branchName === BRANCH_NAME);
if (!hasMain) {
  console.log(`Creating '${BRANCH_NAME}' branch on Amplify app ${appId}...`);
  await runAws([
    "amplify",
    "create-branch",
    "--app-id",
    appId,
    "--branch-name",
    BRANCH_NAME,
    "--stage",
    "PRODUCTION",
  ]);
}

// 3. Package out/ directory into ZIP buffer
const allFiles = await walk(outDir);
const zipEntries = [];
for (const fullPath of allFiles) {
  const rel = path.relative(outDir, fullPath).split(path.sep).join("/");
  const data = await fs.readFile(fullPath);
  const alreadyCompressed = /\.(mp4|webp|jpg|jpeg|png|woff2)$/i.test(rel);
  zipEntries.push({ name: rel, data, compress: !alreadyCompressed });
}

console.log(`Packaging ${zipEntries.length} files into deployment zip...`);
const zipBuffer = createZipBuffer(zipEntries);
console.log(`Created ZIP buffer: ${(zipBuffer.length / 1048576).toFixed(2)} MB`);

// 4. Create & upload deployment to AWS Amplify
console.log(`Creating AWS Amplify deployment on app ${appId} (branch: ${BRANCH_NAME})...`);
const deployInfo = await runAws([
  "amplify",
  "create-deployment",
  "--app-id",
  appId,
  "--branch-name",
  BRANCH_NAME,
]);

const { jobId, zipUploadUrl } = deployInfo;
console.log(`Uploading ZIP to Amplify S3 presigned URL (jobId: ${jobId})...`);

const uploadRes = await fetch(zipUploadUrl, {
  method: "PUT",
  headers: {
    "Content-Type": "application/zip",
    "Content-Length": String(zipBuffer.length),
  },
  body: zipBuffer,
});

if (!uploadRes.ok) {
  const errText = await uploadRes.text();
  throw new Error(`Upload failed (${uploadRes.status}): ${errText}`);
}
console.log("Upload complete. Starting Amplify deployment...");

await runAws([
  "amplify",
  "start-deployment",
  "--app-id",
  appId,
  "--branch-name",
  BRANCH_NAME,
  "--job-id",
  String(jobId),
]);

for (let i = 0; i < 40; i++) {
  await new Promise((r) => setTimeout(r, 3000));
  const jobRes = await runAws([
    "amplify",
    "get-job",
    "--app-id",
    appId,
    "--branch-name",
    BRANCH_NAME,
    "--job-id",
    String(jobId),
  ]);
  const status = jobRes?.job?.summary?.status;
  console.log(`Deployment job ${jobId} status: ${status}`);
  if (status === "SUCCEED") {
    console.log(`SUCCESS! Live at: https://${BRANCH_NAME}.${appId}.amplifyapp.com`);
    break;
  }
  if (status === "FAILED" || status === "CANCELLED") {
    throw new Error(`Amplify deployment ended with status: ${status}`);
  }
}

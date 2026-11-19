#!/usr/bin/env node
/** Create small card-only crops while retaining full-size detail/gallery images. */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log(
    "Usage: node scripts/prepare-thumbnails.mjs [--quality 80] [--width 528]\nCreates one 1.32-aspect card cover for each first valid catalog image. Next Image supplies responsive widths. Full images are never modified.",
  );
  process.exit(0);
}
function option(name, fallback) {
  const index = args.indexOf(name);
  return index < 0 ? fallback : Number(args[index + 1]);
}
const quality = option("--quality", 80);
const maxWidth = option("--width", 528);
if (!Number.isInteger(quality) || quality < 1 || quality > 100)
  throw new Error("Quality must be between 1 and 100.");
if (!Number.isInteger(maxWidth) || maxWidth < 100 || maxWidth > 640)
  throw new Error("Card width must be between 100 and 640 pixels.");
const aspect = 1.32;
const destination = path.join(root, "public/images/cards");
const manifestFile = path.join(root, "src/data/thumbnails.json");
const catalog = JSON.parse(
  await fs.readFile(path.join(root, "src/data/catalog.json"), "utf8"),
);
const media = JSON.parse(
  await fs.readFile(path.join(root, "src/data/media.json"), "utf8"),
);
const covers = new Map();
for (const item of catalog.items) {
  const sourceUrl = item.images.find((url) => media.images[url]);
  if (sourceUrl)
    covers.set(media.images[sourceUrl].src, {
      sourceUrl,
      full: media.images[sourceUrl],
    });
}
await fs.mkdir(destination, { recursive: true });
const manifest = {};
let sourceBytes = 0;
let outputBytes = 0;
for (const [fullSrc, { sourceUrl, full }] of covers) {
  const key = crypto
    .createHash("sha256")
    .update(sourceUrl)
    .digest("hex")
    .slice(0, 12);
  const extension = path.extname(new URL(sourceUrl).pathname).toLowerCase();
  const cachedOriginal = path.resolve(
    root,
    "../../work/media/originals",
    `${key}${extension}`,
  );
  let buffer;
  try {
    buffer = await fs.readFile(cachedOriginal);
  } catch {
    buffer = await fs.readFile(path.join(root, "public", fullSrc));
  }
  // The published master dimensions are already oriented and cap the crop so no source is enlarged.
  const width = Math.min(
    maxWidth,
    full.width,
    Math.round(full.height * aspect),
  );
  const height = Math.min(full.height, Math.round(width / aspect));
  const hash = crypto
    .createHash("sha256")
    .update(buffer)
    .update(`card-v1:${width}:${height}:${quality}`)
    .digest("hex")
    .slice(0, 10);
  const stem = path.basename(fullSrc, ".webp").replace(/-[a-f0-9]{10}$/, "");
  const filename = `${stem}-${hash}.webp`;
  const output = path.join(destination, filename);
  try {
    await fs.access(output);
  } catch {
    await sharp(buffer, { limitInputPixels: 50000000 })
      .rotate()
      .resize({
        width,
        height,
        fit: "cover",
        position: "centre",
        withoutEnlargement: true,
      })
      .webp({ quality, effort: 5 })
      .toFile(output);
  }
  const metadata = await sharp(output).metadata();
  const stat = await fs.stat(output);
  if (
    metadata.format !== "webp" ||
    metadata.width > full.width ||
    metadata.height > full.height
  ) {
    throw new Error(`Invalid or enlarged card image: ${filename}`);
  }
  manifest[fullSrc] = {
    src: `/images/cards/${filename}`,
    width: metadata.width,
    height: metadata.height,
    bytes: stat.size,
  };
  sourceBytes += full.bytes;
  outputBytes += stat.size;
}
await fs.writeFile(
  `${manifestFile}.tmp`,
  `${JSON.stringify(manifest, null, 2)}\n`,
);
await fs.rename(`${manifestFile}.tmp`, manifestFile);
console.log(
  JSON.stringify(
    {
      catalogItems: catalog.items.length,
      uniqueCovers: covers.size,
      maxWidth,
      quality,
      aspect,
      fullWebpBytes: sourceBytes,
      cardWebpBytes: outputBytes,
      savedPercent: Math.round((1 - outputBytes / sourceBytes) * 1000) / 10,
      medianBytes: Object.values(manifest)
        .map((image) => image.bytes)
        .sort((a, b) => a - b)[Math.floor(covers.size / 2)],
      verifiedFiles: Object.keys(manifest).length,
    },
    null,
    2,
  ),
);

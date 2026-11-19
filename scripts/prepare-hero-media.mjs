import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

const sources = JSON.parse(
  await fs.readFile("assets/hero-originals/sources.json", "utf8"),
);
const output = "public/images/hero-v2";
await fs.mkdir(output, { recursive: true });
const destinations = [];
const manifest = [];
for (const source of sources) {
  const original = await fs.readFile(source.original);
  const metadata = await sharp(original).metadata();
  if (metadata.width < 3200 || metadata.height < 1800) {
    throw new Error(`${source.id}: source is too small for a full-screen hero`);
  }
  const entry = { id: source.id, name: source.name };
  const files = [];
  for (const variant of ["desktop", "mobile", "thumbnail"]) {
    const pipeline = sharp(original).rotate();
    if (variant === "desktop")
      pipeline.resize({ width: 3200, withoutEnlargement: true });
    else if (variant === "mobile")
      pipeline.resize({
        width: 1080,
        height: 1620,
        fit: "cover",
        position: "centre",
        withoutEnlargement: true,
      });
    else
      pipeline.resize({
        width: 320,
        height: 240,
        fit: "cover",
        position: "centre",
        withoutEnlargement: true,
      });
    const { data, info } = await pipeline
      .webp({ quality: 80, effort: 5 })
      .toBuffer({ resolveWithObject: true });
    const hash = createHash("sha256").update(data).digest("hex").slice(0, 10);
    const filename = `${source.id}-${variant}-${hash}.webp`;
    await fs.writeFile(path.join(output, filename), data);
    const media = {
      src: `/images/hero-v2/${filename}`,
      width: info.width,
      height: info.height,
      bytes: info.size,
    };
    entry[
      variant === "desktop"
        ? "image"
        : variant === "mobile"
          ? "mobileImage"
          : "thumbnail"
    ] = media;
    files.push({
      variant,
      ...media,
      savingsPercent: Number(
        (100 * (1 - info.size / original.length)).toFixed(1),
      ),
    });
  }
  destinations.push(entry);
  manifest.push({
    ...source,
    originalWidth: metadata.width,
    originalHeight: metadata.height,
    originalBytes: original.length,
    quality: 80,
    files,
  });
}
await fs.writeFile(
  "src/data/hero-media.json",
  JSON.stringify({ destinations }, null, 2) + "\n",
);
await fs.writeFile(
  "reports/hero-media-manifest.json",
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(
  manifest.map(({ id, files }) => ({
    id,
    files: files.map(({ variant, width, height, bytes }) => ({
      variant,
      width,
      height,
      bytes,
    })),
  })),
);

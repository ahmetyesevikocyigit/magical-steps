import fs from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const qualityIndex = args.indexOf("--quality");
const quality = qualityIndex < 0 ? 80 : Number(args[qualityIndex + 1]);
if (!Number.isInteger(quality) || quality < 1 || quality > 100) throw new Error("Invalid WebP quality");
const media = JSON.parse(await fs.readFile(path.join(root, "src/data/hero-media.json"), "utf8"));
const manifestPath = path.join(root, "src/data/thumbnails.json");
const thumbnails = JSON.parse(await fs.readFile(manifestPath, "utf8"));
const report = [];
for (const destination of media.destinations) {
  const master = destination.image;
  const { data, info } = await sharp(path.join(root, "public", master.src))
    .resize({ width: 528, height: 400, fit: "cover", withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  const hash = createHash("sha256").update(data).digest("hex").slice(0, 10);
  const src = `/images/cards/${destination.id}-curated-${hash}.webp`;
  await fs.writeFile(path.join(root, "public", src), data);
  thumbnails[master.src] = { src, width: info.width, height: info.height, bytes: info.size };
  report.push({ destination: destination.id, master: master.src, masterBytes: master.bytes, ...thumbnails[master.src], quality });
}
await fs.writeFile(`${manifestPath}.tmp`, JSON.stringify(thumbnails, null, 2) + "\n");
await fs.rename(`${manifestPath}.tmp`, manifestPath);
await fs.writeFile(path.join(root, "reports/curated-card-manifest.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report));

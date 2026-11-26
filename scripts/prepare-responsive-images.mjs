import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Generate once, serve from the static CDN. Originals remain untouched.
const root = path.resolve("public");
const sizes = [320, 640, 960, 1440, 1920, 2560];
const widths = {};
const manifest = [];
async function walk(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    if (entry.name === "responsive") continue;
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(file)));
    else if (/\.webp$/i.test(file)) files.push(file);
  }
  return files.sort();
}
const files = await walk(path.join(root, "images"));
let index = 0;
async function worker() {
  while (index < files.length) {
    const file = files[index++];
    const src = "/" + path.relative(root, file).split(path.sep).join("/");
    const source = await fs.readFile(file);
    const metadata = await sharp(source).metadata();
    if (!metadata.width || (metadata.pages || 1) > 1)
      throw new Error(`Unsupported source: ${src}`);
    widths[src] = metadata.width;
    for (const width of sizes.filter((w) => w < metadata.width)) {
      const output = `/images/responsive/${width}${src}`;
      const target = path.join(root, output);
      await fs.mkdir(path.dirname(target), { recursive: true });
      try {
        await fs.access(target);
      } catch {
        await sharp(source)
          .rotate()
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 80, effort: 5 })
          .toFile(target);
      }
      const actual = await sharp(target).metadata();
      const bytes = (await fs.stat(target)).size;
      manifest.push({
        source: src,
        src: output,
        width: actual.width,
        height: actual.height,
        bytes,
        sourceBytes: source.length,
        savingsPercent: Math.round((1 - bytes / source.length) * 1000) / 10,
      });
    }
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
const sorted = Object.fromEntries(
  Object.entries(widths).sort(([a], [b]) => a.localeCompare(b)),
);
await fs.writeFile("src/data/image-widths.json", JSON.stringify(sorted));
await fs.writeFile(
  "reports/responsive-media-manifest.json",
  JSON.stringify(
    {
      quality: 80,
      sizes,
      sources: files.length,
      files: manifest.sort((a, b) => a.src.localeCompare(b.src)),
    },
    null,
    2,
  ) + "\n",
);
console.log(
  JSON.stringify({
    sources: files.length,
    variants: manifest.length,
    variantBytes: manifest.reduce((n, f) => n + f.bytes, 0),
  }),
);

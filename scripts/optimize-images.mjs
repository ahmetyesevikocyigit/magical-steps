#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { createRequire } from "node:module";
import { parseArgs } from "node:util";

const HELP = `Responsive WebP generator (Node 20+, Sharp installed in the working project)

node optimize-images.mjs --input photo.jpg --output public/images/photo-v2 --name photo

Required: --input FILE --output NEW_DIRECTORY --name lowercase-hyphen-name
Optional: --widths 320,640,960,1280,1600 --quality 78 --help

Preserves originals, orientation and transparency; never upscales.
Refuses an existing output directory, animated input, input over 50 MiB or 40 MP.
Writes width-named WebP files and manifest.json. Does not upload or publish.
`;

async function exists(file) {
  try {
    await fs.lstat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      input: { type: "string" },
      output: { type: "string" },
      name: { type: "string" },
      widths: { type: "string", default: "320,640,960,1280,1600" },
      quality: { type: "string", default: "78" },
      help: { type: "boolean" },
    },
    strict: true,
    allowPositionals: false,
  });
  if (values.help) {
    process.stdout.write(HELP);
    return;
  }
  if (!values.input || !values.output || !values.name)
    throw Error("--input, --output and --name are required. See --help.");
  if (
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(values.name) ||
    values.name.length > 80
  )
    throw Error("Use a lowercase hyphenated --name, at most 80 characters.");
  const widths = values.widths.split(",").map((value) => {
    if (!/^\d+$/.test(value))
      throw Error("Widths must be comma-separated integers.");
    return Number(value);
  });
  if (
    !widths.length ||
    widths.length > 16 ||
    widths.some(
      (width) => !Number.isSafeInteger(width) || width < 1 || width > 8192,
    )
  )
    throw Error("Supply 1–16 widths between 1 and 8192.");
  const quality = Number(values.quality);
  if (
    !/^\d+$/.test(values.quality) ||
    !Number.isInteger(quality) ||
    quality < 1 ||
    quality > 100
  )
    throw Error("Quality must be an integer from 1 to 100.");
  const input = path.resolve(values.input);
  const output = path.resolve(values.output);
  if (await exists(output))
    throw Error(
      "Output already exists. Choose a new directory; nothing was overwritten.",
    );
  const stat = await fs.stat(input);
  if (!stat.isFile() || stat.size > 50 * 1024 * 1024)
    throw Error("Input must be a regular file no larger than 50 MiB.");
  const source = await fs.readFile(input);
  if (source.length > 50 * 1024 * 1024) throw Error("Input exceeds 50 MiB.");
  const require = createRequire(path.join(process.cwd(), "package.json"));
  let sharp;
  try {
    sharp = require("sharp");
  } catch {
    throw Error(
      "Sharp is not available. Run from the project containing Sharp or install it with that project's package manager.",
    );
  }
  const options = { limitInputPixels: 40_000_000, failOn: "warning" };
  const metadata = await sharp(source, options).metadata();
  const allowed =
    ["jpeg", "png", "webp", "tiff"].includes(metadata.format) ||
    (metadata.format === "heif" && metadata.compression === "av1");
  if (!allowed)
    throw Error(
      `Unsupported input format: ${metadata.format}. Use a still JPEG, PNG, WebP, AVIF or TIFF.`,
    );
  if ((metadata.pages ?? 1) > 1)
    throw Error(
      "Multi-frame or multi-page sources require a separate workflow.",
    );
  if (!metadata.width || !metadata.height)
    throw Error("Input dimensions are missing.");
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const sourceWidth = rotated ? metadata.height : metadata.width;
  const sourceHeight = rotated ? metadata.width : metadata.height;
  const targets = [
    ...new Set(widths.map((width) => Math.min(width, sourceWidth))),
  ].sort((a, b) => a - b);
  const parent = path.dirname(output);
  await fs.mkdir(parent, { recursive: true });
  const stage = await fs.mkdtemp(path.join(parent, ".junior-media-"));
  let reserved = false;
  try {
    const variants = [];
    for (const width of targets) {
      const { data, info } = await sharp(source, options)
        .rotate()
        .resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 4 })
        .toBuffer({ resolveWithObject: true });
      const filename = `${values.name}-${info.width}.webp`;
      await fs.writeFile(path.join(stage, filename), data, { flag: "wx" });
      variants.push({
        file: filename,
        width: info.width,
        height: info.height,
        bytes: info.size,
      });
    }
    const manifest = {
      name: values.name,
      format: "webp",
      quality,
      source: {
        file: path.basename(input),
        width: sourceWidth,
        height: sourceHeight,
        bytes: source.length,
      },
      variants,
    };
    await fs.writeFile(
      path.join(stage, "manifest.json"),
      JSON.stringify(manifest, null, 2) + "\n",
      { flag: "wx" },
    );
    // Reserve exclusively, then replace our empty directory with the finished batch.
    await fs.mkdir(output);
    reserved = true;
    await fs.rename(stage, output);
    reserved = false;
    process.stdout.write(
      JSON.stringify({ output, ...manifest }, null, 2) + "\n",
    );
  } catch (error) {
    if (reserved) await fs.rmdir(output).catch(() => {});
    throw error;
  } finally {
    await fs.rm(stage, { recursive: true, force: true });
  }
}

main().catch((error) => {
  process.stderr.write(`junior-media: ${error.message}\n`);
  process.exitCode = 1;
});

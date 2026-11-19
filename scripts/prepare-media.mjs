#!/usr/bin/env node
/** Download authorised source media, preserve originals, and create content-addressed WebP files. */
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const workspace = path.resolve(root, "../..");
const originals = path.join(workspace, "work/media/originals");
const outdir = path.join(root, "public/images");
const manifestPath = path.join(root, "src/data/media.json");
const args = process.argv.slice(2);
if (args.includes("--help")) {
  console.log(
    "Usage: node scripts/prepare-media.mjs [--quality 80]\nDownloads all catalog and source-inventory images, retains originals under work/media, and generates public WebP assets plus src/data/media.json.",
  );
  process.exit(0);
}
const qualityIndex = args.indexOf("--quality");
const quality = qualityIndex < 0 ? 80 : Number(args[qualityIndex + 1]);
if (!Number.isInteger(quality) || quality < 1 || quality > 100)
  throw new Error("Quality must be an integer between 1 and 100.");
const site = "https://www.magical-steps.com";
const known = {
  hero: `${site}/contents/img/temp/slayt/tour-slide.jpg`,
  logo: `${site}/contents/img/temp/magical-steps-travel.png`,
  ephesus: `${site}/contents/img/temp/slayt/tour-slide.jpg`,
  istanbul: `${site}/contents/img/tour/sultanahmet-istanbul_700_pgo.jpg`,
  cappadocia: `${site}/contents/img/tour/cappadocia-balloons-1024_700_g7c.jpg`,
  pamukkale: `${site}/contents/img/tour/travertine-terraces-of-pamukkale-turkey-oceancorbis_700_222o.jpg`,
  sailing: `${site}/contents/img/temp/sailing-gulet-2.jpg`,
  hotel: `${site}/contents/img/temp/slayt/hotel-slide.jpg`,
  transfer: `${site}/contents/img/temp/slayt/airport-transfer-header.jpg`,
};
await fs.mkdir(originals, { recursive: true });
await fs.mkdir(outdir, { recursive: true });
await fs.mkdir(path.dirname(manifestPath), { recursive: true });
async function json(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    return fallback;
  }
}
const prior = await json(manifestPath, { images: {}, featured: {} });
const urls = new Set(Object.values(known));
Object.keys(prior.images).forEach((url) => urls.add(url));
function collect(value) {
  if (typeof value === "string") {
    if (
      /^https?:\/\//.test(value) &&
      /\.(jpe?g|png|webp|avif|tiff?)(?:[?#]|$)/i.test(value)
    )
      urls.add(value);
    for (const match of value.matchAll(
      /(?:src|href)=["']([^"']+\.(?:jpe?g|png|webp|avif))["']/gi,
    )) {
      try {
        urls.add(new URL(match[1], site).href);
      } catch {}
    }
  } else if (Array.isArray(value)) value.forEach(collect);
  else if (value && typeof value === "object")
    Object.values(value).forEach(collect);
}
collect(await json(path.join(root, "src/data/catalog.json"), {}));
collect(await json(path.join(workspace, "work/source/asset-urls.json"), []));
collect(await json(path.join(workspace, "work/media/extra-assets.json"), []));
const images = { ...prior.images };
const failures = [];
let downloaded = 0;
const candidates = [...urls].filter((url) => {
  try {
    return (
      /(^|\.)magical-steps\.com$/.test(new URL(url).hostname) &&
      !/blank|plus-icon|mai-icon|tripadvisor_logo|flag/i.test(url)
    );
  } catch {
    return false;
  }
});
async function processImage(sourceUrl) {
  try {
    if (
      prior.quality === quality &&
      images[sourceUrl] &&
      (await fs
        .stat(path.join(root, "public", images[sourceUrl].src))
        .catch(() => null))
    )
      return;
    const key = crypto
      .createHash("sha256")
      .update(sourceUrl)
      .digest("hex")
      .slice(0, 12);
    const ext =
      path.extname(new URL(sourceUrl).pathname).toLowerCase() || ".img";
    const original = path.join(originals, `${key}${ext}`);
    let buffer;
    try {
      buffer = await fs.readFile(original);
      await sharp(buffer, { limitInputPixels: 50000000 }).metadata();
    } catch {
      // Invalid/empty server responses are kept separately, never mistaken for a cached photograph.
      if (buffer)
        await fs
          .rename(original, `${original}.invalid-${Date.now()}`)
          .catch(() => {});
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const response = await fetch(sourceUrl, {
            signal: AbortSignal.timeout(30000),
            headers: {
              "User-Agent": "MagicalSteps-local-content-migration/1.0",
            },
          });
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          buffer = Buffer.from(await response.arrayBuffer());
          if (!buffer.length) throw new Error("Source returned an empty file");
          if (
            (response.headers.get("content-type") || "").includes("text/html")
          )
            throw new Error("Source returned HTML instead of an image");
          if (buffer.length > 30 * 1024 * 1024)
            throw new Error("Source exceeds 30 MB limit");
          await sharp(buffer, { limitInputPixels: 50000000 }).metadata();
          await fs.writeFile(original, buffer, { flag: "wx" });
          downloaded++;
          break;
        } catch (error) {
          if (attempt === 2) throw error;
        }
      }
    }
    const metadata = await sharp(buffer, {
      limitInputPixels: 50000000,
    }).metadata();
    if ((metadata.pages || 1) > 1)
      throw new Error("Animated source requires a separate workflow");
    const maxWidth = sourceUrl === known.hero ? 2560 : 1600;
    const basename =
      decodeURIComponent(path.basename(new URL(sourceUrl).pathname, ext))
        .normalize("NFKD")
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase()
        .slice(0, 70) || "photo";
    const hash = crypto
      .createHash("sha256")
      .update(buffer)
      .update(`${quality}:${maxWidth}`)
      .digest("hex")
      .slice(0, 10);
    const filename = `${basename}-${hash}.webp`;
    const destination = path.join(outdir, filename);
    let info;
    try {
      await fs.access(destination);
      info = await sharp(destination).metadata();
      info.size = (await fs.stat(destination)).size;
    } catch {
      info = await sharp(buffer, { limitInputPixels: 50000000 })
        .rotate()
        .resize({ width: maxWidth, withoutEnlargement: true })
        .webp({ quality, effort: 5 })
        .toFile(destination);
    }
    images[sourceUrl] = {
      src: `/images/${filename}`,
      width: info.width,
      height: info.height,
      bytes: info.size,
      originalBytes: buffer.length,
    };
  } catch (error) {
    failures.push({ url: sourceUrl, error: String(error.message || error) });
  }
}
let cursor = 0;
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (cursor < candidates.length) {
      const url = candidates[cursor++];
      await processImage(url);
      if (cursor % 25 === 0)
        console.log(`Images processed ${cursor}/${candidates.length}`);
    }
  }),
);
const featured = { ...prior.featured };
for (const [key, url] of Object.entries(known))
  if (images[url]) featured[key] = images[url].src;
const pick = (pattern) =>
  Object.entries(images).find(
    ([url, entry]) => pattern.test(url) && entry.width >= 500,
  )?.[1]?.src;
featured.istanbul ||=
  pick(/istanbul|ayasofya|sultanahmet|hagia|bosphorus/i) || featured.ephesus;
featured.cappadocia ||=
  pick(/cappadocia|kapadokya|goreme|balloon/i) || featured.ephesus;
const videoSources = await json(
  path.join(workspace, "work/media/videos.json"),
  prior.videos || [],
);
const videos = videoSources
  .map((video) => {
    const sourceThumbnailUrl = video.thumbnail || video.sourceThumbnailUrl;
    const image = images[sourceThumbnailUrl];
    if (!image) return null;
    return {
      id: new URL(video.url).pathname.split("/").filter(Boolean).pop(),
      url: video.url,
      title: video.title || "",
      author: video.author || "",
      src: image.src,
      sourceThumbnailUrl,
      metadataSource: video.metadataSource || "",
    };
  })
  .filter(Boolean);
if (videos[0]) featured.video = videos[0].src;
const entries = Object.values(images);
let alphaOutputs = 0;
for (const entry of entries) {
  const output = path.join(root, "public", entry.src);
  const metadata = await sharp(output).metadata();
  const stat = await fs.stat(output);
  if (
    metadata.format !== "webp" ||
    metadata.width !== entry.width ||
    metadata.height !== entry.height ||
    stat.size !== entry.bytes
  ) {
    throw new Error(`Output verification failed: ${entry.src}`);
  }
  if (metadata.hasAlpha) alphaOutputs++;
}
const originalBytes = entries.reduce(
  (sum, entry) => sum + entry.originalBytes,
  0,
);
const optimizedBytes = entries.reduce((sum, entry) => sum + entry.bytes, 0);
const largerThanOriginal = entries.filter(
  (entry) => entry.bytes > entry.originalBytes,
).length;
const result = {
  images,
  featured,
  videos,
  generatedAt: new Date().toISOString(),
  quality,
  stats: {
    count: entries.length,
    originalBytes,
    optimizedBytes,
    savedPercent: Math.round((1 - optimizedBytes / originalBytes) * 1000) / 10,
    largerThanOriginal,
    verifiedFiles: entries.length,
    alphaOutputs,
  },
  failures,
};
await fs.writeFile(
  `${manifestPath}.tmp`,
  `${JSON.stringify(result, null, 2)}\n`,
);
await fs.rename(`${manifestPath}.tmp`, manifestPath);
await fs.writeFile(
  path.join(workspace, "work/media/source-manifest.json"),
  `${JSON.stringify({ downloaded, source: site, collectedAt: new Date().toISOString(), candidates, failures }, null, 2)}\n`,
);
await fs.writeFile(
  path.join(root, "media-audit.md"),
  `# Magical Steps media audit\n\nUpdated: ${result.generatedAt}\n\n- Source: the authorised existing [Magical Steps website](https://www.magical-steps.com/). No third-party stock photography was substituted.\n- ${entries.length} raster assets converted to WebP at quality ${quality}; photographs were auto-oriented, metadata removed, and transparency retained.\n- Original bytes: ${originalBytes.toLocaleString("en-US")}; WebP bytes: ${optimizedBytes.toLocaleString("en-US")}; aggregate saving: ${result.stats.savedPercent}%. ${largerThanOriginal} individual WebP files are larger than their already-compressed source; the manifest preserves exact comparisons.\n- Hero max width: 2560 px. Other source images max width: 1600 px. Small source images are never enlarged; the existing hero is 1350 × 900 px.\n- Original files remain in the workspace's work/media/originals directory. Output filenames include a content/settings hash. Re-running the command reuses originals and existing matching conversions.\n- Responsive delivery is handled by Next Image; this script deliberately generates one optimised master per source instead of redundant responsive variants.\n- Cormorant Garamond and Manrope WOFF2 fonts are hosted locally with Latin, extended Latin, Cyrillic and extended Cyrillic subsets. Fonts were fetched from Google Fonts; OFL license files and local font-face CSS are in public/fonts.\n- Source URL, final dimensions and exact byte sizes are recorded in src/data/media.json.\n- ${videos.length} source YouTube video links retain their original website thumbnail pairings as local WebP. Titles and channel names were verified with YouTube oEmbed; video players are not fetched by this pipeline.\n\n## Source failures\n\n${failures.length ? failures.map((f) => `- ${f.url}: ${f.error}`).join("\n") : "None."}\n\nSource failures are not substitute images. The UI must omit unavailable decorative images and use verified local images for product thumbnails. All ${entries.length} output files were decoded and checked for WebP format, matching dimensions and exact byte counts. ${alphaOutputs} outputs retain an alpha channel. Browser currentSrc, loading, clipping and layout-shift verification are performed by the application QA pass.\n`,
);
console.log(
  JSON.stringify(
    { ...result.stats, failures: failures.length, featured },
    null,
    2,
  ),
);

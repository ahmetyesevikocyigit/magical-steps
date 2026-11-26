import fs from "node:fs/promises";
import { localizePath, legacyTarget } from "../src/i18n/locale-config.ts";
const base = process.env.AUDIT_URL || "http://127.0.0.1:3000";
const catalog = JSON.parse(
  await fs.readFile(
    new URL("../src/data/catalog.json", import.meta.url),
    "utf8",
  ),
);
const legacy = JSON.parse(
  await fs.readFile(
    new URL("../src/data/legacy.json", import.meta.url),
    "utf8",
  ),
);
const media = JSON.parse(
  await fs.readFile(new URL("../src/data/media.json", import.meta.url), "utf8"),
);
const thumbnails = JSON.parse(
  await fs.readFile(
    new URL("../src/data/thumbnails.json", import.meta.url),
    "utf8",
  ),
);
const heroMedia = JSON.parse(
  await fs.readFile(new URL("../src/data/hero-media.json", import.meta.url), "utf8"),
);
const fontFiles = (await fs.readdir(new URL("../public/fonts/", import.meta.url)))
  .filter((name) => name.endsWith(".woff2"));
const locales = ["en", "tr", "fr", "de", "nl", "ru"],
  roots = {
    tour: "tours",
    hotel: "hotels",
    sailing: "sailing",
    transfer: "transfers",
  };
const local = localizePath;
const mandatory = [
  "/",
  "/tours",
  "/find-your-tour",
  "/hotels",
  "/sailing",
  "/transfers",
  "/about",
  "/contact",
  "/gallery",
  "/blog",
  "/reviews",
  "/why-choose-us",
  "/ephesus-map",
  "/terms",
  "/privacy",
  "/distance-sales-agreement",
  "/satisfaction-guarantee",
  "/pay-cash-on-arrival",
];
const routes = [
  ...new Set([
    ...mandatory,
    ...catalog.items.map((i) => `/${roots[i.kind]}/${i.slug}`),
    ...catalog.pages.map((p) => `/${p.slug}`),
    ...catalog.categories.map((c) => `/${roots[c.kind]}?category=${c.id}`),
  ]),
];
const queue = locales.flatMap((l) =>
  routes.map((p) => ({ path: local(p, l), locale: l, type: "page" })),
);
for (const [path, originalTarget] of Object.entries(legacy)) {
  const target = legacyTarget(originalTarget);
  if (path !== target) queue.push({ path, target, type: "redirect" });
}
for (const image of [
  ...Object.values(media.images),
  ...Object.values(thumbnails),
  ...heroMedia.destinations.flatMap((destination) => [destination.image, destination.mobileImage, destination.thumbnail]),
])
  queue.push({ path: image.src, type: "image" });
for (const path of [
  "/sitemap.xml",
  "/robots.txt",
  "/favicon.svg",
  "/images/hotel-placeholder.svg",
  ...fontFiles.map((name) => `/fonts/${name}`),
])
  queue.push({ path, type: "asset" });
const seen = new Set(queue.map((r) => r.path));
const internal = new Set();
const failures = [];
let completed = 0;
const results = [];
async function work(job) {
  try {
    const res = await fetch(base + job.path, {
      redirect: "manual",
      signal: AbortSignal.timeout(30000),
    });
    let error = "";
    if (job.type === "redirect") {
      const location = res.headers.get("location");
      if (res.status !== 308 || !location)
        error = `Expected permanent 308 redirect, got ${res.status}`;
      else {
        const u = new URL(location, base);
        if (u.pathname + u.search !== job.target)
          error = `Redirect target ${u.pathname + u.search} != ${job.target}`;
        if (!seen.has(u.pathname + u.search)) {
          seen.add(u.pathname + u.search);
          internal.add(u.pathname + u.search);
        }
      }
    } else if (res.status !== 200) error = `HTTP ${res.status}`;
    if (job.type === "page" && res.status === 200) {
      const html = await res.text();
      if (!html.includes(`<html lang="${job.locale}"`))
        error += " Incorrect html language";
      if (!/<h1[ >]/.test(html)) error += " Missing H1";
      if (!/<title>[^<]+<\/title>/.test(html)) error += " Missing title";
      if (!html.includes('rel="canonical"')) error += " Missing canonical";
      for (const m of html.matchAll(/(?:href|src)="([^"<>]+)"/g)) {
        const href = m[1].replaceAll("&amp;", "&");
        if (
          !href.startsWith("/") ||
          href.startsWith("//") ||
          href.startsWith("/_next/") ||
          href.startsWith("/fonts/")
        )
          continue;
        const path = href.split("#")[0];
        if (path && !seen.has(path)) {
          seen.add(path);
          internal.add(path);
        }
      }
    } else if (job.type === "redirect") {
      await res.body?.cancel();
    } else {
      const bytes = await res.arrayBuffer();
      if (res.status === 200 && bytes.byteLength === 0) error += " Empty response body";
    }
    if (error) failures.push({ ...job, error });
    results.push({
      path: job.path,
      type: job.type,
      status: res.status,
      error: error || undefined,
    });
  } catch (e) {
    failures.push({ ...job, error: e.message });
  }
  completed++;
  if (completed % 100 === 0)
    console.log(
      `${completed}/${queue.length} checked; ${failures.length} failures`,
    );
}
let cursor = 0;
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (cursor < queue.length) {
      const next = cursor++;
      await work(queue[next]);
    }
  }),
);
for (const path of internal) await work({ path, type: "internal" });
const report = {
  at: new Date().toISOString(),
  base,
  checked: completed,
  counts: {
    pages: locales.length * routes.length,
    redirects: queue.filter((j) => j.type === "redirect").length,
    images: queue.filter((j) => j.type === "image").length,
    assets: queue.filter((j) => j.type === "asset").length,
    discoveredLinks: internal.size,
  },
  failures,
  results,
};
await fs.mkdir(new URL("../reports/", import.meta.url), { recursive: true });
await fs.writeFile(
  new URL("../reports/link-audit.json.tmp", import.meta.url),
  JSON.stringify(report, null, 2),
);
await fs.rename(new URL("../reports/link-audit.json.tmp", import.meta.url), new URL("../reports/link-audit.json", import.meta.url));
console.log(JSON.stringify({ ...report, results: undefined }, null, 2));
if (failures.length) process.exitCode = 1;

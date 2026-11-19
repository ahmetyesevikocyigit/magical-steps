import lighthouse, { desktopConfig } from "lighthouse";
import { launch } from "chrome-launcher";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const reportRoot = process.env.AUDIT_REPORT_DIR || fileURLToPath(new URL("../reports/", import.meta.url));
async function saveReport(name, data) {
  const file = path.join(reportRoot, name);
  await fs.writeFile(`${file}.tmp`, data);
  await fs.rename(`${file}.tmp`, file);
}
const url = process.env.AUDIT_URL || "http://127.0.0.1:3000/";
const modes =
  process.argv.includes("--single") || process.argv.includes("--mobile-only")
    ? ["mobile"]
    : ["mobile", "desktop"];
const count = process.argv.includes("--single") ? 1 : 3;
const all = [];
const invalid = [];
const label = process.env.AUDIT_LABEL
  ? process.env.AUDIT_LABEL.replace(/[^a-z0-9-]/gi, "") + "-"
  : "";
await fs.mkdir(reportRoot, { recursive: true });
for (const mode of modes) {
  for (let i = 1; i <= count; i++) {
    const chrome = await launch({
      chromePath:
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      chromeFlags: [
        "--headless=new",
        "--disable-gpu",
        "--no-first-run",
        "--no-default-browser-check",
      ],
    });
    try {
      const result = await lighthouse(
        url,
        {
          port: chrome.port,
          output: "json",
          logLevel: "error",
          onlyCategories: [
            "performance",
            "accessibility",
            "best-practices",
            "seo",
          ],
        },
        mode === "desktop" ? desktopConfig : undefined,
      );
      const lhr = result.lhr;
      if (lhr.runtimeError || Object.values(lhr.categories).some(category => category.score == null)) {
        const failure = { mode, run: i, error: lhr.runtimeError || "Incomplete category scores" };
        invalid.push(failure);
        await saveReport(`lighthouse-${label}invalid-${invalid.length}.json`, JSON.stringify(lhr, null, 2));
        console.error("INVALID_RUN", JSON.stringify(failure));
        if (invalid.length >= 2) throw new Error("Two incomplete Lighthouse traces; inspect the saved errors.");
        i--;
        continue;
      }
      await saveReport(
        `lighthouse-${label}${mode}-${i}.json`,
        JSON.stringify(lhr, null, 2),
      );
      const row = {
        mode,
        run: i,
        scores: Object.fromEntries(
          Object.entries(lhr.categories).map(([k, v]) => [
            k,
            Math.round(v.score * 100),
          ]),
        ),
        metrics: Object.fromEntries(
          [
            "first-contentful-paint",
            "largest-contentful-paint",
            "total-blocking-time",
            "cumulative-layout-shift",
            "speed-index",
          ].map((k) => [k, lhr.audits[k].numericValue]),
        ),
        failed: Object.entries(lhr.audits)
          .filter(([, a]) => a.score !== null && a.score < 0.9)
          .map(([id, a]) => ({
            id,
            title: a.title,
            score: a.score,
            display: a.displayValue,
            details: a.details,
          })),
      };
      all.push(row);
      console.log(
        JSON.stringify({
          ...row,
          failed: row.failed.map((a) => ({
            id: a.id,
            score: a.score,
            display: a.display,
          })),
        }),
      );
    } finally {
      await chrome.kill();
    }
  }
}
const median = {};
for (const mode of modes) {
  const rows = all.filter((r) => r.mode === mode);
  median[mode] = Object.fromEntries(
    Object.keys(rows[0].scores).map((k) => [
      k,
      rows.map((r) => r.scores[k]).sort((a, b) => a - b)[
        Math.floor(rows.length / 2)
      ],
    ]),
  );
}
await saveReport(
  `lighthouse-${label}summary.json`,
  JSON.stringify(
    { url, at: new Date().toISOString(), median, runs: all, invalid },
    null,
    2,
  ),
);
console.log("MEDIAN", JSON.stringify(median));

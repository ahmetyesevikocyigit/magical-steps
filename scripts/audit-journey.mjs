import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const origin = process.env.AUDIT_ORIGIN || "http://127.0.0.1:3000";
const pages = [
  ["catalog", "/tr/tours"],
  ["hotels", "/tr/hotels"],
  ["finder", "/tr/find-your-tour"],
  ["detail", "/tr/tours/cappadocia-tours-from-istanbul"],
  ["home", "/tr"],
];
for (const [name, path] of pages) {
  console.log(`Auditing ${path}: three mobile and three desktop runs`);
  const result = spawnSync(process.execPath, [fileURLToPath(new URL("audit-lighthouse.mjs", import.meta.url))], {
    stdio: "inherit",
    env: { ...process.env, AUDIT_URL: `${origin}${path}`, AUDIT_LABEL: `journey-final-${name}` },
  });
  if (result.status !== 0) process.exit(result.status || 1);
}

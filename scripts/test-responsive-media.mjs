import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import imageLoader from "../src/lib/responsive-image.ts";
import widths from "../src/data/image-widths.json" with { type: "json" };
import hero from "../src/data/hero-media.json" with { type: "json" };
import sharp from "sharp";

test("every responsive URL resolves to an existing WebP without a runtime optimizer", async () => {
  for (const src of Object.keys(widths)) {
    for (const width of [
      16, 32, 48, 64, 96, 128, 256, 320, 360, 384, 640, 768, 960, 1024, 1440,
      1920, 2560, 3840,
    ]) {
      const url = imageLoader({ src, width, quality: 80 });
      assert.ok(!url.includes("_next/image"));
      assert.ok(url.endsWith(".webp"));
      await fs.access(`public${url}`);
    }
  }
});
test("hero mobile and desktop assets decode, preserve aspect ratio, and never upscale", async () => {
  for (const place of hero.destinations) {
    for (const original of [place.image, place.mobileImage]) {
      for (const width of [360, 768, 1440, 2560]) {
        const url = imageLoader({ src: original.src, width });
        const metadata = await sharp(`public${url}`).metadata();
        assert.equal(metadata.format, "webp");
        assert.ok(metadata.width <= original.width);
        assert.ok(
          Math.abs(
            metadata.width / metadata.height - original.width / original.height,
          ) < 0.005,
        );
      }
    }
  }
});
test("SVG and unlisted sources keep their original URLs", () => {
  for (const src of ["/logo.svg", "/future-image.webp"])
    assert.equal(imageLoader({ src, width: 640 }), src);
});

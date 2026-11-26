import widths from "../data/image-widths.json" with { type: "json" };
import type { ImageLoaderProps } from "next/image";

// These WebP variants are generated with Sharp at quality 80 before publishing.
// Keep unknown sources usable; never send a request to a paid runtime optimizer.
export default function imageLoader({ src, width }: ImageLoaderProps): string {
  const originalWidth = (widths as Record<string, number>)[src];
  const size = [320, 640, 960, 1440, 1920, 2560].find(
    (value) => value >= width,
  );
  if (!originalWidth || !size || size >= originalWidth) return src;
  return `/images/responsive/${size}${src}`;
}

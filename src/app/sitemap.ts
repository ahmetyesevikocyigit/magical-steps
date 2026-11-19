import type { MetadataRoute } from "next";
import {
  catalog,
  locales,
  localizePath,
  itemHref,
  baseUrl,
  roots,
} from "@/lib/content";
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = Array.from(
    new Set([
      "/",
      "/tours",
      "/find-your-tour",
      "/hotels",
      "/sailing",
      "/transfers",
      "/contact",
      ...catalog.pages.map((p) => `/${p.slug}`),
      ...catalog.items.map(itemHref),
      ...catalog.categories.map((c) => `/${roots[c.kind]}?category=${c.id}`),
    ]),
  );
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: baseUrl + localizePath(path, locale),
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, baseUrl + localizePath(path, l)]),
        ),
      },
    })),
  );
}

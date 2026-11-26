import raw from "@/data/catalog.json";
import heroMedia from "@/data/hero-media.json";
import assets from "@/data/media.json";
import legacy from "@/data/legacy.json";
import overrides from "@/data/translation-overrides.json";
import thumbnails from "@/data/thumbnails.json";
import { getImageProps } from "next/image";
import imageLoader from "./responsive-image";
import { localizePath } from "../i18n/locale-config";
export { localizePath } from "../i18n/locale-config";
import {
  locales,
  type Locale,
  type CatalogItem,
  type ContentPage,
  type Category,
  type Translation,
  type Media,
  type CardItem,
  type Kind,
} from "./types";
export { locales };
export const catalog = raw as unknown as {
  items: CatalogItem[];
  pages: ContentPage[];
  categories: Category[];
  reviews: { name: string; country: string; text: string }[];
  sourcePages: unknown[];
};
const media = assets as unknown as {
  images: Record<string, Media>;
  featured: Record<string, string>;
  videos: { id: string; url: string; title: string; src: string }[];
};
export const featured = media.featured;
export const videos = media.videos || [];
export const roots: Record<Kind, string> = {
  tour: "tours",
  hotel: "hotels",
  sailing: "sailing",
  transfer: "transfers",
};
export const baseUrl = "https://www.magical-steps.com";
export function translation(
  entity: CatalogItem | ContentPage | Category,
  locale: Locale,
): Translation {
  const patches = overrides as unknown as Record<
    string,
    Partial<Record<Locale, Partial<Translation>>>
  >;
  const original =
    entity.translations?.[locale] ||
    entity.translations?.en ||
    Object.values(entity.translations || {})[0];
  const patch = patches[entity.id]?.[locale];
  const fallback = entity.translations?.en;
  return {
    title:
      patch?.title ??
      original?.title ??
      ("title" in entity ? entity.title : "Magical Steps"),
    description:
      patch?.description ??
      (original?.description || fallback?.description || ""),
    bodyHtml:
      patch?.bodyHtml ?? (original?.bodyHtml || fallback?.bodyHtml || ""),
    sourceUrl: original?.sourceUrl,
  };
}
export function imageFor(url?: string, fallback = "hero"): Media {
  if (url && media.images[url]) return media.images[url];
  if (url) {
    const absolute = new URL(url, baseUrl).href;
    if (media.images[absolute]) return media.images[absolute];
  }
  const src =
    media.featured[fallback] || media.featured.hero || "/images/hero.webp";
  return (
    Object.values(media.images).find((i) => i.src === src) || {
      src,
      width: 1920,
      height: 1280,
    }
  );
}
export function hasImage(url: string) {
  return Boolean(media.images[url] || media.images[new URL(url, baseUrl).href]);
}
export function bestImage(urls: string[], fallback = "hero") {
  const available = urls.find(hasImage);
  if (!available && fallback === "hotel")
    return { src: "/images/hotel-placeholder.svg", width: 1200, height: 900 };
  return imageFor(available, fallback);
}
const curatedCoverIds: Record<string, string> = {
  "aphrodisias-hierapolis-laodicea-tours-from-istanbul": "pamukkale",
  "aphrodisias-hierapolis-laodicea-tours-from-kusadasi": "pamukkale",
  "ephesus-house-of-the-virgin-mary-and-sirince-village": "ephesus",
  "cappadocia-tours-from-istanbul": "cappadocia",
  "pamukkale-tours-from-kusadasi": "pamukkale",
  "full-day-istanbul-tour-marvelous-istanbul-tour": "istanbul",
};
export function coverFor(item: CatalogItem): Media {
  const destination = heroMedia.destinations.find(
    (d) => d.id === curatedCoverIds[item.slug],
  );
  return destination?.image || bestImage(item.images, item.kind);
}
export function itemHref(item: CatalogItem) {
  return `/${roots[item.kind]}/${item.slug}`;
}
export function localizedDuration(value: string, locale: Locale) {
  return value.replace(
    /(\d+)\s*(hours?|час|Nights?|Days?)/gi,
    (_, number: string, unit: string) => {
      const n = Number(number);
      const index = /hour|час/i.test(unit) ? 0 : /night/i.test(unit) ? 1 : 2;
      const plural = new Intl.PluralRules(locale).select(n);
      const units = {
        en: n === 1 ? ["hour", "night", "day"] : ["hours", "nights", "days"],
        tr: ["saat", "gece", "gün"],
        fr: n === 1 ? ["h", "nuit", "jour"] : ["h", "nuits", "jours"],
        de: n === 1 ? ["Std.", "Nacht", "Tag"] : ["Std.", "Nächte", "Tage"],
        nl: n === 1 ? ["uur", "nacht", "dag"] : ["uur", "nachten", "dagen"],
        ru:
          plural === "one"
            ? ["ч", "ночь", "день"]
            : plural === "few"
              ? ["ч", "ночи", "дня"]
              : ["ч", "ночей", "дней"],
      }[locale];
      return `${number} ${units[index]}`;
    },
  );
}
export function localizedPrice(value: string, locale: Locale) {
  const unit = {
    en: "Per Person",
    tr: "Kişi başı",
    fr: "Par personne",
    de: "Pro Person",
    nl: "Per persoon",
    ru: "На человека",
  }[locale];
  return value.replace(/Per Person|на человека/gi, unit);
}
export function toCard(item: CatalogItem, locale: Locale): CardItem {
  const t = translation(item, locale);
  const fullImage = coverFor(item);
  return {
    id: item.id,
    title: t.title,
    description: t.description,
    href: itemHref(item),
    kind: item.kind,
    destination: item.destination || "",
    duration: localizedDuration(item.duration || "", locale),
    price: /\d/.test(item.price || "")
      ? localizedPrice(item.price, locale)
      : "",
    image: (thumbnails as Record<string, Media>)[fullImage.src] || fullImage,
    categories: item.categoryIds || [],
  };
}
export function getItem(root: string, slug: string) {
  return catalog.items.find((i) => roots[i.kind] === root && i.slug === slug);
}
export function pageBySlug(slug: string) {
  return catalog.pages.find((p) => p.slug === slug);
}
export function rewriteHtml(html: string, locale: Locale): string {
  const map = legacy as Record<string, string>;
  const levels = Array.from((html || "").matchAll(/<h([1-6])\b/gi), (match) =>
    Number(match[1]),
  );
  const lowest = levels.length ? Math.min(...levels) : 2;
  let previous = 1;
  const stack: number[] = [];
  return (html || "")
    .replace(/<li\b[^>]*>([\s\S]*?)<\/li>/gi, (tag, body: string) => {
      if (/<(?:ul|ol|p)\b/i.test(body)) return tag;
      const lines = body.trim().split(/\n+/).filter(line => line.trim());
      return lines.length > 1 ? lines.map(line => `<li>${line}</li>`).join("") : tag;
    })
    .replace(
      /<(\/?)h([1-6])([^>]*)>/gi,
      (_, closing: string, level: string, attrs: string) => {
        if (closing) return `</h${stack.pop() || 2}>`;
        const next = Math.max(
          2,
          Math.min(6, Number(level) - lowest + 2, previous + 1),
        );
        previous = next;
        stack.push(next);
        return `<h${next}${attrs}>`;
      },
    )
    .replace(/\s(?:style|class|id|onclick|target)=(?:"[^"]*"|'[^']*')/gi, "")
    .replace(/<img\b[^>]*>/gi, (tag: string) => {
      const url = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1];
      if (!url || !hasImage(url)) return "";
      const image = imageFor(url);
      const alt = tag.match(/\balt=["']([^"']*)["']/i)?.[1] || "";
      const { props } = getImageProps({
        loader: imageLoader,
        src: image.src,
        alt,
        width: image.width,
        height: image.height,
        quality: 80,
        sizes: "(max-width:760px) 90vw, 900px",
      });
      const escape = (value: string) =>
        value
          .replaceAll("&", "&amp;")
          .replaceAll('"', "&quot;")
          .replaceAll("<", "&lt;");
      return `<img src="${escape(props.src)}" srcset="${escape(props.srcSet || "")}" sizes="${escape(props.sizes || "")}" alt="${escape(alt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async"/>`;
    })
    .replace(
      /<a\b([^>]*?)href=["']([^"']*)["']([^>]*)>([\s\S]*?)<\/a>/gi,
      (_, before: string, href: string, after: string, label: string) => {
        if (
          !href ||
          href === "#" ||
          href.startsWith("#") ||
          href.includes("javascript:")
        )
          return label;
        if (href.startsWith("mailto:"))
          return `<a href="mailto:info@magical-steps.com">${label}</a>`;
        let url: URL;
        try {
          url = new URL(href, baseUrl);
        } catch {
          return label;
        }
        if (/(^|\.)magical-steps\.com$/.test(url.hostname)) {
          const modern =
            /^\/(?:tours|hotels|sailing|transfers)(?:\/|$)/.test(
              url.pathname,
            ) || catalog.pages.some((p) => "/" + p.slug === url.pathname);
          const target =
            map[decodeURIComponent(url.pathname)] ||
            map[url.pathname] ||
            (modern ? url.pathname + url.search : undefined);
          if (!target) return label;
          const unprefixed =
            target.replace(/^\/(en|tr|fr|de|nl|ru)(?=\/|$)/, "") || "/";
          return `<a href="${localizePath(unprefixed, locale)}">${label}</a>`;
        }
        if (!["http:", "https:"].includes(url.protocol)) return label;
        return `<a href="${url.href.replaceAll('"', "%22")}" rel="noopener noreferrer" target="_blank">${label}</a>`;
      },
    );
}
export function seoAlternates(path: string) {
  return {
    canonical: `${baseUrl}${path}`,
    languages: Object.fromEntries([
      ...locales.map((l) => [l, `${baseUrl}${localizePath(path, l)}`]),
      ["x-default", `${baseUrl}${path}`],
    ]),
  };
}

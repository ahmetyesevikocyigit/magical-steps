import type { Locale } from "../lib/types";

export const defaultLocale = "tr" as const;

export function localizePath(path: string, locale: Locale): string {
  const prefix = locale === defaultLocale ? "" : `/${locale}`;
  return `${prefix}${path === "/" ? (prefix ? "" : "/") : path}`;
}

// The source inventory used English without a prefix. Preserve its language
// when resolving old URLs under the new Turkish-default routing scheme.
export function legacyTarget(target: string): string {
  const url = new URL(target, "https://www.magical-steps.com");
  const match = url.pathname.match(/^\/(en|tr|fr|de|nl|ru)(?=\/|$)/);
  const locale = (match?.[1] || "en") as Locale;
  const path = match
    ? url.pathname.slice(match[0].length) || "/"
    : url.pathname;
  return localizePath(path, locale) + url.search + url.hash;
}

"use client";
import { useDeferredValue, useMemo, useState, useEffect } from "react";
import { preload } from "react-dom";
import { useTranslations, useLocale } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { destinationName } from "@/lib/format";
import { recommendationOrder } from "@/lib/catalog-order";
import type { CardItem, Locale } from "@/lib/types";
import Card from "./Card";
import { Search, Arrow } from "./Icon";
import s from "./Site.module.css";
export default function Catalog({
  items,
  categories,
  initialCategory = "",
  compact = false,
  serviceRoot,
  initialFilters = {},
}: {
  items: CardItem[];
  categories: { id: string; title: string }[];
  initialCategory?: string;
  compact?: boolean;
  serviceRoot?: string;
  initialFilters?: Record<string, string>;
}) {
  const t = useTranslations();
  const [query, setQuery] = useState(initialFilters.q || ""),
    [destination, setDestination] = useState(initialFilters.destination || ""),
    [category, setCategory] = useState(
      initialFilters.category || initialCategory,
    ),
    [sort, setSort] = useState(initialFilters.sort || ""),
    [limit, setLimit] = useState(
      compact
        ? 6
        : Math.max(
            18,
            Math.min(items.length, Number(initialFilters.limit) || 18),
          ),
    );
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const deferred = useDeferredValue(query);
  useEffect(() => {
    if (compact) return;
    function restore() {
      const params = new URLSearchParams(window.location.search);
      setQuery(params.get("q") || "");
      setDestination(params.get("destination") || "");
      setCategory(params.get("category") || "");
      setSort(params.get("sort") || "");
      setLimit(
        Math.max(18, Math.min(items.length, Number(params.get("limit")) || 18)),
      );
    }
    restore();
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [
    compact,
    initialFilters.q,
    initialFilters.destination,
    initialFilters.category,
    initialFilters.sort,
    initialCategory,
    items.length,
  ]);
  function syncUrl(changes: Record<string, string>, refresh = false) {
    if (compact) return;
    const p = new URLSearchParams(window.location.search);
    if (["q", "destination", "category"].some((key) => key in changes))
      p.delete("limit");
    for (const [key, value] of Object.entries(changes)) {
      if (value) p.set(key, value);
      else p.delete(key);
    }
    const target =
      window.location.pathname + (p.size ? "?" + p.toString() : "");
    if (refresh)
      router.replace(pathname + (p.size ? "?" + p.toString() : ""), {
        scroll: false,
      });
    else window.history.replaceState(window.history.state, "", target);
  }
  const destinations = useMemo(
    () =>
      Array.from(
        new Set(items.map((i) => i.destination).filter(Boolean)),
      ).sort(),
    [items],
  );
  const filtered = useMemo(
    () =>
      items
        .filter(
          (i) =>
            (!deferred ||
              `${i.title} ${i.destination} ${destinationName(i.destination, locale)} ${i.description}`
                .toLocaleLowerCase(locale)
                .includes(deferred.toLocaleLowerCase(locale))) &&
            (!destination || i.destination === destination) &&
            (!category || i.categories.includes(category)),
        )
        .sort((a, b) =>
          sort === "name"
            ? a.title.localeCompare(b.title, locale)
            : recommendationOrder(a.id) - recommendationOrder(b.id),
        ),
    [items, deferred, destination, category, sort, locale],
  );
  // Hint the visible photo early; fonts load through CSS without competing hints.
  if (!compact && filtered[0] && !filtered[0].image.src.startsWith("/images/hero-v2/")) {
    preload(filtered[0].image.src, { as: "image", fetchPriority: "high" });
  }
  const update = (fn: () => void) => {
    fn();
    setLimit(compact ? 6 : 18);
  };
  return (
    <>
      <div className={s.filters}>
        <label className={s.search}>
          <Search />
          <span className="sr-only">{t("searchLabel")}</span>
          <input
            value={query}
            onChange={(e) =>
              update(() => {
                setQuery(e.target.value);
                syncUrl({ q: e.target.value });
              })
            }
            placeholder={t("searchPlaceholder")}
            type="search"
          />
        </label>
        {serviceRoot && (
          <label>
            <span className="sr-only">{t("allServices")}</span>
            <select
              value={serviceRoot}
              onChange={(e) => router.push(`/${e.target.value}`)}
            >
              {[
                ["tours", "navTours"],
                ["hotels", "navHotels"],
                ["sailing", "navSailing"],
                ["transfers", "navTransfers"],
              ].map(([value, key]) => (
                <option key={value} value={value}>
                  {t(key)}
                </option>
              ))}
            </select>
          </label>
        )}
        <label>
          <span className="sr-only">{t("allDestinations")}</span>
          <select
            value={destination}
            onChange={(e) =>
              update(() => {
                setDestination(e.target.value);
                syncUrl({ destination: e.target.value });
              })
            }
          >
            <option value="">{t("allDestinations")}</option>
            {destinations.map((d) => (
              <option key={d} value={d}>
                {destinationName(d, locale)}
              </option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">{t("allCategories")}</span>
          <select
            value={category}
            onChange={(e) =>
              update(() => {
                setCategory(e.target.value);
                syncUrl({ category: e.target.value }, true);
              })
            }
          >
            <option value="">{t("allCategories")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
        </label>
        {!compact && (
          <label>
            <span className="sr-only">{t("sortLabel")}</span>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                syncUrl({ sort: e.target.value });
              }}
            >
              <option value="">{t("sortRecommended")}</option>
              <option value="name">{t("sortName")}</option>
            </select>
          </label>
        )}
      </div>
      {!compact && (
        <div className={s.resultLine}>
          <span role="status">
            {filtered.length} {t("results")}
          </span>
          {(query || destination || category) && (
            <button
              onClick={() => {
                setQuery("");
                setDestination("");
                setCategory("");
                syncUrl({ q: "", destination: "", category: "" }, true);
              }}
            >
              {t("clearFilters")}
            </button>
          )}
        </div>
      )}
      <div className={s.cardGrid}>
        {filtered.slice(0, limit).map((item, i) => (
          <Card key={item.id} item={item} index={i} compact={compact} />
        ))}
      </div>
      {filtered.length === 0 && <p className={s.empty}>{t("noResults")}</p>}
      {filtered.length > limit && !compact && (
        <div className={s.center}>
          <button
            className={s.buttonOutline}
            onClick={() => {
              setLimit((v) => v + 18);
              syncUrl({ limit: String(limit + 18) });
            }}
          >
            {t("showMore")}
            <Arrow />
          </button>
        </div>
      )}
    </>
  );
}

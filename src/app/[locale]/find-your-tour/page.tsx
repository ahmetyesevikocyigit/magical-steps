import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";
import {
  catalog,
  toCard,
  baseUrl,
  localizePath,
  seoAlternates,
  featured,
} from "@/lib/content";
import type { Locale } from "@/lib/types";
import { readChoices, readStep, type TourFacts } from "@/lib/tour-matching";
import rawFacts from "@/data/tour-facts.json";
import TourFinder from "@/components/TourFinder";
import s from "@/components/Site.module.css";
type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale });
  return {
    title: t("finderTitle"),
    description: t("finderDescription"),
    openGraph: {
      title: t("finderTitle"),
      description: t("finderDescription"),
      url: baseUrl + localizePath("/find-your-tour", locale),
      locale,
      images: [featured.hero],
    },
    alternates: {
      ...seoAlternates("/find-your-tour"),
      canonical: baseUrl + localizePath("/find-your-tour", locale),
    },
  };
}
export default async function FindYourTour({ params, searchParams }: Props) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const facts = rawFacts as Record<string, TourFacts>;
  const tours = catalog.items
    .filter((i) => i.kind === "tour")
    .map((item) => ({ card: toCard(item, locale), facts: facts[item.id] }));
  const query = await searchParams;
  const p = new URLSearchParams(
    Object.entries(query).filter(
      (e): e is [string, string] => typeof e[1] === "string",
    ),
  );
  const choices = readChoices(p, [
    ...new Set(tours.flatMap((t) => t.facts.departures)),
  ]);
  return (
    <div className={s.pageMain}>
      <div className={s.pageHeader}>
        <nav className={s.breadcrumb} aria-label={t("breadcrumbLabel")}>
          <Link href="/">{t("breadcrumbHome")}</Link>
          <span aria-hidden="true">/</span>
          <Link href="/tours">{t("navTours")}</Link>
        </nav>
        <h1>{t("finderTitle")}</h1>
        <p>{t("finderDescription")}</p>
      </div>
      <TourFinder tours={tours} initial={{ choices, step: readStep(p) }} />
    </div>
  );
}

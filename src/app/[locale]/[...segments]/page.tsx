import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import {
  catalog,
  roots,
  getItem,
  itemHref,
  pageBySlug,
  translation,
  toCard,
  baseUrl,
  seoAlternates,
  localizePath,
  imageFor,
  featured,
  rewriteHtml,
  bestImage,
  coverFor,
  hasImage,
  videos,
} from "@/lib/content";
import type { Locale, Kind } from "@/lib/types";
import Catalog from "@/components/Catalog";
import DetailContent from "@/components/DetailContent";
import RequestForm from "@/components/RequestForm";
import Gallery from "@/components/Gallery";
import VideoGallery from "@/components/VideoGallery";
import { Arrow } from "@/components/Icon";
import s from "@/components/Site.module.css";
import d from "@/components/Detail.module.css";
type Props = {
  params: Promise<{ locale: Locale; segments: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};
const listKeys: Record<string, string> = {
  tours: "navTours",
  hotels: "navHotels",
  sailing: "navSailing",
  transfers: "navTransfers",
};
const staticKeys: Record<string, string> = {
  about: "navAbout",
  contact: "navContact",
  gallery: "gallery",
  blog: "blog",
  reviews: "reviews",
  "why-choose-us": "whyUs",
  "ephesus-map": "ephesusMap",
  terms: "terms",
  privacy: "privacy",
  "distance-sales-agreement": "distanceSales",
  "satisfaction-guarantee": "satisfaction",
  "pay-cash-on-arrival": "payOnArrival",
};
export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { locale, segments } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale });
  const query = await searchParams;
  const category =
    segments.length === 1 && listKeys[segments[0]]
      ? catalog.categories.find(
          (c) => c.id === query.category && roots[c.kind] === segments[0],
        )
      : undefined;
  const path =
    "/" + segments.join("/") + (category ? `?category=${category.id}` : "");
  const item =
    segments.length === 2 ? getItem(segments[0], segments[1]) : undefined;
  const page = segments.length === 1 ? pageBySlug(segments[0]) : undefined;
  const data = item
    ? translation(item, locale)
    : page
      ? translation(page, locale)
      : category
        ? translation(category, locale)
        : null;
  const title =
    data?.title ||
    t(listKeys[segments[0]] || staticKeys[segments[0]] || "notFoundTitle");
  const description = data?.description?.slice(0, 165) || t("heroDescription");
  return {
    title,
    description,
    alternates: {
      ...seoAlternates(path),
      canonical: baseUrl + localizePath(path, locale),
    },
    openGraph: {
      title,
      description,
      locale,
      url: baseUrl + localizePath(path, locale),
      images: [item ? coverFor(item).src : featured.hero],
    },
  };
}
export default async function ContentRoute({ params, searchParams }: Props) {
  const { locale, segments } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const t = await getTranslations({ locale });
  const query = await searchParams;
  if (segments.length === 2) {
    const item = getItem(segments[0], segments[1]);
    if (!item) notFound();
    return (
      <div className={s.pageMain}>
        <div className={d.page}>
          <nav
            className={`${s.breadcrumb} ${d.breadcrumb}`}
            aria-label={t("breadcrumbLabel")}
          >
            <Link href="/">{t("breadcrumbHome")}</Link>
            <span aria-hidden="true">/</span>
            <Link href={`/${segments[0]}`}>{t(listKeys[segments[0]])}</Link>
          </nav>
          <DetailContent item={item} locale={locale} />
        </div>
      </div>
    );
  }
  if (segments.length !== 1) notFound();
  const slug = segments[0];
  if (listKeys[slug]) {
    const kind = (Object.keys(roots) as Kind[]).find((k) => roots[k] === slug)!;
    const items = catalog.items.filter((i) => i.kind === kind);
    const categoryId = typeof query.category === "string" ? query.category : "";
    const category = catalog.categories.find(
      (c) => c.id === categoryId && c.kind === kind,
    );
    const title = category
      ? translation(category, locale).title
      : t(listKeys[slug]);
    return (
      <div className={s.pageMain}>
        <div className={s.pageHeader}>
          <nav className={s.breadcrumb} aria-label={t("breadcrumbLabel")}>
            <Link href="/">{t("breadcrumbHome")}</Link>
            <span aria-hidden="true">/</span>
            <span>{t(listKeys[slug])}</span>
          </nav>
          <h1>{title}</h1>
          <p>
            {t(kind === "tour" ? "toursDescription" : `${kind}Description`)}
          </p>
          {kind === "tour" && (
            <Link href="/find-your-tour" className={s.catalogFinderLink}>
              {t("finderStart")} <Arrow />
            </Link>
          )}
        </div>
        <section className={`${s.section} ${s.catalogPage}`}>
          <Catalog
            items={items.map((i) => toCard(i, locale))}
            categories={catalog.categories
              .filter((c) => c.kind === kind && c.itemIds.length)
              .map((c) => ({
                id: c.id,
                title: translation(c, locale).title,
              }))}
            initialCategory={categoryId}
            serviceRoot={slug}
            initialFilters={Object.fromEntries(
              Object.entries(query).filter(
                (entry): entry is [string, string] =>
                  typeof entry[1] === "string",
              ),
            )}
          />
          {category && translation(category, locale).bodyHtml && (
            <div
              className={`${s.infoPage} ${s.richText}`}
              dangerouslySetInnerHTML={{
                __html: rewriteHtml(
                  translation(category, locale).bodyHtml,
                  locale,
                ),
              }}
            />
          )}
        </section>
      </div>
    );
  }
  const page = pageBySlug(slug);
  if (!page && !staticKeys[slug]) notFound();
  const data = page ? translation(page, locale) : null;
  const title = staticKeys[slug] ? t(staticKeys[slug]) : data?.title || "";
  return (
    <div className={s.pageMain}>
      <div className={s.pageHeader}>
        <nav className={s.breadcrumb} aria-label={t("breadcrumbLabel")}>
          <Link href="/">{t("breadcrumbHome")}</Link>
          <span aria-hidden="true">/</span>
          <span>{title}</span>
        </nav>
        <h1>{title}</h1>
        {slug === "contact" && <p>{t("ctaDescription")}</p>}
      </div>
      {slug === "contact" ? (
        <section className={s.contactGrid}>
          <div className={s.contactDetails}>
            <h2>Magical Steps Travel</h2>
            <address>
              Cumhuriyet Mah. Muammer Sk.
              <br />
              Samsara Plaza No:304
              <br />
              Kuşadası / Aydın / Türkiye
            </address>
            <a href="mailto:info@magical-steps.com">
              info@magical-steps.com <Arrow diagonal />
            </a>
            <a href="tel:+902566133233">+90 (256) 613 32 33</a>
            <a
              href="https://wa.me/905324914452"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp · +90 (532) 491 44 52 <Arrow diagonal />
            </a>
            <p>
              Magical Steps Travel Turz. Eğit. İnş. Taah. Yat. ve Tic. Ltd. Şti.
            </p>
            <div className={s.contactSocial}>
              <a
                href="https://www.instagram.com/magicalstepstravel"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
              <a
                href="https://www.facebook.com/magicalstepstravel"
                target="_blank"
                rel="noopener noreferrer"
              >
                Facebook
              </a>
              <a
                href="https://www.linkedin.com/company/magical-steps-travel"
                target="_blank"
                rel="noopener noreferrer"
              >
                LinkedIn
              </a>
              <a
                href="https://twitter.com/magicalsteps"
                target="_blank"
                rel="noopener noreferrer"
              >
                Twitter
              </a>
              <a
                href="https://www.pinterest.com/ephesustourstr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pinterest
              </a>
            </div>
          </div>
          <RequestForm />
        </section>
      ) : slug === "blog" ? (
        <section className={s.section}>
          <div className={s.cardGrid}>
            {catalog.pages
              .filter(
                (p) =>
                  !staticKeys[p.slug] && translation(p, locale).bodyHtml.trim(),
              )
              .map((article) => {
                const text = translation(article, locale);
                const image = bestImage(article.images || [], "ephesus");
                return (
                  <article className={s.card} key={article.id}>
                    <Link href={`/${article.slug}`} className={s.cardLink}>
                      <div className={s.cardImage}>
                        <Image
                          src={image.src}
                          alt=""
                          fill
                          sizes="(max-width:600px) 90vw, (max-width:1000px) 46vw, 31vw"
                        />
                      </div>
                      <div className={s.cardInfo}>
                        <h2>{text.title}</h2>
                        <p>{text.description.slice(0, 180)}</p>
                        <span className={s.cardBottom}>
                          {t("discover")}
                          <Arrow />
                        </span>
                      </div>
                    </Link>
                  </article>
                );
              })}
          </div>
        </section>
      ) : (
        <article className={s.infoPage}>
          {page?.images?.length ? (
            <Gallery
              title={title}
              images={page.images.filter(hasImage).map((u) => imageFor(u))}
            />
          ) : null}
          {data?.bodyHtml ? (
            <div
              className={s.richText}
              dangerouslySetInnerHTML={{
                __html: rewriteHtml(data.bodyHtml, locale),
              }}
            />
          ) : slug === "reviews" ? (
            <div className={s.reviewsGrid}>
              {catalog.reviews.map((r, i) => (
                <figure key={i}>
                  <blockquote>
                    {i === 0
                      ? t("reviewWilma")
                      : i === 1
                        ? t("reviewDebbie")
                        : r.text}
                  </blockquote>
                  <figcaption>
                    {r.name} · {r.country}
                  </figcaption>
                </figure>
              ))}
            </div>
          ) : slug === "gallery" ? (
            <Gallery
              title={title}
              images={catalog.items
                .flatMap((i) => i.images.slice(0, 1))
                .slice(0, 40)
                .map((u) => imageFor(u))}
            />
          ) : null}
          {slug === "gallery" && <VideoGallery videos={videos} />}
          {slug === "entrance-scholastica-baths" && (
            <Link href="/scholastica-baths" className={s.buttonOutline}>
              {translation(pageBySlug("scholastica-baths")!, locale).title}
              <Arrow />
            </Link>
          )}
          {slug === "ephesus-map" && (
            <a
              className={s.buttonOutline}
              href="https://www.google.com/maps/search/?api=1&query=Ephesus+Selcuk+Turkey"
              target="_blank"
              rel="noopener noreferrer"
            >
              {t("ephesusMap")}
              <Arrow diagonal />
            </a>
          )}
        </article>
      )}
    </div>
  );
}

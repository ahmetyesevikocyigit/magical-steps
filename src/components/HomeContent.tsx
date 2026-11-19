import Image from "next/image";
import { preload } from "react-dom";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { catalog, featured, toCard } from "@/lib/content";
import type { Locale } from "@/lib/types";
import heroMedia from "@/data/hero-media.json";
import Hero from "./Hero";
import Card from "./Card";
import FinderInvite from "./FinderInvite";
import Reveal from "./Reveal";
import { Arrow } from "./Icon";
import s from "./Site.module.css";
export default async function HomeContent({ locale }: { locale: Locale }) {
  preload(
    `/fonts/cormorant-garamond-${locale === "ru" ? "cyrillic" : "latin"}-italic.woff2`,
    {
      as: "font",
      type: "font/woff2",
      crossOrigin: "anonymous",
    },
  );
  const t = await getTranslations({ locale });
  const tours = catalog.items.filter((i) => i.kind === "tour");
  const preferred = [
    "ephesus-house-of-the-virgin-mary-and-sirince-village",
    "cappadocia-tours-from-istanbul",
    "pamukkale-tours-from-kusadasi",
    "full-day-istanbul-tour-marvelous-istanbul-tour",
    "seven-churches-tour",
    "priene-miletos-didyma-tour",
  ];
  const ordered = [
    ...preferred
      .map((slug) => tours.find((i) => i.slug === slug))
      .filter(Boolean),
    ...tours.filter((i) => !preferred.includes(i.slug)),
  ] as typeof tours;
  return (
    <>
      <Hero destinations={heroMedia.destinations} />
      <section id="explore" className={`${s.section} ${s.toursSection}`}>
        <FinderInvite />
        <Reveal>
          <div className={s.sectionHeading}>
            <h2>{t("toursTitle")}</h2>
            <p>{t("toursDescription")}</p>
          </div>
        </Reveal>
        <div className={s.cardGrid}>
          {ordered.slice(0, 6).map((item, i) => (
            <Reveal key={item.id} delay={(i % 3) * 0.06}>
              <Card item={toCard(item, locale)} index={i} />
            </Reveal>
          ))}
        </div>
        <div className={s.center}>
          <Link href="/tours" className={s.sectionLink}>
            {t("allToursLink")}
          </Link>
        </div>
      </section>
      <section className={s.section}>
        <div className={s.sectionHeading}>
          <h2>{t("servicesTitle")}</h2>
          <p>{t("servicesDescription")}</p>
        </div>
        <div className={s.serviceGrid}>
          {[
            ["hotels", "hotel", "hotelTitle", "hotelDescription"],
            ["sailing", "sailing", "sailingTitle", "sailingDescription"],
            ["transfers", "transfer", "transferTitle", "transferDescription"],
          ].map(([href, image, title, desc]) => (
            <Reveal key={href}>
              <Link href={`/${href}`} className={s.serviceCard}>
                <div className={s.serviceImage}>
                  <Image
                    src={featured[image] || featured.hero}
                    alt=""
                    fill
                    sizes="(max-width:760px) 90vw, 32vw"
                    quality={80}
                  />
                </div>
                <div className={s.serviceText}>
                  <h3>{t(title)}</h3>
                  <p>{t(desc)}</p>
                  <span>
                    {t("discover")}
                    <Arrow />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
      <section className={s.aboutSection}>
        <div className={s.aboutImage}>
          <Image
            src={heroMedia.destinations[0].image.src}
            alt={t("aboutImageAlt")}
            fill
            sizes="(max-width:760px) 100vw, 50vw"
            quality={80}
          />
        </div>
        <Reveal className={s.aboutText}>
          <h2>{t("aboutTitle")}</h2>
          <p>{t("aboutDescription")}</p>
          <Link href="/about" className={s.textLink}>
            {t("aboutLink")}
            <Arrow />
          </Link>
        </Reveal>
      </section>
      <section className={`${s.section} ${s.reviewsSection}`}>
        <div className={s.sectionHeading}>
          <h2>{t("reviewsTitle")}</h2>
        </div>
        <div className={s.reviewsGrid}>
          {catalog.reviews.slice(0, 2).map((r, i) => (
            <figure key={i}>
              <blockquote>
                {i === 0
                  ? t("reviewWilmaExcerpt")
                  : i === 1
                    ? t("reviewDebbieExcerpt")
                    : r.text}
              </blockquote>
              <figcaption>
                <strong>{r.name}</strong>
                <span>{r.country}</span>
              </figcaption>
            </figure>
          ))}
        </div>
        <Link href="/reviews" className={s.sectionLink}>
          {t("allReviewsLink")}
        </Link>
      </section>
      <section className={s.ctaSection}>
        <div>
          <h2>{t("ctaTitle")}</h2>
          <p>{t("ctaDescription")}</p>
        </div>
        <Link href="/contact" className={s.button}>
          {t("planTrip")}
          <Arrow />
        </Link>
      </section>
    </>
  );
}

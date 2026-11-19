import Image from "next/image";
import {
  translation,
  rewriteHtml,
  imageFor,
  hasImage,
  coverFor,
  localizedDuration,
  localizedPrice,
  catalog,
  itemHref,
} from "@/lib/content";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import rawFacts from "@/data/tour-facts.json";
import inclusionConflicts from "@/data/inclusion-conflicts.json";
import type { TourFacts } from "@/lib/tour-matching";
import {
  splitDays,
  splitPublishedSections,
  splitInclusions,
  withoutConflictingAdmission,
  type PublishedSection,
} from "@/lib/detail-sections";
import { destinationName } from "@/lib/format";
import type { CatalogItem, Locale } from "@/lib/types";
import RequestForm from "./RequestForm";
import Gallery from "./Gallery";
import EnquiryLink from "./EnquiryLink";
import RouteOverview from "./RouteOverview";
import MobileEnquiry from "./MobileEnquiry";
import { Arrow } from "./Icon";
import s from "./Site.module.css";
import j from "./Journey.module.css";
import d from "./Detail.module.css";

export default async function DetailContent({
  item,
  locale,
}: {
  item: CatalogItem;
  locale: Locale;
}) {
  const text = translation(item, locale);
  const t = await getTranslations({ locale });
  const facts = (rawFacts as Record<string, TourFacts>)[item.id];
  const admissionConflict = item.id in inclusionConflicts;
  const images = [
    coverFor(item),
    ...item.images.filter(hasImage).map((url) => imageFor(url)),
  ].filter(
    (image, index, all) =>
      all.findIndex((other) => other.src === image.src) === index,
  );
  const sections = splitPublishedSections(
    text.bodyHtml,
    translation(item, "en").bodyHtml || text.bodyHtml,
  ).map((section) => ({
    ...section,
    html:
      admissionConflict && section.kind === "details"
        ? withoutConflictingAdmission(section.html)
        : section.html,
  }));
  // Short hotel and transfer descriptions belong with the photos, without empty sections below.
  const compact =
    (item.kind === "hotel" || item.kind === "transfer") &&
    text.bodyHtml.replace(/<[^>]*>/g, "").length < 1600 &&
    !/<table\b/i.test(text.bodyHtml);
  const descriptionInBody =
    compact &&
    text.bodyHtml
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .startsWith(text.description);
  const sectionLinks = [
    {
      target: "itinerary",
      label: "itinerary",
      available: sections.some((section) => section.kind === "itinerary"),
    },
    {
      target: "route",
      label: "tripRoute",
      available: Boolean(facts?.stops?.length),
    },
    {
      target: "details",
      label: "details",
      available: sections.some((section) => section.kind === "details"),
    },
    {
      target: "pricing",
      label: "pricing",
      available: sections.some((section) => section.kind === "pricing"),
    },
  ].filter((link) => link.available);
  const related =
    item.kind === "tour"
      ? catalog.items
          .filter(
            (i) =>
              i.kind === "tour" &&
              i.id !== item.id &&
              i.destination === item.destination,
          )
          .slice(0, 3)
      : [];
  const html = (body: string) => (
    <div
      className={s.richText}
      dangerouslySetInnerHTML={{ __html: rewriteHtml(body, locale) }}
    />
  );
  function renderSection(section: PublishedSection, index: number) {
    const days = section.kind === "itinerary" ? splitDays(section.html) : [];
    const inclusions =
      section.kind === "details" ? splitInclusions(section.html) : null;
    return (
      <section
        className={d.section}
        id={section.kind === "other" ? `detail-section-${index}` : section.kind}
        key={index}
      >
        {section.kind !== "other" ? (
          <h2 tabIndex={-1}>{t(section.kind)}</h2>
        ) : section.title ? (
          <h2
            tabIndex={-1}
            dangerouslySetInnerHTML={{ __html: section.title }}
          />
        ) : null}
        {days.length > 1 ? (
          <ol className={`${j.program} ${d.program}`}>
            {days.map((day, dayIndex) => (
              <li key={dayIndex}>{html(day)}</li>
            ))}
          </ol>
        ) : inclusions ? (
          <>
            <div className={`${j.inclusions} ${d.inclusions}`}>
              <div>
                <h3>{t("included")}</h3>
                {html(inclusions.yes)}
              </div>
              <div>
                <h3>{t("excluded")}</h3>
                {html(inclusions.no)}
              </div>
            </div>
            {html(inclusions.note)}
          </>
        ) : (
          html(section.html)
        )}
        {section.kind === "pricing" && (
          <p className={d.note}>{t("tripPriceNote")}</p>
        )}
        {section.kind === "details" && admissionConflict && (
          <p className={d.note}>{t("tripAdmissionNote")}</p>
        )}
      </section>
    );
  }
  const hasAside =
    !compact &&
    (sections.some((section) => section.kind === "pricing") || Boolean(facts));
  return (
    <div className={d.content} data-detail-content>
      <header className={d.heading}>
        <h1>{text.title}</h1>
      </header>
      <div className={d.overview} data-detail-intro>
        <Gallery images={images} title={text.title} featured />
        <div className={d.summary}>
          {text.description && !descriptionInBody && (
            <p className={d.description}>{text.description}</p>
          )}
          {!compact && (
            <dl className={d.facts}>
              {item.duration && (
                <div>
                  <dt>{t("tripDuration")}</dt>
                  <dd>{localizedDuration(item.duration, locale)}</dd>
                </div>
              )}
              {!!facts?.departures.length && (
                <div>
                  <dt>{t("tripDeparture")}</dt>
                  <dd>
                    {facts.departures
                      .map((place) => destinationName(place, locale))
                      .join(" / ")}
                  </dd>
                </div>
              )}
              {item.destination && (
                <div>
                  <dt>{t("tripDestination")}</dt>
                  <dd>{destinationName(item.destination, locale)}</dd>
                </div>
              )}
            </dl>
          )}
          {compact && (
            <div className={d.quickDetails}>{sections.map(renderSection)}</div>
          )}
          <div className={d.enquiry}>
            {/\d/.test(item.price || "") && (
              <p className={d.price}>{localizedPrice(item.price, locale)}</p>
            )}
            <EnquiryLink />
          </div>
        </div>
      </div>
      {!compact && sectionLinks.length > 0 && (
        <nav className={d.nav} aria-label={t("details")}>
          {sectionLinks.map(({ target, label }) => (
            <EnquiryLink key={target} target={target} className="">
              {t(label)}
            </EnquiryLink>
          ))}
        </nav>
      )}
      {!compact && (
        <div className={hasAside ? d.layout : d.singleColumn}>
          <div className={d.mainColumn}>
            {sections.map((section, index) =>
              section.kind !== "pricing" ? renderSection(section, index) : null,
            )}
          </div>
          {hasAside && (
            <aside className={d.aside} aria-label={t("details")}>
              {sections.map((section, index) =>
                section.kind === "pricing"
                  ? renderSection(section, index)
                  : null,
              )}
              {!!facts?.stops?.length && (
                <section className={d.section} id="route">
                  <h2 tabIndex={-1}>{t("tripRoute")}</h2>
                  <RouteOverview stops={facts.stops} />
                </section>
              )}
              {facts && (
                <section className={d.section}>
                  <h2>{t("tripMeeting")}</h2>
                  <p>{t("tripMeetingNote")}</p>
                </section>
              )}
            </aside>
          )}
        </div>
      )}
      <RequestForm service={text.title} layout="detail" />
      {!!related.length && (
        <section className={d.related}>
          <h2>{t("relatedTours")}</h2>
          <ul>
            {related.map((tour) => (
              <li key={tour.id}>
                <Link href={itemHref(tour)} prefetch={false}>
                  <span className={d.relatedImage}>
                    <Image
                      src={coverFor(tour).src}
                      alt=""
                      fill
                      sizes="80px"
                      quality={80}
                    />
                  </span>
                  <span>{translation(tour, locale).title}</span>
                  <Arrow />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
      <MobileEnquiry />
    </div>
  );
}

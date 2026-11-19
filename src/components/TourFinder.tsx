"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { CardItem, Locale } from "@/lib/types";
import { destinationName } from "@/lib/format";
import {
  matchesTrip,
  chooseTripOption,
  getTripOptionCounts,
  getTripAlternatives,
  readChoices,
  readStep,
  tripInterests,
  tripLengths,
  type TourFacts,
  type TripChoices,
} from "@/lib/tour-matching";
import Card from "./Card";
import { recommendationOrder } from "@/lib/catalog-order";
import { Arrow } from "./Icon";
import s from "./Journey.module.css";
import shared from "./Site.module.css";

export default function TourFinder({
  tours,
  initial,
}: {
  tours: { card: CardItem; facts: TourFacts }[];
  initial: { choices: TripChoices; step: number };
}) {
  const t = useTranslations(),
    locale = useLocale() as Locale;
  const [choices, setChoices] = useState(initial.choices);
  const [step, setStep] = useState(initial.step);
  const heading = useRef<HTMLHeadingElement>(null);
  const departures = useMemo(
    () => [...new Set(tours.flatMap((t) => t.facts.departures))].sort(),
    [tours],
  );
  const facts = useMemo(() => tours.map((tour) => tour.facts), [tours]);
  const alternatives = useMemo(
    () => getTripAlternatives(facts, choices),
    [facts, choices],
  );
  const results = useMemo(
    () =>
      tours
        .filter((t) => matchesTrip(t.facts, choices))
        .sort(
          (a, b) =>
            recommendationOrder(a.card.id) - recommendationOrder(b.card.id),
        ),
    [tours, choices],
  );
  useEffect(() => {
    function restore() {
      const params = new URLSearchParams(window.location.search);
      setChoices(readChoices(params, departures));
      setStep(readStep(params));
    }
    window.addEventListener("popstate", restore);
    return () => window.removeEventListener("popstate", restore);
  }, [departures]);
  function writeUrl(next: number, value: TripChoices, replace = false) {
    const params = new URLSearchParams();
    Object.entries(value).forEach(([key, val]) => {
      if (val !== "any") params.set(key, val);
    });
    if (next === 3) params.set("results", "1");
    else if (next) params.set("step", String(next));
    const url = `${window.location.pathname}${params.size ? `?${params}` : ""}`;
    if (replace) window.history.replaceState(null, "", url);
    else window.history.pushState(null, "", url);
  }
  function move(next: number, value = choices) {
    setChoices(value);
    setStep(next);
    writeUrl(next, value);
    requestAnimationFrame(() => {
      const node = heading.current;
      node?.focus({ preventScroll: true });
      if (
        node &&
        (node.getBoundingClientRect().top < 100 ||
          node.getBoundingClientRect().bottom > window.innerHeight)
      ) {
        node.scrollIntoView({
          block: "center",
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "instant"
            : "smooth",
        });
      }
    });
  }
  const key = (["length", "departure", "interest"] as const)[Math.min(step, 2)];
  const options =
    step === 0
      ? tripLengths
      : step === 1
        ? ["any", ...departures]
        : tripInterests;
  const counts = getTripOptionCounts(facts, choices, key, options);
  const optionLabel = (key: string, value: string) =>
    key === "departure" && value !== "any"
      ? destinationName(value, locale)
      : t(`finder_${key}_${value}`);
  return (
    <section className={s.finder} aria-label={t("finderTitle")}>
      <ol className={s.steps} aria-label={t("finderSteps")}>
        {["length", "departure", "interest"].map((key, index) => (
          <li key={key} aria-current={step === index ? "step" : undefined}>
            <button disabled={index > step} onClick={() => move(index)}>
              <span aria-hidden="true">{index + 1}</span>
              {t(`finderStep_${key}`)}
            </button>
          </li>
        ))}
      </ol>
      <h2 ref={heading} tabIndex={-1} className={s.finderHeading}>
        {t(step === 3 ? "finderResultsTitle" : `finderQuestion_${key}`)}
      </h2>
      {step < 3 ? (
        <>
          <p id="finder-option-help" className={s.optionHelp}>
            {t("finderOptionHelp")}
          </p>
          <fieldset className={s.options} aria-describedby="finder-option-help">
            <legend className="sr-only">{t(`finderQuestion_${key}`)}</legend>
            {options.map((value) => (
              <label
                key={value}
                className={`${s.option} ${counts[value] === 0 ? s.unavailable : ""}`}
              >
                <input
                  type="radio"
                  name={key}
                  value={value}
                  checked={choices[key] === value}
                  disabled={counts[value] === 0}
                  onChange={() => {
                    const next = chooseTripOption(choices, key, value);
                    setChoices(next);
                    writeUrl(step, next, true);
                  }}
                />
                <span>
                  <strong>{optionLabel(key, value)}</strong>
                  <small>
                    {counts[value]
                      ? t("finderOptionCount", { count: counts[value] })
                      : t("finderUnavailable")}
                  </small>
                </span>
              </label>
            ))}
          </fieldset>
          <div className={s.finderActions}>
            {step > 0 && (
              <button
                className={shared.buttonOutline}
                onClick={() => move(step - 1)}
              >
                {t("previous")}
              </button>
            )}
            <button
              className={shared.button}
              disabled={!counts[choices[key]]}
              onClick={() => move(step + 1)}
            >
              {t(step === 2 ? "finderShowResults" : "next")}
              <Arrow />
            </button>
          </div>
        </>
      ) : (
        <>
          <p className={s.summary}>
            {(["length", "departure", "interest"] as const)
              .map((key) => optionLabel(key, choices[key]))
              .join(" · ")}
          </p>
          <div className={s.finderActions}>
            <p role="status">
              {t("finderResultCount", { count: results.length })}
            </p>
            <button className={s.changeChoice} onClick={() => move(0)}>
              {t("finderChange")}
            </button>
          </div>
          {results.length ? (
            <div className={shared.cardGrid}>
              {results.map(({ card }, index) => (
                <Card key={card.id} item={card} index={index} compact={false} />
              ))}
            </div>
          ) : (
            <div className={s.noMatch}>
              <p>{t("finderNoMatch")}</p>
              {alternatives.length > 0 && (
                <div className={s.alternatives}>
                  {alternatives.map((option) => (
                    <button
                      key={option.key}
                      className={s.alternative}
                      onClick={() => move(3, option.choices)}
                    >
                      <span>
                        {option.mode === "relax"
                          ? t(`finderRelax_${option.key}`)
                          : t("finderKeep", {
                              choice: optionLabel(
                                option.key,
                                choices[option.key],
                              ),
                            })}
                      </span>
                      <small>
                        {t("finderOptionCount", { count: option.count })}
                      </small>
                      <Arrow />
                    </button>
                  ))}
                </div>
              )}
              <Link href="/contact" className={shared.button}>
                {t("planTrip")}
                <Arrow />
              </Link>
              <button
                className={shared.buttonOutline}
                onClick={() =>
                  move(0, { length: "any", departure: "any", interest: "any" })
                }
              >
                {t("clearFilters")}
              </button>
            </div>
          )}
        </>
      )}
      <Link href="/tours" className={s.catalogLink}>
        {t("allToursLink")} <Arrow />
      </Link>
    </section>
  );
}

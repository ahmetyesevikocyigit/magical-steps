import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { createHash } from "node:crypto";
import {
  matchesTrip,
  readChoices,
  readStep,
  chooseTripOption,
  getTripOptionCounts,
  getTripAlternatives,
  tripLengths,
  tripInterests,
} from "../src/lib/tour-matching.ts";
import {
  splitPublishedSections,
  splitDays,
  splitInclusions,
  withoutConflictingAdmission,
} from "../src/lib/detail-sections.ts";
const read = (name) =>
  JSON.parse(
    fs.readFileSync(new URL(`../src/data/${name}.json`, import.meta.url)),
  );
const catalog = read("catalog"),
  facts = read("tour-facts"),
  translations = read("translation-overrides");
test("every tour has evidence-linked matching data; unconfirmed durations do not match a duration choice", () => {
  for (const tour of catalog.items.filter((i) => i.kind === "tour")) {
    const fact = facts[tour.id];
    assert.ok(fact);
    assert.equal(fact.sourceUrl, tour.sourceUrl);
    assert.ok(
      matchesTrip(fact, { length: "any", departure: "any", interest: "any" }),
    );
    if (fact.days === null)
      assert.equal(
        matchesTrip(fact, { length: "day", departure: "any", interest: "any" }),
        false,
      );
  }
});
test("Istanbul, 2–3 days, landscape matches the documented Cappadocia trip, never a departure inferred from a misleading slug", () => {
  const selected = {
    length: "short",
    departure: "Istanbul",
    interest: "landscape",
  };
  assert.ok(matchesTrip(facts["cappadocia-tours-from-istanbul"], selected));
  assert.equal(
    matchesTrip(facts["pamukkale-tours-from-izmir"], {
      length: "day",
      departure: "Izmir",
      interest: "any",
    }),
    false,
  );
  assert.deepEqual(facts["ephesus-tours-from-izmir-c"].departures, ["Bodrum"]);
});
test("invalid URL choices become safe neutral choices", () => {
  assert.deepEqual(
    readChoices(
      new URLSearchParams("length=bogus&departure=unknown&interest=bad"),
      ["Istanbul"],
    ),
    { length: "any", departure: "any", interest: "any" },
  );
  for (const step of ["1.5", "NaN", "Infinity", "-1", "8"])
    assert.equal(readStep(new URLSearchParams({ step })), 0);
  assert.equal(readStep(new URLSearchParams("step=2")), 2);
  assert.equal(readStep(new URLSearchParams("results=1")), 3);
});
test("section rendering preserves every price table in all languages", () => {
  for (const item of catalog.items)
    for (const [locale, text] of Object.entries(translations[item.id] || {})) {
      const before =
        (text.bodyHtml || "").match(/<table\b[\s\S]*?<\/table>/gi) || [];
      const after = splitPublishedSections(
        text.bodyHtml || "",
        item.translations.en?.bodyHtml ||
          item.translations.ru?.bodyHtml ||
          text.bodyHtml ||
          "",
      ).flatMap(
        (section) => section.html.match(/<table\b[\s\S]*?<\/table>/gi) || [],
      );
      assert.deepEqual(after, before, `${item.id} ${locale}`);
    }
});
test("three Turkish days become three readable blocks without losing text", () => {
  const item = catalog.items.find(
    (i) => i.id === "cappadocia-tours-from-istanbul",
  );
  const itinerary = splitPublishedSections(
    translations[item.id].tr.bodyHtml,
    item.translations.en.bodyHtml,
  ).find((s) => s.kind === "itinerary").html;
  const days = splitDays(itinerary);
  assert.equal(days.length, 3);
  assert.equal(days.join("").trim(), itinerary.trim());
  assert.equal(splitDays("1. Gün: İlk gün.\n\n2. Gün: İkinci gün.").length, 2);
});
test("payment conditions remain outside excluded services; disputed admission fees are not stated as confirmed", () => {
  const source =
    "INCLUDED<ul><li>Lunch</li><li>Entrance fees to museums</li></ul>\nNOT INCLUDED<ul><li>Drinks</li></ul><p>Min.50% deposit</p>";
  const cleaned = withoutConflictingAdmission(source),
    parts = splitInclusions(cleaned);
  assert.ok(parts.yes.includes("Lunch"));
  assert.ok(!cleaned.includes("Entrance fees"));
  assert.ok(parts.no.includes("Drinks"));
  assert.ok(parts.note.includes("50%"));
});
test("hotel and transfer gaps are filled in every language, without changing source price tables", () => {
  const baseline = JSON.parse(
    fs.readFileSync(
      new URL("../reports/source-price-fingerprints.json", import.meta.url),
    ),
  );
  for (const item of catalog.items)
    for (const locale of ["en", "tr", "fr", "de", "nl", "ru"]) {
      const text = translations[item.id][locale];
      assert.ok(text.title?.trim(), `${item.id} ${locale}`);
      assert.ok(text.bodyHtml?.trim(), `${item.id} ${locale} body`);
      const tables = (h) => h?.match(/<table\b[\s\S]*?<\/table>/gi) || [];
      assert.equal(
        createHash("sha256")
          .update(JSON.stringify(tables(text.bodyHtml)))
          .digest("hex"),
        baseline[`${item.id}:${locale}`],
        `${item.id} ${locale} source prices`,
      );
    }
});

test("changing an earlier answer clears dependent answers without mutating the old selection", () => {
  const old = { length: "short", departure: "Istanbul", interest: "landscape" };
  assert.deepEqual(chooseTripOption(old, "length", "day"), {
    length: "day",
    departure: "any",
    interest: "any",
  });
  assert.deepEqual(chooseTripOption(old, "departure", "Bodrum"), {
    length: "short",
    departure: "Bodrum",
    interest: "any",
  });
  assert.deepEqual(chooseTripOption(old, "interest", "faith"), {
    ...old,
    interest: "faith",
  });
  assert.deepEqual(old, {
    length: "short",
    departure: "Istanbul",
    interest: "landscape",
  });
});
test("every enabled finder path leads to real tours; counts ignore later answers", () => {
  const all = Object.values(facts),
    departures = ["any", ...new Set(all.flatMap((f) => f.departures))];
  const neutral = { length: "any", departure: "any", interest: "any" };
  const longCounts = getTripOptionCounts(
    all,
    { length: "long", departure: "Bodrum", interest: "city" },
    "departure",
    departures,
  );
  assert.equal(longCounts.Bodrum, 0);
  assert.ok(longCounts.Istanbul > 0);
  for (const length of tripLengths) {
    if (!getTripOptionCounts(all, neutral, "length", tripLengths)[length])
      continue;
    const first = chooseTripOption(neutral, "length", length);
    const points = getTripOptionCounts(all, first, "departure", departures);
    assert.ok(points.any > 0);
    for (const departure of departures) {
      if (!points[departure]) continue;
      const second = chooseTripOption(first, "departure", departure);
      const interests = getTripOptionCounts(
        all,
        second,
        "interest",
        tripInterests,
      );
      assert.ok(interests.any > 0);
      for (const interest of tripInterests) {
        const count = all.filter((f) =>
          matchesTrip(f, { length, departure, interest }),
        ).length;
        assert.equal(interests[interest], count);
        if (interests[interest]) assert.ok(count > 0);
      }
    }
  }
});
test("all impossible saved combinations offer explicitly changed choices with actual matches", () => {
  const all = Object.values(facts),
    departures = ["any", ...new Set(all.flatMap((f) => f.departures))];
  let empty = 0;
  for (const length of tripLengths)
    for (const departure of departures)
      for (const interest of tripInterests) {
        const choices = { length, departure, interest },
          before = JSON.stringify(choices);
        const matches = all.filter((f) => matchesTrip(f, choices));
        const alternatives = getTripAlternatives(all, choices);
        if (matches.length) {
          assert.equal(alternatives.length, 0);
          continue;
        }
        empty++;
        assert.ok(alternatives.length > 0, before);
        for (const alternative of alternatives) {
          assert.notDeepEqual(alternative.choices, choices);
          assert.ok(alternative.count > 0);
          assert.equal(
            alternative.count,
            all.filter((f) => matchesTrip(f, alternative.choices)).length,
          );
          if (alternative.mode === "relax")
            assert.deepEqual(alternative.choices, {
              ...choices,
              [alternative.key]: "any",
            });
          else
            assert.deepEqual(alternative.choices, {
              length: "any",
              departure: "any",
              interest: "any",
              [alternative.key]: choices[alternative.key],
            });
        }
        assert.equal(JSON.stringify(choices), before);
      }
  assert.equal(empty, 99);
});

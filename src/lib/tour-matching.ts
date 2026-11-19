export const tripLengths = ["any", "day", "short", "week", "long"] as const;
export const tripInterests = [
  "any",
  "history",
  "faith",
  "landscape",
  "city",
] as const;
export type TripLength = (typeof tripLengths)[number];
export type TripInterest = (typeof tripInterests)[number];
export type TourFacts = {
  days: number | null;
  departures: string[];
  interests: Exclude<TripInterest, "any">[];
  stops?: { name: string; lat: number; lng: number }[];
  sourceUrl: string;
};
export type TripChoices = {
  length: string;
  departure: string;
  interest: string;
};
export function matchesTrip(facts: TourFacts, choices: TripChoices) {
  const { length, departure, interest } = choices;
  if (departure !== "any" && !facts.departures.includes(departure))
    return false;
  if (
    interest !== "any" &&
    !facts.interests.includes(interest as TourFacts["interests"][number])
  )
    return false;
  if (length === "any") return true;
  if (facts.days === null) return false;
  return length === "day"
    ? facts.days === 1
    : length === "short"
      ? facts.days >= 2 && facts.days <= 3
      : length === "week"
        ? facts.days >= 4 && facts.days <= 7
        : length === "long"
          ? facts.days >= 8
          : false;
}
export function readChoices(
  params: URLSearchParams,
  departures: string[],
): TripChoices {
  const length = params.get("length") || "any";
  const departure = params.get("departure") || "any";
  const interest = params.get("interest") || "any";
  return {
    length: tripLengths.includes(length as TripLength) ? length : "any",
    departure: departures.includes(departure) ? departure : "any",
    interest: tripInterests.includes(interest as TripInterest)
      ? interest
      : "any",
  };
}
export function readStep(params: URLSearchParams) {
  if (params.get("results") === "1") return 3;
  const step = Number(params.get("step"));
  return Number.isInteger(step) && step >= 0 && step <= 2 ? step : 0;
}

export const tripChoiceKeys = ["length", "departure", "interest"] as const;
export type TripChoiceKey = (typeof tripChoiceKeys)[number];
const neutralChoices: TripChoices = {
  length: "any",
  departure: "any",
  interest: "any",
};

// An earlier answer changes the choices that are available afterwards.
export function chooseTripOption(
  choices: TripChoices,
  key: TripChoiceKey,
  value: string,
): TripChoices {
  const next = { ...choices, [key]: value };
  for (const later of tripChoiceKeys.slice(tripChoiceKeys.indexOf(key) + 1))
    next[later] = "any";
  return next;
}

export function getTripOptionCounts(
  facts: TourFacts[],
  choices: TripChoices,
  key: TripChoiceKey,
  values: readonly string[],
): Record<string, number> {
  return Object.fromEntries(
    values.map((value) => {
      const prefix = chooseTripOption(choices, key, value);
      return [value, facts.filter((fact) => matchesTrip(fact, prefix)).length];
    }),
  );
}

export type TripAlternative = {
  key: TripChoiceKey;
  mode: "relax" | "keep";
  choices: TripChoices;
  count: number;
};
// Saved URLs may contain incompatible answers. Offer explicit changes, never silently broaden results.
export function getTripAlternatives(
  facts: TourFacts[],
  choices: TripChoices,
): TripAlternative[] {
  if (facts.some((fact) => matchesTrip(fact, choices))) return [];
  const selected = tripChoiceKeys.filter((key) => choices[key] !== "any");
  const candidates = (mode: TripAlternative["mode"]): TripAlternative[] =>
    selected
      .map((key) => {
        const next =
          mode === "relax"
            ? { ...choices, [key]: "any" }
            : { ...neutralChoices, [key]: choices[key] };
        return {
          key,
          mode,
          choices: next,
          count: facts.filter((fact) => matchesTrip(fact, next)).length,
        };
      })
      .filter((option) => option.count > 0);
  const relaxed = candidates("relax");
  return relaxed.length ? relaxed : candidates("keep");
}

// The same introductory routes featured on the homepage lead the full catalog.
export const recommendedTours = [
  "ephesus-house-of-the-virgin-mary-and-sirince-village",
  "cappadocia-tours-from-istanbul",
  "pamukkale-tours-from-kusadasi",
  "full-day-istanbul-tour-marvelous-istanbul-tour",
  "seven-churches-tour",
  "priene-miletos-didyma-tour",
];
export function recommendationOrder(id: string) {
  const position = recommendedTours.indexOf(id);
  return position < 0 ? recommendedTours.length : position;
}

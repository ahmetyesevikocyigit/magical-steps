export type PublishedSection = {
  kind: "itinerary" | "details" | "pricing" | "other";
  title: string;
  html: string;
};
export function splitPublishedSections(
  html: string,
  source: string,
): PublishedSection[] {
  const pattern = /<h2\b[^>]*>([\s\S]*?)<\/h2>/gi;
  const headings = [...html.matchAll(pattern)];
  const originals = [...source.matchAll(pattern)];
  if (!headings.length || headings.length !== originals.length)
    return [{ kind: "other", title: "", html }];
  const sections: PublishedSection[] = [];
  if (html.slice(0, headings[0].index).trim())
    sections.push({
      kind: "other",
      title: "",
      html: html.slice(0, headings[0].index),
    });
  headings.forEach((heading, index) => {
    const title = originals[index][1].replace(/<[^>]*>/g, "").trim();
    const kind = /Itinerary|Маршрут/i.test(title)
      ? "itinerary"
      : /Price|Цены/i.test(title)
        ? "pricing"
        : /Details|Подробности/i.test(title)
          ? "details"
          : "other";
    sections.push({
      kind,
      title: heading[1],
      html: html.slice(
        heading.index! + heading[0].length,
        headings[index + 1]?.index ?? html.length,
      ),
    });
  });
  return sections;
}

// Only split at explicit day boundaries. All remaining source HTML is retained.
export function splitDays(html: string): string[] {
  const day = String.raw`(?:Day\s*\d+|\d+(?:st|nd|rd|th)?\s*Day|\d+\.?\s*(?:Gün|Tag|jour|dag|день)|(?:Gün|Jour|Tag|Dag|День)\s*\d+)`;
  if (!/<p\b/i.test(html)) {
    const parts = html
      .split(new RegExp(String.raw`(?=${day}\s*:)`, "gi"))
      .filter((part) => part.trim());
    return parts.map((part) =>
      part
        .split(/\n\s*\n/)
        .map((paragraph) => `<p>${paragraph}</p>`)
        .join(""),
    );
  }
  const boundary = new RegExp(
    String.raw`(?=<p\b[^>]*>\s*(?:<strong[^>]*>)?\s*${day})`,
    "gi",
  );
  const parts = html.split(boundary).filter((part) => part.trim());
  return parts.length > 1 ? parts : [html];
}

export function splitInclusions(html: string) {
  const included =
    /^(?:\s|&nbsp;|<br\s*\/?\s*>)*(?:INCLUDED|Dahil olan hizmetler|DAHİL|DAHIL|INCLUS|INBEGRIFFEN|Inbegriffene Leistungen|Inbegrepen|Что включено|ВКЛЮЧЕНО)(?=\s|<|$)(?:\s|<br\s*\/?\s*>)*/i;
  const excluded =
    /(?:NOT INCLUDED|DAHİL DEĞİL|DAHIL DEĞIL|Dahil olmayan hizmetler|NON INCLUS|NICHT ENTHALTEN|Nicht inbegriffen|Niet inbegrepen|Не включено)/i;
  const start = html.match(included),
    end = html.match(excluded);
  if (!start || !end || end.index! <= start[0].length) return null;
  const yes = html.slice(start[0].length, end.index).trim();
  let no = html.slice(end.index! + end[0].length).trim(),
    note = "";
  // Keep payment conditions outside the list of excluded services.
  const finalList = no.lastIndexOf("</ul>");
  if (finalList >= 0) {
    note = no.slice(finalList + 5);
    no = no.slice(0, finalList + 5);
  }
  return { yes, no, note };
}

/** Conflicting admission claims are replaced by one explicit quote-confirmation note.
 * The complete original versions stay in the source catalog and audit report. */
export function withoutConflictingAdmission(html: string) {
  const fee =
    /entrance fees|entry fees|admission fees|giriş ücret|giriş bilet|frais d[’']entr|droits d[’']entr|Eintritt|toegangskosten|entreegeld|входные билет|входных билет/i;
  return html
    .split(/(<[^>]*>)/)
    .map((part) =>
      part.startsWith("<")
        ? part
        : part
            .split("\n")
            .filter((line) => !fee.test(line))
            .join("\n"),
    )
    .join("")
    .replace(/<(?:strong|b)>\s*<\/(?:strong|b)>/g, "")
    .replace(/<li>\s*<\/li>/g, "");
}

import type { Locale } from "./types";
const names: Record<string, Partial<Record<Locale, string>>> = {
  Ephesus: { tr: "Efes", fr: "Éphèse", de: "Ephesos", nl: "Efeze", ru: "Эфес" },
  Cappadocia: {
    tr: "Kapadokya",
    fr: "Cappadoce",
    de: "Kappadokien",
    nl: "Cappadocië",
    ru: "Каппадокия",
  },
  Istanbul: { tr: "İstanbul", ru: "Стамбул" },
  Izmir: { tr: "İzmir", ru: "Измир" },
  Kuşadası: { en: "Kuşadası", ru: "Кушадасы" },
  Bodrum: { ru: "Бодрум" },
  Antalya: { ru: "Анталья" },
  Marmaris: { ru: "Мармарис" },
  Pamukkale: { ru: "Памуккале" },
  Türkiye: {
    en: "Turkey",
    fr: "Turquie",
    de: "Türkei",
    nl: "Turkije",
    ru: "Турция",
  },
};
export const destinationName = (value: string, locale: Locale) =>
  names[value]?.[locale] || value;

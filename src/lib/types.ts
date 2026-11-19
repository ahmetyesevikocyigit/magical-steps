export const locales = ["en", "tr", "fr", "de", "nl", "ru"] as const;
export type Locale = (typeof locales)[number];
export type Kind = "tour" | "hotel" | "sailing" | "transfer";
export type Translation = {
  title: string;
  description: string;
  bodyHtml: string;
  sourceUrl?: string;
};
export type CatalogItem = {
  id: string;
  kind: Kind;
  slug: string;
  sourceUrl: string;
  categoryIds: string[];
  destination: string;
  duration: string;
  price: string;
  images: string[];
  translations: Partial<Record<Locale, Translation>>;
};
export type ContentPage = {
  id: string;
  slug: string;
  sourceUrl: string;
  images?: string[];
  translations: Partial<Record<Locale, Translation>>;
};
export type Category = {
  id: string;
  slug: string;
  kind: Kind;
  title: string;
  sourceUrl: string;
  itemIds: string[];
  translations?: Partial<Record<Locale, Translation>>;
};
export type Media = {
  src: string;
  width: number;
  height: number;
  bytes?: number;
  originalBytes?: number;
};
export type CardItem = {
  id: string;
  title: string;
  description: string;
  href: string;
  kind: Kind;
  destination: string;
  duration: string;
  price: string;
  image: Media;
  categories: string[];
};

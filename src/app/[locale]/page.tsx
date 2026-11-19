import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import heroMedia from "@/data/hero-media.json";
import { getTranslations, setRequestLocale } from "next-intl/server";
import HomeContent from "@/components/HomeContent";
import { baseUrl, localizePath, seoAlternates, featured } from "@/lib/content";
import type { Locale } from "@/lib/types";
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const t = await getTranslations({ locale });
  return {
    title: t("homeTitle"),
    description: t("heroDescription"),
    alternates: {
      ...seoAlternates("/"),
      canonical: baseUrl + localizePath("/", locale),
    },
    openGraph: {
      title: t("homeTitle"),
      description: t("heroDescription"),
      images: [heroMedia.destinations[1].image.src],
      locale,
      url: baseUrl + localizePath("/", locale),
    },
  };
}
export default async function Home({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const schema = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Magical Steps Travel",
    url: baseUrl,
    telephone: "+902566133233",
    email: "info@magical-steps.com",
    foundingDate: "1993",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Cumhuriyet Mah. Muammer Sk. Samsara Plaza No:304",
      addressLocality: "Kuşadası",
      addressRegion: "Aydın",
      addressCountry: "TR",
    },
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <HomeContent locale={locale} />
    </>
  );
}

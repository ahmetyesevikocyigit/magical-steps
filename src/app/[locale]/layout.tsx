import { NextIntlClientProvider, hasLocale } from "next-intl";
import {
  setRequestLocale,
  getMessages,
  getTranslations,
} from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionProvider from "@/components/MotionProvider";
import { featured } from "@/lib/content";
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const [messages, t] = await Promise.all([getMessages(), getTranslations()]);
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <MotionProvider>
        <a href="#main" className="skip-link">
          {t("skipContent")}
        </a>
        <Header logo={featured.logo} />
        <main id="main">{children}</main>
        <Footer logo={featured.logo} />
      </MotionProvider>
    </NextIntlClientProvider>
  );
}

import type { Metadata } from "next";
import { getLocale } from "next-intl/server";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://www.magical-steps.com"),
  title: {
    default: "Magical Steps Travel — Private Turkey Tours",
    template: "%s | Magical Steps Travel",
  },
  description:
    "Discover Ephesus, Istanbul, Cappadocia and Turkey with Magical Steps. Private tours, hotels, sailing and transfers since 1993.",
  icons: { icon: "/favicon.svg" },
  robots: { index: true, follow: true },
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getLocale();
  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  );
}

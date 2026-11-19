"use client";
import Image from "next/image";
import { trapDialogFocus } from "@/lib/dialog";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, getPathname } from "@/i18n/routing";
import { locales, type Locale } from "@/lib/types";
import { useRef, useState, useEffect } from "react";
import { Arrow, Close } from "./Icon";
import s from "./Site.module.css";
const languageNames: Record<Locale, string> = {
  en: "English",
  tr: "Türkçe",
  fr: "Français",
  de: "Deutsch",
  nl: "Nederlands",
  ru: "Русский",
};
export default function Header({ logo }: { logo: string }) {
  const t = useTranslations(),
    locale = useLocale() as Locale,
    path = usePathname();
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  const dialog = useRef<HTMLDialogElement>(null);
  const [opened, setOpened] = useState(false);
  const nav = [
    ["/tours", "navTours"],
    ["/hotels", "navHotels"],
    ["/sailing", "navSailing"],
    ["/transfers", "navTransfers"],
    ["/about", "navAbout"],
  ] as const;
  function close() {
    dialog.current?.close();
    setOpened(false);
  }
  return (
    <>
      <header className={`${s.header} ${path === "/" ? s.homeHeader : ""}`}>
        <Link href="/" aria-label={t("homeLink")} className={s.logo}>
          <Image
            src={logo}
            alt="Magical Steps Travel"
            width={192}
            height={52}
            sizes="192px"
            loading="eager"
          />
        </Link>
        <nav className={s.desktopNav} aria-label={t("menu")}>
          {nav.map(([href, key]) => (
            <Link
              key={href}
              href={href}
              aria-current={path.startsWith(href) ? "page" : undefined}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className={s.headerRight}>
          <label className={s.language}>
            <span className="sr-only">{t("language")}</span>
            <select
              value={locale}
              onChange={(e) =>
                window.location.assign(
                  getPathname({
                    href: path + window.location.search,
                    locale: e.target.value as Locale,
                  }),
                )
              }
            >
              {locales.map((l) => (
                <option key={l} value={l}>
                  {languageNames[l]}
                </option>
              ))}
            </select>
          </label>
          <Link href="/contact" className={`${s.button} ${s.headerCta}`}>
            {t("planTrip")}
            <Arrow />
          </Link>
          <button
            className={s.menuButton}
            aria-label={t("menu")}
            aria-expanded={opened}
            onClick={() => {
              dialog.current?.showModal();
              setOpened(true);
            }}
          >
            <span />
            <span />
          </button>
        </div>
      </header>
      <dialog
        onKeyDown={trapDialogFocus}
        aria-label={t("menu")}
        ref={dialog}
        className={s.mobileMenu}
        onClose={() => setOpened(false)}
        onClick={(e) => {
          if (e.target === dialog.current) close();
        }}
      >
        <div className={s.mobileMenuInner}>
          <button
            className={s.closeButton}
            aria-label={t("close")}
            onClick={close}
          >
            <Close />
          </button>
          <nav aria-label={t("menu")}>
            {[...nav, ["/contact", "navContact"] as const].map(
              ([href, key]) => (
                <Link key={href} href={href} onClick={close}>
                  {t(key)}
                  <Arrow />
                </Link>
              ),
            )}
          </nav>
          <p>Magical Steps Travel</p>
          <a href="tel:+902566133233">+90 256 613 32 33</a>
        </div>
      </dialog>
    </>
  );
}

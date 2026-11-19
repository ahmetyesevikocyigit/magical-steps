import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Arrow } from "./Icon";
import s from "./Site.module.css";
export default async function Footer({ logo }: { logo: string }) {
  const t = await getTranslations();
  return (
    <footer className={s.footer}>
      <div className={s.footerTop}>
        <div className={s.footerBrand}>
          <Link href="/">
            <Image
              src={logo}
              alt="Magical Steps Travel"
              width={221}
              height={60}
              sizes="210px"
            />
          </Link>
          <p>{t("footerDescription")}</p>
          <a
            href="https://www.tripadvisor.com/Attraction_Review-g297972-d2268264-Reviews-Magical_Steps_Travel-Kusadasi_Turkish_Aegean_Coast.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            Tripadvisor <Arrow diagonal />
          </a>
        </div>
        <div className={s.footerColumn}>
          <h2>{t("footerExplore")}</h2>
          <Link href="/tours">{t("navTours")}</Link>
          <Link href="/hotels">{t("navHotels")}</Link>
          <Link href="/sailing">{t("navSailing")}</Link>
          <Link href="/transfers">{t("navTransfers")}</Link>
          <Link href="/gallery">{t("gallery")}</Link>
        </div>
        <div className={s.footerColumn}>
          <h2>{t("footerCompany")}</h2>
          {[
            ["about", "navAbout"],
            ["why-choose-us", "whyUs"],
            ["reviews", "reviews"],
            ["blog", "blog"],
            ["ephesus-map", "ephesusMap"],
          ].map(([slug, key]) => (
            <Link key={slug} href={`/${slug}`}>
              {t(key)}
            </Link>
          ))}
        </div>
        <div className={s.footerColumn}>
          <h2>{t("footerContact")}</h2>
          <a href="mailto:info@magical-steps.com">info@magical-steps.com</a>
          <a href="tel:+902566133233">+90 256 613 32 33</a>
          <a
            href="https://wa.me/905324914452"
            target="_blank"
            rel="noopener noreferrer"
          >
            WhatsApp <Arrow diagonal />
          </a>
          <address>
            Cumhuriyet Mah. Muammer Sk.
            <br />
            Samsara Plaza No:304
            <br />
            Kuşadası, Aydın, Türkiye
          </address>
        </div>
      </div>
      <div className={s.footerBottom}>
        <span>
          © {new Date().getFullYear()} Magical Steps Travel. {t("allRights")}
        </span>
        <div>
          <Link href="/terms">{t("terms")}</Link>
          <Link href="/privacy">{t("privacy")}</Link>
          <Link href="/distance-sales-agreement">{t("distanceSales")}</Link>
        </div>
      </div>
    </footer>
  );
}

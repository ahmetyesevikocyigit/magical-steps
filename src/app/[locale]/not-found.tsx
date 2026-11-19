import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import s from "@/components/Site.module.css";
export default async function NotFound() {
  const t = await getTranslations();
  return (
    <div className={s.pageMain}>
      <div className={s.pageHeader} style={{ minHeight: "60vh" }}>
        <h1>{t("notFoundTitle")}</h1>
        <p>{t("notFoundDescription")}</p>
        <Link href="/" className={s.button} style={{ marginTop: 28 }}>
          {t("returnHome")}
        </Link>
      </div>
    </div>
  );
}

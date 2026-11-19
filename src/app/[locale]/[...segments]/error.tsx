"use client";
import { useTranslations } from "next-intl";
import s from "@/components/Site.module.css";
export default function ErrorPage({ reset }: { reset: () => void }) {
  const t = useTranslations();
  return (
    <div className={s.pageMain}>
      <div className={s.pageHeader}>
        <h1>{t("notFoundTitle")}</h1>
        <p>{t("notFoundDescription")}</p>
        <button className={s.button} onClick={reset}>
          {t("back")}
        </button>
      </div>
    </div>
  );
}

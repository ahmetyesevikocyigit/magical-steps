import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Arrow } from "./Icon";
import s from "./Journey.module.css";
export default async function FinderInvite({
  compact = false,
}: {
  compact?: boolean;
}) {
  const t = await getTranslations();
  return (
    <div className={`${s.invite} ${compact ? s.compactInvite : ""}`}>
      <div>
        <h2>{t("finderInviteTitle")}</h2>
        {!compact && <p>{t("finderDescription")}</p>}
      </div>
      <Link href="/find-your-tour">
        {t("finderStart")}
        <Arrow />
      </Link>
    </div>
  );
}

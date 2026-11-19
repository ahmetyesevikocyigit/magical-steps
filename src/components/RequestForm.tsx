"use client";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import { Arrow } from "./Icon";
import s from "./Site.module.css";
import d from "./Detail.module.css";
export default function RequestForm({
  service,
  layout,
}: {
  service?: string;
  layout?: "detail";
}) {
  const t = useTranslations(),
    [draft, setDraft] = useState(""),
    [status, setStatus] = useState(""),
    [subject, setSubject] = useState(service || "Magical Steps Travel"),
    draftHeading = useRef<HTMLHeadingElement>(null);
  function prepare(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const selectedService = String(
      f.get("service") || service || "Magical Steps Travel",
    ).trim();
    setSubject(selectedService);
    const text = `${selectedService}\n\n${t("fullName")}: ${f.get("name")}\n${t("email")}: ${f.get("email")}\n${t("date")}: ${f.get("date")}\n${t("guests")}: ${f.get("guests")}\n${t("departure")}: ${f.get("departure")}\n\n${f.get("message")}`;
    setDraft(text);
    setStatus("");
    requestAnimationFrame(() => draftHeading.current?.focus());
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(draft);
      setStatus(t("copied"));
    } catch {
      setStatus(t("copyFailed"));
    }
  }
  const today = new Date().toLocaleDateString("sv-SE");
  const heading = (
    <>
      <h2 tabIndex={-1}>{t("requestTrip")}</h2>
      <p>{t("requestDescription")}</p>
    </>
  );
  return (
    <div
      className={`${s.requestForm} ${layout === "detail" ? d.request : ""}`}
      id="request"
    >
      {layout === "detail" ? <div>{heading}</div> : heading}
      <form onSubmit={prepare}>
        <label>
          {t("serviceLabel")}
          <input
            name="service"
            placeholder={t("servicePlaceholder")}
            defaultValue={service || ""}
            readOnly={Boolean(service)}
            required
            maxLength={200}
          />
        </label>
        <div className={s.formGrid}>
          <label>
            {t("fullName")}
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
          <label>
            {t("email")}
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              maxLength={150}
            />
          </label>
          <label>
            {t("date")}
            <input name="date" type="date" min={today} required />
          </label>
          <label>
            {t("guests")}
            <input
              name="guests"
              type="number"
              min="1"
              max="100"
              defaultValue="2"
              required
            />
          </label>
        </div>
        <label>
          {t("departure")}
          <input name="departure" maxLength={150} />
        </label>
        <label>
          {t("message")}
          <textarea name="message" rows={4} maxLength={1800} />
        </label>
        <button className={s.button} type="submit">
          {t("prepareEmail")}
          <Arrow />
        </button>
      </form>
      {draft && (
        <div className={s.draft}>
          <h3 ref={draftHeading} tabIndex={-1} role="status">
            {t("draftReady")}
          </h3>
          <p>{t("mailHint")}</p>
          <label>
            <span className="sr-only">{t("message")}</span>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={8}
            />
          </label>
          <div className={s.draftButtons}>
            <a
              className={s.button}
              href={`mailto:info@magical-steps.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(draft)}`}
            >
              {t("openEmailApplication")}
              <Arrow />
            </a>
            <button type="button" className={s.buttonOutline} onClick={copy}>
              {t("copyDraft")}
            </button>
          </div>
          <p role="status">{status}</p>
        </div>
      )}
    </div>
  );
}

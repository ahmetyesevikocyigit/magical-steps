"use client";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "motion/react";
import s from "./Site.module.css";

export default function EnquiryLink({
  target = "request",
  children,
  className,
}: {
  target?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const t = useTranslations();
  const reduced = useReducedMotion();
  return (
    <a
      href={`#${target}`}
      className={className ?? s.button}
      onClick={(event) => {
        const form =
          event.currentTarget
            .closest("[data-detail-content]")
            ?.querySelector<HTMLElement>(`#${target}`) ??
          document.getElementById(target);
        if (!form) return;
        event.preventDefault();
        // Resolve deferred section heights before choosing an anchor's scroll position.
        form.closest<HTMLElement>("[data-detail-content]")?.setAttribute("data-reveal-sections", "true");
        form.scrollIntoView({
          behavior: reduced ? "instant" : "smooth",
          block: "start",
        });
        form.querySelector<HTMLElement>("h2")?.focus({ preventScroll: true });
      }}
    >
      {children || (
        <>
          {t("requestTrip")} <span aria-hidden="true">↗</span>
        </>
      )}
    </a>
  );
}

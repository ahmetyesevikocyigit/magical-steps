"use client";
import Image from "next/image";
import { trapDialogFocus } from "@/lib/dialog";
import { useState, useRef } from "react";
import { useTranslations } from "next-intl";
import type { Media } from "@/lib/types";
import { Arrow, Close } from "./Icon";
import s from "./Site.module.css";
import d from "./Detail.module.css";
export default function Gallery({
  images,
  title,
  featured = false,
}: {
  images: Media[];
  title: string;
  featured?: boolean;
}) {
  const t = useTranslations(),
    [active, setActive] = useState(0),
    [open, setOpen] = useState(false),
    dialog = useRef<HTMLDialogElement>(null);
  if (!images.length) return null;
  return (
    <>
      <div
        className={featured ? d.gallery : s.gallery}
        style={
          featured
            ? {
                gridTemplateColumns: `repeat(${Math.min(4, Math.max(1, images.length - 1))}, minmax(0, 1fr))`,
              }
            : undefined
        }
      >
        {images.slice(0, featured ? 5 : 8).map((image, i) => (
          <button
            key={image.src + i}
            aria-label={
              featured && i === 4 && images.length > 5
                ? `${t("viewAll")} — ${title}`
                : `${title} — ${i + 1}${featured && i === 0 ? ` / ${images.length}` : ""}`
            }
            aria-haspopup="dialog"
            onClick={() => {
              setActive(i);
              setOpen(true);
              dialog.current?.showModal();
            }}
          >
            <Image
              src={image.src}
              alt={`${title} — ${i + 1}`}
              fill
              sizes={
                featured
                  ? i === 0
                    ? "(max-width: 760px) 90vw, (max-width: 1280px) 54vw, 650px"
                    : "(max-width: 760px) 22vw, (max-width: 1280px) 13vw, 160px"
                  : "(max-width:600px) 44vw, 22vw"
              }
              preload={featured && i === 0}
              loading={featured && i === 0 ? undefined : "lazy"}
              fetchPriority={featured ? (i === 0 ? "high" : "low") : undefined}
              quality={featured ? 75 : 80}
            />
            {featured && i === 0 && (
              <span className={d.photoCount} aria-hidden="true">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <circle cx="8" cy="10" r="1.5" />
                  <path d="m4 18 6-5 4 3 3-3 4 5" />
                </svg>
                1 / {images.length}
              </span>
            )}
            {featured && i === 4 && images.length > 5 && (
              <span className={d.morePhotos} aria-hidden="true">
                {t("viewAll")}
              </span>
            )}
          </button>
        ))}
      </div>
      <dialog
        aria-label={title}
        ref={dialog}
        className={s.galleryDialog}
        onClose={() => setOpen(false)}
        onKeyDown={(e) => {
          trapDialogFocus(e);
          if (e.key === "ArrowRight") setActive((i) => (i + 1) % images.length);
          if (e.key === "ArrowLeft")
            setActive((i) => (i + images.length - 1) % images.length);
        }}
      >
        <button
          className={s.closeButton}
          aria-label={t("close")}
          onClick={() => dialog.current?.close()}
        >
          <Close />
        </button>
        <div className={s.galleryFull}>
          {open && (
            <Image
              src={images[active].src}
              alt={`${title} — ${active + 1}`}
              fill
              sizes="90vw"
              quality={90}
            />
          )}
        </div>
        <div className={s.galleryControls}>
          <button
            aria-label={t("previous")}
            onClick={() =>
              setActive((i) => (i + images.length - 1) % images.length)
            }
          >
            <Arrow style={{ transform: "rotate(180deg)" }} />
          </button>
          <span>
            {active + 1} / {images.length}
          </span>
          <button
            aria-label={t("next")}
            onClick={() => setActive((i) => (i + 1) % images.length)}
          >
            <Arrow />
          </button>
        </div>
      </dialog>
    </>
  );
}

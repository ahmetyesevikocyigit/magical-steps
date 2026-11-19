"use client";
import Image from "next/image";
import { trapDialogFocus } from "@/lib/dialog";
import { useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Close } from "./Icon";
import s from "./Site.module.css";
type Video = { id: string; url: string; title: string; src: string };
export default function VideoGallery({ videos }: { videos: Video[] }) {
  const t = useTranslations();
  const dialog = useRef<HTMLDialogElement>(null);
  const [active, setActive] = useState<Video | null>(null);
  return (
    <section className={s.videoSection} aria-label={t("videoTitle")}>
      <h2>{t("videoTitle")}</h2>
      <div className={s.videoGrid}>
        {videos.map((video) => (
          <button
            key={video.id}
            onClick={() => {
              setActive(video);
              dialog.current?.showModal();
            }}
          >
            <span className={s.videoPreview}>
              <Image
                src={video.src}
                alt=""
                fill
                sizes="(max-width:600px) 44vw, 22vw"
              />
              <span aria-hidden="true">▶</span>
            </span>
            <span>{video.title}</span>
          </button>
        ))}
      </div>
      <dialog
        onKeyDown={trapDialogFocus}
        ref={dialog}
        className={s.videoDialog}
        aria-label={active?.title || t("videoTitle")}
        onClose={() => setActive(null)}
      >
        <button
          className={s.closeButton}
          aria-label={t("close")}
          onClick={() => dialog.current?.close()}
        >
          <Close />
        </button>
        {active && (
          <>
            <iframe
              title={active.title}
              src={`https://www.youtube-nocookie.com/embed/${active.id}?autoplay=1`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
            <a
              className={s.videoSource}
              href={active.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube ↗
            </a>
          </>
        )}
      </dialog>
    </section>
  );
}

"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { destinationName } from "@/lib/format";
import type { CardItem, Locale } from "@/lib/types";
import { Arrow } from "./Icon";
import s from "./Site.module.css";
export default function Card({
  item,
  index = 0,
  compact = true,
}: {
  item: CardItem;
  index?: number;
  compact?: boolean;
}) {
  const t = useTranslations(),
    reduced = useReducedMotion();
  const locale = useLocale() as Locale;
  const [nearViewport, setNearViewport] = useState(index === 0);
  const imageBox = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (nearViewport || !imageBox.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setNearViewport(true);
        observer.disconnect();
      },
      { rootMargin: "240px" },
    );
    observer.observe(imageBox.current);
    return () => observer.disconnect();
  }, [nearViewport]);
  const Title = compact ? "h3" : "h2";
  const cover = (
    <Image
      src={item.image.src}
      unoptimized={!item.image.src.startsWith("/images/hero-v2/")}
      alt=""
      fill
      sizes="(max-width:600px) 88vw, (max-width:1000px) 44vw, (max-width:1500px) 29vw, 440px"
      quality={80}
      preload={!compact && index === 0}
      fetchPriority={!compact && index === 0 ? "high" : "low"}
    />
  );
  return (
    <m.article
      className={s.card}
      initial={false}
      whileHover={reduced ? undefined : { y: -7 }}
      transition={{ duration: 0.28 }}
    >
      <Link href={item.href} prefetch={false} className={s.cardLink}>
        <m.div ref={imageBox} className={s.cardImage} initial={false}>
          {nearViewport ? cover : <noscript>{cover}</noscript>}
        </m.div>
        <div className={s.cardInfo}>
          <div className={s.cardMeta}>
            {[destinationName(item.destination, locale), item.duration]
              .filter(Boolean)
              .join(" · ")}
          </div>
          <Title>{item.title}</Title>
          <div className={s.cardBottom}>
            {item.price ? (
              <span>{item.price}</span>
            ) : (
              <span>{t("discover")}</span>
            )}
            <Arrow />
          </div>
        </div>
      </Link>
    </m.article>
  );
}

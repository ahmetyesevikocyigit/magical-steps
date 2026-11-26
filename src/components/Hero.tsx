"use client";
import Image, { getImageProps } from "next/image";
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { Link } from "@/i18n/routing";
import { destinationName } from "@/lib/format";
import type { Media, Locale } from "@/lib/types";
import { Arrow } from "./Icon";
import h from "./Hero.module.css";

type Destination = {
  id: string;
  name: string;
  image: Media;
  mobileImage: Media;
  thumbnail: Media;
};
type Flight = {
  duration: number;
  destination: Destination;
  origin: { x: number; y: number; width: number; height: number };
  target: { x: number; y: number; width: number; height: number };
  canvas: { width: number; height: number; x: number; y: number };
  story?: {
    x: number;
    y: number;
    width: number;
    height: number;
    fontSize: number;
    lineHeight: string;
    letterSpacing: string;
    cardScale: number;
    pieceScale: number;
  };
};
export default function Hero({
  destinations,
}: {
  destinations: Destination[];
}) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const reduced = useReducedMotion();
  const [selected, setSelected] = useState(
    () => destinations.find((d) => d.id === "cappadocia") || destinations[0],
  );
  const [flight, setFlight] = useState<Flight | null>(null);
  const [hasChosen, setHasChosen] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);
  const scene = useRef<HTMLDivElement>(null);
  const choices = useRef<HTMLDivElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const request = useRef(0);
  const currentPlace = destinationName(selected.name, locale);
  const sceneDuration = flight?.duration ?? 2.65;
  const imageDuration = sceneDuration * 0.5;
  const mobileProps = getImageProps({
    src: selected.mobileImage.src,
    alt: "",
    fill: true,
    sizes: "100vw",
    quality: 80,
  }).props;
  const flightMobileProps = flight
    ? getImageProps({
        src: flight.destination.mobileImage.src,
        alt: "",
        fill: true,
        sizes: "100vw",
        quality: 80,
      }).props
    : null;

  useEffect(
    () => () => {
      request.current += 1;
    },
    [],
  );
  useEffect(() => {
    if (!flight) return;
    const settle = () => setFlight(null);
    // Keep the picker usable if the optional Motion engine fails to complete.
    const timeout = window.setTimeout(settle, flight.duration * 1000 + 500);
    window.addEventListener("resize", settle, { passive: true });
    window.addEventListener("scroll", settle, { passive: true });
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("resize", settle);
      window.removeEventListener("scroll", settle);
    };
  }, [flight]);

  useLayoutEffect(() => {
    if (!flight || flight.story || !heading.current) return;
    // Measure the chosen headline after React renders it. The moving text uses
    // the same line breaks and typography, so the final handoff has no jump.
    const rect = heading.current.getBoundingClientRect();
    const typography = window.getComputedStyle(heading.current);
    const inkWidth = Math.max(
      ...Array.from(
        heading.current.querySelectorAll("span, em"),
        (line) => line.getBoundingClientRect().width,
      ),
      1,
    );
    setFlight(
      (current) =>
        current && {
          ...current,
          story: {
            x: rect.x,
            y: rect.y,
            width: rect.width,
            height: rect.height,
            fontSize: parseFloat(typography.fontSize),
            lineHeight: typography.lineHeight,
            letterSpacing: typography.letterSpacing,
            cardScale: Math.min(
              0.8,
              (current.origin.width - 28) / inkWidth,
              (current.origin.height - 24) / rect.height,
            ),
            pieceScale: Math.min(
              0.85,
              (current.target.width - 48) / inkWidth,
              (current.target.height - 48) / rect.height,
            ),
          },
        },
    );
  }, [flight]);

  async function choose(destination: Destination, button: HTMLButtonElement) {
    if (loading || flight) return;
    if (hasChosen && destination.id === selected.id) return;
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const token = ++request.current;
    setLoading(destination.id);
    setLoadError(false);
    const { props } = getImageProps({
      src: (mobile ? destination.mobileImage : destination.image).src,
      alt: "",
      fill: true,
      sizes: "100vw",
      quality: 80,
    });
    const preload = new window.Image();
    try {
      await new Promise<void>((resolve, reject) => {
        const timeout = window.setTimeout(() => {
          preload.onload = null;
          preload.onerror = null;
          reject(new Error("Image loading timed out"));
        }, 8000);
        preload.onload = () => {
          window.clearTimeout(timeout);
          resolve();
        };
        preload.onerror = () => {
          window.clearTimeout(timeout);
          reject(new Error("Image loading failed"));
        };
        preload.sizes = props.sizes || "100vw";
        preload.srcset = props.srcSet || "";
        preload.src = props.src;
      });
    } catch {
      if (token === request.current) {
        setLoading(null);
        setLoadError(true);
      }
      return;
    }
    if (token !== request.current || !button.isConnected || !scene.current)
      return;
    if (mobile && choices.current) {
      // Fully reveal the chosen card without moving the page vertically.
      const rail = choices.current;
      rail.scrollTo({
        left:
          button.offsetLeft -
          rail.offsetLeft -
          (rail.clientWidth - button.clientWidth) / 2,
        behavior: "instant",
      });
    }
    const origin = button
      .querySelector("[data-choice-image]")!
      .getBoundingClientRect();
    const bounds = scene.current.getBoundingClientRect();
    const left = bounds.width * (mobile ? 0.23 : 0.61);
    const top = bounds.height * (mobile ? 0.22 : 0.18);
    const width = bounds.width * (mobile ? 0.64 : 0.33);
    const height = bounds.height * (mobile ? 0.48 : 0.68);
    setSelected(destination);
    setHasChosen(true);
    if (
      !reduced &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // The floating photograph finishes on the same crop as the whole scene.
      // The background resolves around it; no hole is cut out of the landscape.
      setFlight({
        duration: mobile ? 1.15 : 2.65,
        destination,
        origin: {
          x: origin.x,
          y: origin.y,
          width: origin.width,
          height: origin.height,
        },
        target: { x: bounds.x + left, y: bounds.y + top, width, height },
        canvas: {
          width: bounds.width,
          height: bounds.height,
          x: -left,
          y: -top,
        },
      });
    }
    setLoading(null);
  }
  return (
    <>
      <section
        className={h.hero}
        style={{ "--scene-duration": `${sceneDuration}s` } as CSSProperties}
        data-assembling={Boolean(flight) || undefined}
        data-selected-destination={selected.id}
        data-testid="hero"
        aria-labelledby="hero-heading"
      >
        <div ref={scene} className={h.scene} data-testid="hero-scene">
          <div key={selected.id} className={h.landscape}>
            <picture>
              <source
                media="(max-width: 760px)"
                srcSet={mobileProps.srcSet}
                sizes="100vw"
              />
              <Image
                src={selected.image.src}
                alt={currentPlace}
                fill
                sizes="100vw"
                quality={80}
                loading="eager"
                fetchPriority="high"
                className={h.photo}
              />
            </picture>
          </div>
          <div className={h.wash} />
        </div>
        <h1 ref={heading} id="hero-heading" className={h.title}>
          <span>
            {hasChosen ? t(`heroStory_${selected.id}_line1`) : t("heroTitle1")}
          </span>
          <br />
          <em>
            {hasChosen ? t(`heroStory_${selected.id}_line2`) : t("heroTitle2")}
          </em>
        </h1>
        <div
          className={h.chooser}
          aria-labelledby="hero-choice-heading"
          data-testid="hero-direct-picker"
        >
          <div className={h.choiceHeading}>
            <h2 id="hero-choice-heading">
              <span className={h.desktopCopy}>{t("heroChoiceTitle")}</span>
              <span className={h.mobileCopy}>{t("heroMobileChoiceTitle")}</span>
            </h2>
            <p id="hero-choice-hint">
              <span className={h.desktopCopy}>{t("heroChoiceHint")}</span>
              <span className={h.mobileCopy}>{t("heroMobileChoiceHint")}</span>
            </p>
          </div>
          <div
            ref={choices}
            className={h.choices}
            aria-busy={Boolean(loading)}
            onKeyDown={(event) => {
              if (event.altKey || event.ctrlKey || event.metaKey) return;
              if (
                !["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)
              )
                return;
              const buttons = Array.from(
                event.currentTarget.querySelectorAll("button"),
              );
              const index = buttons.indexOf(event.target as HTMLButtonElement);
              if (index < 0) return;
              event.preventDefault();
              const next =
                event.key === "Home"
                  ? 0
                  : event.key === "End"
                    ? buttons.length - 1
                    : (index +
                        (event.key === "ArrowRight" ? 1 : -1) +
                        buttons.length) %
                      buttons.length;
              buttons[next]?.focus({ preventScroll: true });
              if (window.matchMedia("(max-width: 760px)").matches) {
                const rail = event.currentTarget;
                rail.scrollTo({
                  left: buttons[next].offsetLeft - rail.offsetLeft - 20,
                  behavior: "instant",
                });
              }
            }}
          >
            {destinations.map((destination) => (
              <button
                key={destination.id}
                className={h.choice}
                aria-disabled={Boolean(loading || flight)}
                aria-describedby="hero-choice-hint"
                aria-pressed={selected.id === destination.id}
                data-flying={
                  flight?.destination.id === destination.id || undefined
                }
                onClick={(event) =>
                  void choose(destination, event.currentTarget)
                }
              >
                <span className={h.choiceImage} data-choice-image>
                  <Image
                    src={destination.image.src}
                    alt=""
                    fill
                    sizes="(max-width:760px) 168px, (max-width:1100px) 21vw, 230px"
                    quality={80}
                    loading="eager"
                    fetchPriority="low"
                    className={h.photo}
                  />
                  {selected.id === destination.id && (
                    <span className={h.selectedMark} aria-hidden="true">
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="m3 8 3 3 7-7" />
                      </svg>
                    </span>
                  )}
                  {loading === destination.id && (
                    <span className={h.spinner} aria-hidden="true" />
                  )}
                </span>
                <span className={h.choiceContent}>
                  <span className={h.choiceName}>
                    {destinationName(destination.name, locale)}
                    <Arrow diagonal />
                  </span>
                  <span
                    className={h.choiceInvitation}
                    id={`hero-invitation-${destination.id}`}
                  >
                    {t(`heroStory_${destination.id}_invitation`)}
                  </span>
                </span>
              </button>
            ))}
          </div>
          <p className={loadError ? h.status : "sr-only"} role="status">
            {loadError
              ? t("heroImageError")
              : loading
                ? t("heroPreparing")
                : ""}
          </p>
          <Link href="/tours" className={h.allTours}>
            {t("allToursLink")}
          </Link>
        </div>
        <div className={h.destination} aria-live="polite">
          <h2>{currentPlace}</h2>
          <Link
            href={`/tours?destination=${encodeURIComponent(selected.name)}`}
            className={h.tourLink}
          >
            {t("destinationTours", { destination: currentPlace })}
            <Arrow />
          </Link>
        </div>
        <a href="#explore" className={h.scroll} aria-label={t("toursTitle")}>
          <svg
            width="20"
            height="25"
            viewBox="0 0 24 28"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M12 2v22M5 17l7 7 7-7" />
          </svg>
        </a>
      </section>
      {flight && (
        <m.div
          key={flight.destination.id}
          className={h.flight}
          aria-hidden="true"
          data-testid="hero-selected-image"
          initial={{
            ...flight.origin,
            borderRadius: 14,
            opacity: 1,
            boxShadow: "0 22px 70px #10212b55",
          }}
          animate={{
            ...flight.target,
            borderRadius: 0,
            opacity: [1, 1, 0, 0],
            boxShadow: "0 0 0 #10212b00",
          }}
          transition={{
            duration: imageDuration,
            ease: [0.22, 1, 0.36, 1],
            opacity: { duration: sceneDuration, times: [0, 0.6, 0.84, 1] },
            boxShadow: {
              delay: sceneDuration * 0.49,
              duration: sceneDuration * 0.23,
            },
          }}
        >
          <m.div
            className={h.flightCanvas}
            initial={{
              width: flight.origin.width,
              height: flight.origin.height,
              x: 0,
              y: 0,
            }}
            animate={flight.canvas}
            transition={{ duration: imageDuration, ease: [0.22, 1, 0.36, 1] }}
          >
            <picture>
              <source
                media="(max-width:760px)"
                srcSet={flightMobileProps?.srcSet}
                sizes="100vw"
              />
              <Image
                src={flight.destination.image.src}
                alt=""
                fill
                sizes="100vw"
                quality={80}
                loading="eager"
                className={`${h.photo} ${h.flightPhoto}`}
              />
            </picture>
            <m.div
              className={h.wash}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: sceneDuration * 0.57,
                delay: sceneDuration * 0.11,
              }}
            />
          </m.div>
          <m.div
            className={h.flightShade}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 1, 0] }}
            transition={{ duration: sceneDuration, times: [0, 0.12, 0.6, 1] }}
          />
        </m.div>
      )}
      {flight?.story && (
        <div className={h.storyLayer} aria-hidden="true">
          <m.div
            className={h.movingStory}
            aria-hidden="true"
            data-testid="hero-flight-story"
            style={{
              width: flight.story.width,
              height: flight.story.height,
              fontSize: flight.story.fontSize,
              lineHeight: flight.story.lineHeight,
              letterSpacing: flight.story.letterSpacing,
            }}
            initial={{
              x:
                flight.origin.x +
                flight.origin.width / 2 -
                flight.story.width / 2,
              y:
                flight.origin.y +
                flight.origin.height / 2 -
                flight.story.height / 2,
              scale: flight.story.cardScale,
              opacity: 0,
            }}
            animate={{
              x: [
                flight.origin.x +
                  flight.origin.width / 2 -
                  flight.story.width / 2,
                flight.target.x +
                  flight.target.width / 2 -
                  flight.story.width / 2,
                flight.target.x +
                  flight.target.width / 2 -
                  flight.story.width / 2,
                flight.story.x,
              ],
              y: [
                flight.origin.y +
                  flight.origin.height / 2 -
                  flight.story.height / 2,
                flight.target.y +
                  flight.target.height / 2 -
                  flight.story.height / 2,
                flight.target.y +
                  flight.target.height / 2 -
                  flight.story.height / 2,
                flight.story.y,
              ],
              scale: [
                flight.story.cardScale,
                flight.story.pieceScale,
                flight.story.pieceScale,
                1,
              ],
              opacity: [0, 1, 1, 1],
            }}
            transition={{
              duration: sceneDuration,
              times: [0, 0.5, 0.62, 1],
              ease: [0.22, 1, 0.36, 1],
              opacity: { duration: sceneDuration, times: [0, 0.12, 0.62, 1] },
            }}
            onAnimationComplete={() => setFlight(null)}
          >
            <span>{t(`heroStory_${flight.destination.id}_line1`)}</span>
            <br />
            <em>{t(`heroStory_${flight.destination.id}_line2`)}</em>
          </m.div>
        </div>
      )}
    </>
  );
}

"use client";
import { LazyMotion, LayoutGroup, MotionConfig } from "motion/react";
// Interactive animations load only after a visitor interacts.
// Static cards and the hero stay fully visible before this optional engine loads.
const features = () =>
  new Promise<typeof import("./motion-features").default>((resolve) => {
    const events = ["pointermove", "pointerdown", "keydown", "scroll"] as const;
    const activate = () => {
      events.forEach((event) => window.removeEventListener(event, activate));
      void import("./motion-features").then((module) =>
        resolve(module.default),
      );
    };
    events.forEach((event) =>
      window.addEventListener(event, activate, { once: true, passive: true }),
    );
  });
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LazyMotion features={features} strict>
      <MotionConfig reducedMotion="user">
        <LayoutGroup id="magical">{children}</LayoutGroup>
      </MotionConfig>
    </LazyMotion>
  );
}

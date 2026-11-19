"use client";
import { useEffect, useRef } from "react";
export default function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const element = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = element.current;
    if (
      !node ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      node.getBoundingClientRect().top < window.innerHeight
    )
      return;
    let animation: Animation | undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        animation = node.animate(
          [
            { opacity: 0, transform: "translateY(18px)" },
            { opacity: 1, transform: "translateY(0)" },
          ],
          {
            duration: 650,
            delay: delay * 1000,
            easing: "cubic-bezier(.22,1,.36,1)",
            fill: "backwards",
          },
        );
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      animation?.cancel();
    };
  }, [delay]);
  return (
    <div ref={element} className={className}>
      {children}
    </div>
  );
}

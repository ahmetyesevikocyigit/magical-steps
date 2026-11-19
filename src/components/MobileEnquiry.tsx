"use client";
import { useEffect, useRef, useState } from "react";
import EnquiryLink from "./EnquiryLink";
import s from "./Journey.module.css";
export default function MobileEnquiry() {
  const bar = useRef<HTMLDivElement>(null);
  const [introPassed, setIntroPassed] = useState(false);
  const [formVisible, setFormVisible] = useState(false);
  useEffect(() => {
    const content = bar.current?.closest("[data-detail-content]");
    const intro = content?.querySelector("[data-detail-intro]");
    const form = content?.querySelector("#request");
    if (!intro || !form) return;
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.target === intro) {
          setIntroPassed(
            !entry.isIntersecting && entry.boundingClientRect.bottom <= 0,
          );
        } else {
          setFormVisible(entry.isIntersecting);
        }
      }
    });
    observer.observe(intro);
    observer.observe(form);
    return () => observer.disconnect();
  }, []);
  const visible = introPassed && !formVisible;
  return (
    <div
      ref={bar}
      className={s.mobileEnquiry}
      style={
        visible ? undefined : { visibility: "hidden", pointerEvents: "none" }
      }
      aria-hidden={!visible || undefined}
    >
      {visible && <EnquiryLink />}
    </div>
  );
}

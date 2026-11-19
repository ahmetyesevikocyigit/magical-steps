import type { KeyboardEvent } from "react";
export function trapDialogFocus(event: KeyboardEvent<HTMLDialogElement>) {
  if (event.key !== "Tab") return;
  const targets = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select,textarea,iframe,[tabindex="0"]',
    ),
  ).filter((element) => element.getClientRects().length > 0);
  if (!targets.length) return;
  const first = targets[0],
    last = targets[targets.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

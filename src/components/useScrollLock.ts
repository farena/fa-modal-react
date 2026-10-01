import { useEffect } from "react";

/** Shared across every mounted modal, so the page stays locked until the last one unmounts. */
let locks = 0;
let previous: { overflow: string; paddingRight: string } | null = null;

function lock() {
  locks++;
  if (locks > 1) return;

  const root = document.documentElement;
  // Compensates for the scrollbar that disappears, so the page doesn't shift sideways.
  const scrollbarWidth = window.innerWidth - root.clientWidth;

  previous = {
    overflow: root.style.overflow,
    paddingRight: root.style.paddingRight,
  };
  root.style.overflow = "hidden";
  if (scrollbarWidth > 0) {
    const current = parseFloat(getComputedStyle(root).paddingRight) || 0;
    root.style.paddingRight = `${current + scrollbarWidth}px`;
  }
}

function unlock() {
  locks = Math.max(0, locks - 1);
  if (locks > 0 || !previous) return;

  const root = document.documentElement;
  root.style.overflow = previous.overflow;
  root.style.paddingRight = previous.paddingRight;
  previous = null;
}

/** Locks page scrolling while the calling component is mounted. */
export function useScrollLock() {
  useEffect(() => {
    lock();
    return unlock;
  }, []);
}

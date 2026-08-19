"use client";

import { useEffect } from "react";

/**
 * Stamps <html data-scroll-at-top> while the page rests at the very top.
 * globals.css keys off it to hand overscroll-behavior-y back to the browser
 * there — the root-level `none` that keeps the footer from exposing an empty
 * viewport also swallows the pull-to-refresh gesture, which can only start
 * from the top of the page.
 */
export function ScrollAtTopMarker() {
  useEffect(() => {
    let animationFrame = 0;

    const updateMarker = () => {
      animationFrame = 0;
      if (window.scrollY <= 0) {
        document.documentElement.dataset.scrollAtTop = "true";
      } else {
        delete document.documentElement.dataset.scrollAtTop;
      }
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateMarker);
    };

    updateMarker();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      delete document.documentElement.dataset.scrollAtTop;
    };
  }, []);

  return null;
}

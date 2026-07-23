"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";

export function AnnouncementBanner() {
  const bannerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    let animationFrame = 0;
    let readyTimer = 0;
    let currentOffset: number | null = null;

    const updateAnnouncementOffset = () => {
      animationFrame = 0;
      const bannerHeight = bannerRef.current?.offsetHeight ?? 0;
      const nextOffset = window.scrollY <= 0 ? bannerHeight : 0;
      if (nextOffset === currentOffset) return;

      const isInitialUpdate = currentOffset === null;
      currentOffset = nextOffset;
      document.documentElement.style.setProperty(
        "--site-announcement-offset",
        `${nextOffset}px`,
      );

      if (isInitialUpdate) {
        readyTimer = window.setTimeout(() => {
          document.documentElement.dataset.siteAnnouncementReady = "true";
        }, 0);
      }
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateAnnouncementOffset);
    };

    updateAnnouncementOffset();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      if (readyTimer) window.clearTimeout(readyTimer);
      delete document.documentElement.dataset.siteAnnouncementReady;
      document.documentElement.style.removeProperty(
        "--site-announcement-offset",
      );
    };
  }, []);

  return (
    <aside
      ref={bannerRef}
      className="site-announcement"
      aria-label="Announcement"
    >
      <Link href="/blog/own-your-ai">
        <Image
          src="/localfirst-conf-mark.png"
          alt=""
          width={24}
          height={24}
          className="site-announcement-logo"
        />
        <span className="site-announcement-message">
          <span>Watch our talk at Local-First Conf 2026, Berlin</span>
          <span className="site-announcement-cta" aria-hidden>
            →
          </span>
        </span>
      </Link>
    </aside>
  );
}

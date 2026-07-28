"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * THE COVER LIFT — the stage the cover is lifted off the report on.
 *
 * The choreography, the geometry and both of its conditions live in the
 * stylesheet (`.cover-lift` in app/sections.css — read that first). This
 * component contributes exactly one number: `--cover-lift`, how far through the
 * lift the reader has scrolled, 0 → 1. It drives a single transform on a single
 * element and nothing else.
 *
 * Every figure it needs is read back from the layout the stylesheet produced —
 * the cover's height, the scroll the pin lasts, the held moment — so the two can
 * never hold different opinions about the gesture. Change `--cover-h` or
 * `--cover-hold` in globals.css and this follows without being told.
 *
 * The per-frame work is one `getBoundingClientRect()` on the stage. Everything
 * that only changes with the window is measured on resize instead, and the
 * property is written only when the rounded value actually moves.
 */
export function CoverLift({ children }: { children: ReactNode }) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const sheet = stage?.firstElementChild as HTMLElement | null;
    if (!stage || !sheet) return;

    /* The stylesheet's own conditions, restated from one query so the script and
       the stage can never disagree about whether there is a lift to drive. */
    const lifts = window.matchMedia(
      "(min-width: 900px) and (prefers-reduced-motion: no-preference)",
    );

    /* Measured on resize, not per frame: the cover's height (`rise` — the window
       the page travels through), where the cover pins, and the held moment.
       `offsetHeight` is layout, so our own transform never feeds back into it. */
    let rise = 0;
    let hold = 0;
    let pinTop = 0;

    let frame = 0;
    let written = -1;

    const write = (value: number) => {
      if (value === written) return;
      written = value;
      stage.style.setProperty("--cover-lift", String(value));
    };

    const paint = () => {
      frame = 0;
      if (!lifts.matches || rise <= 0) {
        write(0);
        return;
      }
      // how far the page has scrolled since the cover pinned
      const past = pinTop - stage.getBoundingClientRect().top;
      const progress = (past - hold) / rise;
      // three decimals is finer than a pixel of throw — enough to be smooth,
      // coarse enough that a still page never rewrites the property
      write(Math.min(1, Math.max(0, Math.round(progress * 1000) / 1000)));
    };

    const remeasure = () => {
      rise = sheet.offsetHeight;
      // the stage is one cover taller than the scroll the pin lasts, and that
      // scroll is the held moment plus the rise
      hold = Math.max(0, stage.offsetHeight - rise - rise);
      pinTop = parseFloat(getComputedStyle(sheet).top) || 0;
      paint();
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paint);
    };

    remeasure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", remeasure);
    lifts.addEventListener("change", remeasure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", remeasure);
      lifts.removeEventListener("change", remeasure);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={stageRef} className="cover-lift">
      <div className="cover-lift-sheet">{children}</div>
    </div>
  );
}

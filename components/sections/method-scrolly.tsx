"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { MethodMorph } from "@/components/figures/method-morph";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type { MethodStage } from "@/types";

/**
 * The three-column scrollytelling body of the engine chapter.
 *
 * LEFT   — the live stage marker: the one stage the engine is running, set as a
 *          large number over its name. Exactly one exists at a time — the
 *          previous stage leaves before the next arrives, so it reads as a
 *          readout changing, never as a menu to choose from.
 * CENTRE — one pinned visualization (the perception engine) that morphs
 *          through five states as the reader scrolls.
 * RIGHT  — the five stage explanations, and nothing else. The active block is
 *          the one whose centre sits nearest the viewport centre; that index
 *          drives both the visualization and the marker, so all three columns
 *          are always reading the same stage.
 *
 * Both left and centre are sticky grid items, so they hold still for the whole
 * chapter and only the explanations move.
 *
 * The active state is a pure function of scroll position, so scrolling back up
 * reverses the morph exactly. Reads are batched into a single rAF and state is
 * only committed when the index actually changes — no wasted renders, 60fps.
 */
export function MethodScrolly({ stages }: { stages: MethodStage[] }) {
  const [active, setActive] = useState(0);
  const blockRefs = useRef<Array<HTMLLIElement | null>>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    let raf = 0;

    const compute = () => {
      raf = 0;
      const mid = window.innerHeight / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < stages.length; i++) {
        const el = blockRefs.current[i];
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const center = rect.top + rect.height / 2;
        const dist = Math.abs(center - mid);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      setActive((prev) => (prev === best ? prev : best));
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [stages.length]);

  const running = stages[active] ?? stages[0];

  return (
    <div className="ms-scrolly">
      {/*
        LEFT — the pinned stage marker. Hidden from assistive tech on purpose:
        it is a live restatement of the block that is already announced as the
        current step, so exposing it would only repeat the same words.
      */}
      <div className="ms-rail" aria-hidden="true">
        <div className="ms-stage-mark">
          <span className="ms-stage-tick" />
          <div className="ms-stage-slot">
            <AnimatePresence mode="wait" initial={false}>
              {running ? (
                <motion.div
                  key={running.no}
                  className="ms-stage-inner"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, y: -14 }}
                  /*
                    `mode="wait"` runs these one after the other, so the pair has
                    to stay short: the marker is a readout of the instrument, and
                    a long turnover would leave it reading the previous stage
                    while the field had already regrouped. Exit is quicker than
                    entry — the old stage gets out of the way, the new one lands.
                  */
                  transition={{
                    duration: reduced ? 0.001 : 0.2,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                >
                  <span className="ms-stage-no">{running.no}</span>
                  <span className="ms-stage-name">{running.rail}</span>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/*
        CENTRE — the instrument, pinned and centred, inside its own dark
        observation chamber. `ms-chamber` is what re-inks every mark in the
        figure for the dark field; the figure itself is untouched.
      */}
      <div className="ms-visual">
        <div className="ms-chamber">
          <MethodMorph active={active} />
        </div>
      </div>

      {/* RIGHT — the five stage explanations, and nothing else. */}
      <ol className="ms-steps">
        {stages.map((stage, i) => (
          <li
            key={stage.no}
            ref={(el) => {
              blockRefs.current[i] = el;
            }}
            className="ms-block"
            data-active={active === i}
            aria-current={active === i ? "step" : undefined}
          >
            {/*
              No stage number or label here: the marker in the left column
              states which stage is running, and repeating it would print the
              same words twice on one screen. The block is explanation only —
              a rule, a heading, a paragraph.
            */}
            <div className="ms-block-inner">
              <span className="ms-block-rule" aria-hidden="true" />
              <h3 className="h3 ms-heading">{stage.heading}</h3>
              <p className="body-copy ms-body">{stage.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

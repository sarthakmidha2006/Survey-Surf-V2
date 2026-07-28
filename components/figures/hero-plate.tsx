"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import type { CSSProperties } from "react";

import { PenMark } from "@/components/ui/pen-mark";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { heroPhoto } from "@/lib/content";

/**
 * FIG. A — the evidence wall. The redesigned hero visual (Design Sprint 01B).
 *
 * A duotoned photograph of the market's own words at scale — a wall of
 * thousands of verbatim notes — brought fully into the editorial world by an
 * ink-on-ivory duotone (the FT / Bloomberg treatment that dissolves any
 * "stock" read). The editor's pen is laid over the photograph: two verbatims
 * are pulled and pinned, a measured sample is called out in the margin, and a
 * single red thread gathers the signals down into the one perception the
 * market holds but never said out loud (the verdict).
 *
 * Photograph and annotation are one composition, not a photo beside text: the
 * pins, thread, caliper and verdict all live *on* the image and bleed into the
 * page. The photograph carries texture; the annotations carry meaning (real
 * text — the SVG marks are aria-hidden apparatus).
 */

/** Smooth a set of percentage control points into an SVG path (0–100 space). */
function threadPath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  let d = `M${points[0]!.x} ${points[0]!.y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1]!;
    const cur = points[i]!;
    const my = (prev.y + cur.y) / 2;
    d += ` Q ${prev.x} ${my}, ${cur.x} ${cur.y}`;
  }
  return d;
}

export function HeroPlate() {
  const reduced = useReducedMotion();
  const p = heroPhoto;
  const path = threadPath(p.thread);
  // Node dots sit at the thread's origin (first pin) and its resolution (verdict).
  const nodes = [p.thread[0]!, p.thread[p.thread.length - 1]!];

  return (
    <>
      <span className="exhibit-overline">{p.overline}</span>

      <div className="hero-plate">
        <div className="fig-head">
          <span>
            <strong>{p.figLabel}</strong> · {p.figTitle}
          </span>
          <span>{p.figRight}</span>
        </div>

        <div className="hpl-frame">
          {/* The photograph, duotoned to ink-on-ivory and bled into the page. */}
          <div className="hpl-photo">
            <Image
              src={p.image.src}
              alt={p.image.alt}
              fill
              sizes="(max-width: 1120px) 92vw, 46vw"
              priority
            />
          </div>

          {/* Margin caliper — the rigor of the sample, measured off the plate. */}
          <div className="hpl-caliper" aria-hidden="true">
            <span className="hpl-caliper-label">{p.measure}</span>
          </div>

          {/* The red thread — scattered signals resolving into one pattern. */}
          <svg
            className="hpl-thread"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {path ? (
              <motion.path
                d={path}
                vectorEffect="non-scaling-stroke"
                initial={{ pathLength: reduced ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={
                  reduced
                    ? { duration: 0 }
                    : { duration: 1.8, delay: 0.5, ease: [0.4, 0, 0.3, 1] }
                }
              />
            ) : null}
          </svg>

          {/* Thread nodes — where the pattern begins and where it resolves.
              Rendered as pixel-sized markers (not SVG circles, which the
              non-square viewBox would stretch into ellipses). */}
          {nodes.map((n, i) => (
            <motion.span
              key={i}
              className="hpl-node"
              style={{ left: `${n.x}%`, top: `${n.y}%` }}
              aria-hidden="true"
              // x/y stay in the motion transform so framer's `scale` doesn't
              // drop the -50% centering onto the thread endpoint.
              initial={{
                opacity: reduced ? 1 : 0,
                scale: reduced ? 1 : 0.4,
                x: "-50%",
                y: "-50%",
              }}
              whileInView={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
              viewport={{ once: true }}
              transition={{
                duration: 0.3,
                delay: reduced ? 0 : 0.9 + i * 1.2,
              }}
            />
          ))}

          {/* Pinned verbatims — two raw signals lifted off the wall. */}
          {p.pins.map((pin, i) => (
            <figure
              key={i}
              className="hpl-pin"
              style={
                {
                  left: `${pin.at.x}%`,
                  top: `${pin.at.y}%`,
                  "--rot": `${pin.rotate}deg`,
                } as CSSProperties
              }
            >
              <div className="hpl-pin-meta">
                <span className="hpl-pin-src">{pin.source}</span>
                <span>{pin.code}</span>
              </div>
              <p className="hpl-pin-quote">
                <PenMark variant={pin.mark}>{pin.quote}</PenMark>
              </p>
            </figure>
          ))}

          {/* The verdict — the one perception the signals converge into. */}
          <div className="hpl-verdict">
            <div className="hpl-verdict-label">
              <span>{p.verdict.label}</span>
              <span className="hpl-conf">{p.verdict.confidence}</span>
            </div>
            <p className="hpl-verdict-quote">
              {p.verdict.lead}
              {p.verdict.em ? (
                <>
                  {" "}
                  <em>{p.verdict.em}</em>
                </>
              ) : null}
            </p>
            <p className="hpl-verdict-sub">{p.verdict.sub}</p>
          </div>

          {/* Duotone filter — maps luminance onto the ink → ivory ramp. Warm,
              deep shadows in ink; highlights fall to paper. Scoped by id. */}
          <svg
            className="hpl-defs"
            width="0"
            height="0"
            aria-hidden="true"
            focusable="false"
          >
            <defs>
              <filter id="sb-duotone" colorInterpolationFilters="sRGB">
                <feColorMatrix
                  type="matrix"
                  values="0.2126 0.7152 0.0722 0 0
                          0.2126 0.7152 0.0722 0 0
                          0.2126 0.7152 0.0722 0 0
                          0 0 0 1 0"
                />
                <feComponentTransfer>
                  <feFuncR type="table" tableValues="0.09 0.42 0.97" />
                  <feFuncG type="table" tableValues="0.08 0.39 0.955" />
                  <feFuncB type="table" tableValues="0.065 0.31 0.925" />
                </feComponentTransfer>
              </filter>
            </defs>
          </svg>
        </div>

        <figcaption>
          <p className="plate-cap">
            <strong>{p.captionStrong}</strong> — {p.caption}
          </p>
          <span className="plate-cap">{p.captionRight}</span>
        </figcaption>
      </div>
    </>
  );
}

"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";

/* ------------------------------------------------------------------
   FIG. 03 — THE PERCEPTION ENGINE (the morphing field).

   One instrument, five states, driven by the reader's scroll (`active`):
     0 · scattered — raw opinion, no shape
     1 · grid      — every source aligned on one field
     2 · clusters  — repeated emotion pulls into themes
     3 · merge     — themes collapse into a few forces
     4 · converge  — everything resolves to one glowing red point

   Built in SVG. Every mark animates with transform + opacity only, so the
   whole field composites on the GPU and holds 60fps. Colour lives in CSS
   classes (design tokens), never hardcoded here; animated brand-colour
   transitions are done by cross-fading token-styled layers, not tweening hex.
   ------------------------------------------------------------------ */

const W = 640;
const H = 690;
const CX = 320;
const CY = 345;

const N = 63; // opinion dots — reads as "many", light enough for 60fps
const K1 = 5; // themes (state 2)
const BASE_R = 3.2;

/** Deterministic PRNG (mulberry32) — stable across SSR + client, so the field
 *  never mismatches on hydration and the "chaos" is intentional, not random. */
function makeRng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Pt {
  x: number;
  y: number;
  s: number;
  o: number;
}
interface Dot {
  id: number;
  delay: number;
  states: [Pt, Pt, Pt, Pt, Pt];
}
interface Centroid {
  id: number;
  states: { x: number; y: number; o: number }[];
}

/** The five theme centres (state 2), a loose pentagon around the core. */
const CLUSTERS: [number, number][] = [
  [320, 160],
  [496, 288],
  [429, 495],
  [211, 495],
  [144, 288],
];

/** The three forces (state 3). Each theme merges into its nearest force. */
const GROUPS: [number, number][] = [
  [320, 195],
  [185, 460],
  [455, 460],
];
const CLUSTER_TO_GROUP = [0, 2, 2, 1, 1]; // theme index → force index

function build(): { dots: Dot[]; centroids: Centroid[] } {
  const rng = makeRng(0x5eed01);
  const dots: Dot[] = [];

  // Grid geometry — 7 × 9, centred in the field.
  const cols = 7;
  const gridW = 470;
  const gridH = 540;
  const startX = CX - gridW / 2;
  const startY = CY - gridH / 2;
  const stepX = gridW / (cols - 1);
  const stepY = gridH / (Math.ceil(N / cols) - 1);

  for (let i = 0; i < N; i++) {
    // 0 · scattered — anywhere in the field
    const sx = 74 + rng() * (W - 148);
    const sy = 74 + rng() * (H - 148);

    // 1 · grid cell
    const col = i % cols;
    const row = Math.floor(i / cols);
    const gx = startX + col * stepX;
    const gy = startY + row * stepY;

    // 2 · theme cluster (balanced assignment) with soft gaussian jitter
    const cluster = Math.floor((i * K1) / N);
    const [ccx, ccy] = CLUSTERS[cluster]!;
    const j2 = (rng() + rng() + rng() - 1.5) * 46;
    const j2b = (rng() + rng() + rng() - 1.5) * 46;
    const cx2 = ccx + j2;
    const cy2 = ccy + j2b;

    // 3 · merged into the nearest force, tighter
    const [gcx, gcy] = GROUPS[CLUSTER_TO_GROUP[cluster]!]!;
    const j3 = (rng() + rng() + rng() - 1.5) * 34;
    const j3b = (rng() + rng() + rng() - 1.5) * 34;
    const mx = gcx + j3;
    const my = gcy + j3b;

    // 4 · piled onto the single point, dissolving into the glow
    const ang = rng() * Math.PI * 2;
    const rad = rng() * 22;
    const vx = CX + Math.cos(ang) * rad;
    const vy = CY + Math.sin(ang) * rad;

    dots.push({
      id: i,
      delay: rng() * 0.14,
      states: [
        { x: sx, y: sy, s: 0.72 + rng() * 0.4, o: 0.5 + rng() * 0.34 },
        { x: gx, y: gy, s: 0.95, o: 0.84 },
        { x: cx2, y: cy2, s: 0.82 + rng() * 0.2, o: 0.82 },
        { x: mx, y: my, s: 0.82 + rng() * 0.2, o: 0.85 },
        { x: vx, y: vy, s: 0.5, o: 0.08 },
      ],
    });
  }

  // Five centroid markers: sit on the theme centres (state 2), glide onto the
  // three force centres (state 3) — two pairs coincide, so it reads as three.
  const centroids: Centroid[] = CLUSTERS.map((c, j) => {
    const g = GROUPS[CLUSTER_TO_GROUP[j]!]!;
    return {
      id: j,
      states: [
        { x: c[0], y: c[1], o: 0 },
        { x: c[0], y: c[1], o: 0 },
        { x: c[0], y: c[1], o: 0.9 },
        { x: g[0], y: g[1], o: 0.9 },
        { x: CX, y: CY, o: 0 },
      ],
    };
  });

  return { dots, centroids };
}

/** Radius / opacity timelines for the singleton apparatus marks (per state).
 *  The ink aperture is the visualization's outer framing ring: its opacity is
 *  lifted (vs. its former near-invisible 0.14/0.24) so the warm-grey stroke set
 *  in CSS reads as a clear-but-understated frame. Radii and timing are unchanged. */
const APERTURE_INK = { r: [305, 305, 235, 150, 66], o: [0, 0, 0.8, 0.95, 0] };
const APERTURE_RED = { r: [66, 66, 60, 46, 30], o: [0, 0, 0, 0, 0.85] };
const GLOW = { r: [10, 10, 12, 22, 54], o: [0, 0, 0, 0.08, 0.5] };
const CORE = { r: [0, 0, 1, 2.5, 7.5], o: [0, 0, 0, 0.35, 1] };

const EASE = [0.22, 0.61, 0.36, 1] as const;

/** The live readout printed to the right of the instrument's header. */
const READOUT = ["unsorted", "aligned", "5 themes", "3 forces", "1 perception"];

export function MethodMorph({ active }: { active: number }) {
  const reduced = useReducedMotion();
  const { dots, centroids } = useMemo(build, []);

  const dur = reduced ? 0.001 : 0.85;
  const st = Math.max(0, Math.min(4, active));

  return (
    <figure className="ms-figure" aria-hidden="true">
      <div className="ms-fighead">
        <span className="ms-fighead-l">SB · Perception Engine</span>
        <span className="ms-fighead-r">
          <span className="ms-live-dot" />
          <span className="ms-readout">
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={st}
                initial={reduced ? false : { opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                transition={{ duration: reduced ? 0 : 0.28 }}
              >
                {READOUT[st]}
              </motion.span>
            </AnimatePresence>
          </span>
        </span>
      </div>

      <svg
        className="ms-svg"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        role="presentation"
      >
        <defs>
          <filter
            id="ms-glow-blur"
            x="-80%"
            y="-80%"
            width="260%"
            height="260%"
          >
            <feGaussianBlur stdDeviation="14" />
          </filter>
        </defs>

        {/* Aperture — the field closing onto one point (ink, then red). */}
        <motion.circle
          className="ms-aperture-ink"
          cx={CX}
          cy={CY}
          initial={{ r: APERTURE_INK.r[0], opacity: APERTURE_INK.o[0] }}
          animate={{ r: APERTURE_INK.r[st], opacity: APERTURE_INK.o[st] }}
          transition={{ duration: dur, ease: EASE }}
        />
        <motion.circle
          className="ms-aperture-red"
          cx={CX}
          cy={CY}
          initial={{ r: APERTURE_RED.r[0], opacity: APERTURE_RED.o[0] }}
          animate={{ r: APERTURE_RED.r[st], opacity: APERTURE_RED.o[st] }}
          transition={{ duration: dur, ease: EASE }}
        />

        {/* Opinion dots. */}
        <g>
          {dots.map((d) => {
            const p = d.states[st]!;
            const first = d.states[0];
            return (
              <motion.circle
                key={d.id}
                className="ms-dot"
                r={BASE_R}
                initial={{
                  x: first.x,
                  y: first.y,
                  scale: first.s,
                  opacity: first.o,
                }}
                animate={{ x: p.x, y: p.y, scale: p.s, opacity: p.o }}
                transition={{
                  duration: dur,
                  ease: EASE,
                  delay: reduced ? 0 : d.delay,
                }}
              />
            );
          })}
        </g>

        {/* Theme / force centroids. */}
        <g>
          {centroids.map((c) => {
            const p = c.states[st]!;
            const f = c.states[0]!;
            return (
              <motion.circle
                key={c.id}
                className="ms-centroid"
                r={17}
                initial={{ x: f.x, y: f.y, opacity: f.o }}
                animate={{ x: p.x, y: p.y, opacity: p.o }}
                transition={{ duration: dur, ease: EASE }}
              />
            );
          })}
        </g>

        {/* The single perception — glow, core, and a live pulse when it lands. */}
        <motion.circle
          className="ms-glow"
          cx={CX}
          cy={CY}
          filter="url(#ms-glow-blur)"
          initial={{ r: GLOW.r[0], opacity: GLOW.o[0] }}
          animate={{ r: GLOW.r[st], opacity: GLOW.o[st] }}
          transition={{ duration: dur, ease: EASE }}
        />
        {!reduced && (
          <motion.circle
            className="ms-pulse"
            cx={CX}
            cy={CY}
            initial={{ r: 8, opacity: 0 }}
            animate={
              st === 4
                ? { r: [8, 26], opacity: [0.5, 0] }
                : { r: 8, opacity: 0 }
            }
            transition={
              st === 4
                ? { duration: 2.4, ease: "easeOut", repeat: Infinity }
                : { duration: 0.3 }
            }
          />
        )}
        <motion.circle
          className="ms-core"
          cx={CX}
          cy={CY}
          initial={{ r: CORE.r[0], opacity: CORE.o[0] }}
          animate={{ r: CORE.r[st], opacity: CORE.o[st] }}
          transition={{ duration: dur, ease: EASE }}
        />
      </svg>
    </figure>
  );
}

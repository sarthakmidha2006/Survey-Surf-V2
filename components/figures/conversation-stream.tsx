"use client";

import { motion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";

import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { useReveal } from "@/hooks/use-reveal";
import { conversationStream } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * FIG. A — THE CONVERSATION STREAM (the cover exhibit).
 *
 * One live installation that carries the whole proposition, left to right:
 *
 *   thousands of scattered opinions
 *     → converge into one focal point
 *       → compress into a single illuminated output beam
 *         → which generates the Market Verdict report.
 *
 * Sibero does not invent the insight; it discovers the one the market
 * already holds, and hands it over as a finished deliverable.
 *
 * The read is calm and strictly hierarchical. A dozen-odd headline opinions sit
 * sharp and near the viewer; behind them a far deeper murmur of conversation
 * sits small, dim and blurred. Everything the eye can follow moves in one
 * direction, and nothing competes with the beam or the report.
 *
 * FOUR LAYERS (z-ordered by CSS, not by DOM order):
 *   1. .cs-canvas — the intake: curved tributary lines from every readable chip
 *                   (plus a whisper from a sampled few of the murmur) and the
 *                   slow particle field gliding along them. BEHIND the chips, so
 *                   the pills occlude it and the field reads as having depth.
 *   2. .cs-chips  — real customer phrases, HTML. The foreground drifts under
 *                   Framer Motion; the far murmur drifts on plain CSS keyframes,
 *                   which keeps ~45 extra elements off the animation main thread.
 *   3. .cs-beam   — the confluence and the ONE straight output beam. ABOVE the
 *                   chips, so no pill can ever take a dark bite out of the
 *                   brightest thing in the composition.
 *   4. .cs-card   — the report. Fixed. Generated, once, when the beam lands.
 *
 * GEOMETRY IS MEASURED, NOT ASSUMED. The beam needs real horizontal room, and
 * that room comes out of the chip field, whose width therefore depends on how
 * wide the card actually renders. So the stage and the card are measured, and the
 * confluence, the beam, the readable field's bound and even how many readable
 * chips fit are all derived from that measurement (see `planStage`). Nothing here
 * is hand-tuned against an assumed viewport, and the composition degrades
 * gracefully instead of breaking when the column gets narrow.
 *
 * Motion collapses to one settled frame under prefers-reduced-motion.
 */

const { phrases, murmur, perception } = conversationStream;

/* Depth planes — real depth, not noise. Two foreground planes carry the
   composition and stay sharp; two murmur planes sit further back, smaller,
   softly blurred and held at 22–32% so they read as distant conversation
   rather than active UI. */
const DEPTHS = [
  { op: 0.22, blur: 3.2, scale: 0.7, fg: false }, // 0 — the far murmur
  { op: 0.32, blur: 1.9, scale: 0.8, fg: false }, // 1 — the near murmur
  { op: 0.8, blur: 0.4, scale: 0.97, fg: true }, // 2 — foreground, mid
  { op: 0.96, blur: 0, scale: 1.06, fg: true }, // 3 — foreground, near (sharpest)
] as const;

/** Deterministic PRNG (sin hash) — SSR-safe, no Math.random at render. */
function rand(seed: number) {
  const t = Math.sin(seed * 12.9898) * 43758.5453;
  return t - Math.floor(t);
}

const clamp = (lo: number, v: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Tier = "desktop" | "tablet" | "mobile";

type Chip = {
  text: string;
  /** base position, fraction of the stage (0–1) */
  fx: number;
  fy: number;
  depth: number; // index into DEPTHS
  rot: number; // static tilt, deg
  /** drift, in px, applied by Framer Motion (foreground) or CSS (murmur) */
  dx: number;
  dy: number;
  dur: number;
  delay: number;
  pulse: boolean; // occasionally breathes to near-full opacity
  spin: number; // gentle ±rotation added on top of rot (deg), 0 = none
};

/* The vertical extent both fields occupy, and the left edge they start from. */
const FIELD_Y = { y0: 0.07, y1: 0.93 };
const BG_FIELD_Y = { y0: 0.01, y1: 0.99 };
const FIELD_X0 = 0.02;
const BG_FIELD_X0 = 0;

/* Readable pills sitting in this band of the height — the narrow corridor every
   tributary and the beam pass through — are held a little further left still, so
   the focal point and the throat always have clear air around them. */
const MOUTH_BAND = 0.09;
const MOUTH_KEEP_OUT = 0.05;

/** Below this stage width there is no room for both a chip field and a beam. */
const BEAM_MIN_STAGE = 520;
/** Air between the readable field's right edge and the focal point, px. */
const FIELD_CLEAR = 20;

/** The rendered chip font per tier, so the width estimate below tracks reality. */
const CHIP_PX = { desktop: 11.5, tablet: 11.5, mobile: 9.5 } as const;

/**
 * Estimated rendered footprint of a pill, in px. Calibrated against Libre
 * Franklin 450 at 11.5px (≈0.548em per character) plus the pill's own padding and
 * border. It has to track the real font size, because the field bound is enforced
 * against this number: under-estimate it and a phrase gets clipped by the report.
 */
const chipWidth = (text: string, scale: number, fontPx: number) =>
  (text.length * fontPx * 0.548 + 24) * scale;

type Plan = {
  /** measured stage size, px */
  w: number;
  h: number;
  /** the card's left edge, as a fraction of the stage width */
  edge: number;
  /** the focal point — where every tributary lands, fraction of the stage */
  focus: number;
  focusY: number;
  /** true when the stage is wide enough to carry a real output beam */
  beam: boolean;
  /** readable field: right bound (fraction), how many chips, in how many columns */
  fgX1: number;
  fg: number;
  fgCols: number;
  /** the murmur: how many, in how many columns, and how far right it may reach */
  bg: number;
  bgCols: number;
  bgX1: number;
  /** the rendered chip font size, so width estimates match what the DOM does */
  chipPx: number;
};

/** The beam's length in px — long enough to read as a run of fibre, never a gap.
 *  Every px here is taken from the chip field, which is why `planStage` re-shapes
 *  the field around it rather than the other way round. */
const beamLength = (w: number) => clamp(68, w * 0.125, 116);

/**
 * Derive the whole composition from the measured stage and card. This is the one
 * place the geometry is decided: how long the beam is, where the tributaries
 * converge, how much width is therefore left for readable chips — and, from
 * that, how many of them fit and in how many columns. A narrow column loses
 * chips rather than clipping them or crowding the beam.
 */
function planStage(w: number, h: number, edgePx: number, focusYPx: number, tier: Tier): Plan {
  const beam = w >= BEAM_MIN_STAGE;
  // with no room for a beam the focus sits right against the card, as it used to
  const beamPx = beam ? beamLength(w) : 6;
  const focusPx = edgePx - beamPx;
  const fieldRightPx = focusPx - (beam ? FIELD_CLEAR : 12);
  const fieldPx = fieldRightPx - FIELD_X0 * w;

  const shape =
    fieldPx >= 300
      ? { fg: 15, fgCols: 3 }
      : fieldPx >= 232
        ? { fg: 14, fgCols: 2 }
        : fieldPx >= 168
          ? { fg: 11, fgCols: 2 }
          : fieldPx >= 112
            ? { fg: 8, fgCols: 1 }
            : { fg: 5, fgCols: 1 };

  // The murmur is not bound by the beam — it is allowed to tuck a little way
  // under the card, which is what sells the depth. Its count tracks the stage's
  // area so the far field stays the same density at any size.
  const bg = Math.round(clamp(14, (w * h) / 10000, 48));

  return {
    w,
    h,
    edge: edgePx / w,
    focus: focusPx / w,
    focusY: focusYPx / h,
    beam,
    fgX1: fieldRightPx / w,
    ...shape,
    bg,
    bgCols: Math.round(clamp(4, w / 88, 9)),
    bgX1: Math.min(0.66, edgePx / w + 0.055),
    chipPx: CHIP_PX[tier],
  };
}

/**
 * Build a deterministic chip field: an even, gently jittered grid of readable
 * foreground chips, plus a second, much finer jittered grid for the murmur, then
 * a few separation passes. Foreground pills are held generously apart; murmur
 * pills only separate from each other, and only just enough to stay legible as
 * separate objects. Both grids are jittered rather than random, so the far field
 * reads as an even wash of conversation instead of clumps with holes between
 * them. Fully seeded → identical every render, so canvas origins match the DOM.
 */
function buildChips(plan: Plan): Chip[] {
  const { fg, fgCols, bg, bgCols, fgX1, bgX1, chipPx, w: W, h: H } = plan;
  const FIELD = { x0: FIELD_X0, x1: fgX1, ...FIELD_Y };
  const BG_FIELD = { x0: BG_FIELD_X0, x1: bgX1, ...BG_FIELD_Y };

  const chips: Chip[] = [];
  const hx: number[] = []; // half-width of each pill, as a fraction of W
  const hy: number[] = []; // half-height, as a fraction of H

  /* Choose WHICH headline opinions to show by whether they FIT, and how many by
     how many fit. The field's width is whatever is left once the report and the
     beam have taken theirs, and a phrase wider than that field cannot be placed
     without overhanging the report — which, since the report is opaque and sits
     above the chips, means a customer opinion rendered cut off mid-word.
     So the invariant is hard: a pill is laid out only if its estimated width fits
     the budget. Content order is preserved among those that do.
     On the narrowest phones (≤375px, where the report alone takes most of a 327px
     stage) NOTHING fits, and the honest answer is to show no readable pills at all
     rather than clipped ones — the murmur still feeds the tributaries, so the
     light still converges and the story still reads. Never widen this back to an
     unfiltered fallback: that is precisely the bug it replaced. */
  const budget = (FIELD.x1 - FIELD.x0) * W * 0.98;
  const nearScale = DEPTHS[3]?.scale ?? 1;
  const pool = phrases.filter((p) => chipWidth(p, nearScale, chipPx) <= budget);
  const fgN = Math.min(fg, pool.length);

  // ---- foreground: an even, gently jittered grid — sharp, readable, spaced ----
  const fgRows = Math.max(1, Math.ceil(fgN / fgCols));
  const cellW = (FIELD.x1 - FIELD.x0) / fgCols;
  const cellH = (FIELD.y1 - FIELD.y0) / fgRows;
  for (let i = 0; i < fgN; i++) {
    const col = i % fgCols;
    const row = Math.floor(i / fgCols);
    const s = i * 1.618 + 0.31;

    // small centred brick offset keeps the grid balanced but never mechanical
    const brick = (row % 2) * 0.5 - 0.25;
    const jx = (rand(s * 1.7) - 0.5) * cellW * 0.34;
    const jy = (rand(s * 2.3) - 0.5) * cellH * 0.34;
    const fx = FIELD.x0 + (col + 0.5 + brick) * cellW + jx;
    const fy = FIELD.y0 + (row + 0.5) * cellH + jy;

    // two readable planes: a sharp near plane and a softer mid plane
    const depth = rand(s * 3.9) < 0.42 ? 3 : 2;
    const scale = DEPTHS[depth]?.scale ?? 1;

    // a few chips wear a whisper of tilt; fewer breathe a gentle spin
    const tilted = rand(s * 4.4) < 0.32;
    const rot = tilted ? (rand(s * 5.1) - 0.5) * 3 : 0; // ±1.5°
    const spin = !tilted && rand(s * 6.7) < 0.22 ? (rand(s * 7.3) < 0.5 ? 1 : -1) : 0;

    const text = pool[i % pool.length] ?? "";
    const wpx = chipWidth(text, scale, chipPx);
    const hpx = 25 * scale;

    chips.push({
      text,
      fx,
      fy,
      depth,
      rot,
      dx: (rand(s * 8.1) - 0.5) * 13, // slow, small drift, px
      dy: (rand(s * 9.5) - 0.5) * 11,
      dur: 24 + rand(s * 10.2) * 18, // 24–42s, all different → no shared loop
      delay: rand(s * 11.9) * -22, // negative → begin mid-cycle
      pulse: rand(s * 13.1) < 0.18,
      spin,
    });
    hx.push(wpx / 2 / W);
    hy.push(hpx / 2 / H);
  }

  // ---- the murmur: distant, softly blurred conversation (depths 0–1) ----
  // A far finer jittered grid than the foreground's, with the jitter carried
  // nearly to the cell edge — even coverage, but no trace of a grid in the read.
  const bgRows = Math.ceil(bg / bgCols);
  const bgCellW = (BG_FIELD.x1 - BG_FIELD.x0) / bgCols;
  const bgCellH = (BG_FIELD.y1 - BG_FIELD.y0) / bgRows;
  for (let i = 0; i < bg; i++) {
    const gi = fgN + i;
    const s = gi * 2.117 + 5.71;
    const col = i % bgCols;
    const row = Math.floor(i / bgCols);
    const brick = (row % 2) * 0.5 - 0.25;
    const fx =
      BG_FIELD.x0 + (col + 0.5 + brick) * bgCellW + (rand(s * 1.29) - 0.5) * bgCellW * 0.8;
    const fy = BG_FIELD.y0 + (row + 0.5) * bgCellH + (rand(s * 2.87) - 0.5) * bgCellH * 0.8;
    const rot = (rand(s * 5.1) - 0.5) * 3.4;

    // most of the murmur sits on the farthest plane; the rest a step nearer,
    // so the far field itself has depth instead of being one flat wash
    const depth = rand(s * 4.7) < 0.62 ? 0 : 1;
    const scale = DEPTHS[depth]?.scale ?? 0.7;

    const text = murmur[i % murmur.length] ?? "";
    const wpx = chipWidth(text, scale, chipPx);
    const hpx = 25 * scale;

    chips.push({
      text,
      fx,
      fy,
      depth,
      rot,
      dx: (rand(s * 8.1) - 0.5) * 8, // barely-there drift
      dy: (rand(s * 9.5) - 0.5) * 7,
      dur: 46 + rand(s * 10.2) * 26, // 46–72s — the slowest, calmest layer
      delay: rand(s * 11.9) * -46,
      pulse: false,
      spin: 0,
    });
    hx.push(wpx / 2 / W);
    hy.push(hpx / 2 / H);
  }

  // relaxation — near/far pairs are left alone (that overlap reads as depth),
  // and negative space is allowed to become part of the composition.
  const fgGx = 24 / W;
  const fgGy = 16 / H;
  const bgGx = 7 / W;
  const bgGy = 5 / H;
  for (let iter = 0; iter < 22; iter++) {
    for (let i = 0; i < chips.length; i++) {
      const a = chips[i];
      const hxi = hx[i];
      const hyi = hy[i];
      if (!a || hxi === undefined || hyi === undefined) continue;
      for (let j = i + 1; j < chips.length; j++) {
        const b = chips[j];
        const hxj = hx[j];
        const hyj = hy[j];
        if (!b || hxj === undefined || hyj === undefined) continue;
        const bothFg = a.depth >= 2 && b.depth >= 2;
        const bothBg = a.depth <= 1 && b.depth <= 1;
        if (!bothFg && !bothBg) continue; // depth: let near sit over far
        const gx = bothFg ? fgGx : bgGx;
        const gy = bothFg ? fgGy : bgGy;
        const dx = a.fx - b.fx;
        const dy = a.fy - b.fy;
        const minx = hxi + hxj + gx;
        const miny = hyi + hyj + gy;
        const adx = Math.abs(dx);
        const ady = Math.abs(dy);
        if (adx < minx && ady < miny) {
          const ox = minx - adx;
          const oy = miny - ady;
          if (ox < oy) {
            const dir = dx === 0 ? (rand(i * 7.1 + j) < 0.5 ? -1 : 1) : Math.sign(dx);
            a.fx += (dir * ox) / 2;
            b.fx -= (dir * ox) / 2;
          } else {
            const dir = dy === 0 ? (rand(i * 3.3 + j) < 0.5 ? -1 : 1) : Math.sign(dy);
            a.fy += (dir * oy) / 2;
            b.fy -= (dir * oy) / 2;
          }
        }
      }
    }
    // Clamp the pill's EDGES into its field, not its centre — a readable phrase
    // that overhangs the field would sit on the beam or be clipped by the card,
    // and a cut-off word reads as a bug rather than as depth.
    for (let i = 0; i < chips.length; i++) {
      const c = chips[i];
      const hxi = hx[i] ?? 0;
      const hyi = hy[i] ?? 0;
      if (!c) continue;
      const fgPlane = DEPTHS[c.depth]?.fg;
      const box = fgPlane ? FIELD : BG_FIELD;
      const inBand = Math.max(0, 1 - Math.abs(c.fy - plan.focusY) / MOUTH_BAND);
      const lo = box.x0 + hxi;
      const hi = box.x1 - (fgPlane ? MOUTH_KEEP_OUT * inBand : 0) - hxi;
      // Written so the LEFT bound wins when a pill is wider than the space it is
      // allowed: overhanging right only costs the focal point a little air, while
      // overhanging left would put a pill through the stage edge into the gutter.
      c.fx = Math.max(lo, Math.min(hi, c.fx));
      c.fy = Math.min(box.y1 - hyi, Math.max(box.y0 + hyi, c.fy));
    }
  }
  return chips;
}

function useTier(): Tier {
  const [tier, setTier] = useState<Tier>("desktop");
  useEffect(() => {
    const mq = (q: string) => window.matchMedia(q);
    const mobile = mq("(max-width: 680px)");
    const tablet = mq("(max-width: 979px)");
    const read = () => setTier(mobile.matches ? "mobile" : tablet.matches ? "tablet" : "desktop");
    read();
    mobile.addEventListener("change", read);
    tablet.addEventListener("change", read);
    return () => {
      mobile.removeEventListener("change", read);
      tablet.removeEventListener("change", read);
    };
  }, []);
  return tier;
}

/**
 * Measure the stage and the card, and derive the plan. Values are quantized
 * before they reach state — a 4px stage bucket and a 0.4% position bucket — so
 * dragging a window edge does not re-run the O(n²) relaxation on every frame,
 * while any change that would actually be visible still lands.
 */
function useStagePlan(stageRef: React.RefObject<HTMLDivElement | null>, tier: Tier) {
  const [plan, setPlan] = useState<Plan | null>(null);

  const measure = useCallback(() => {
    const stage = stageRef.current;
    const card = stage?.querySelector<HTMLElement>(".cs-card");
    if (!stage || !card) return;
    const sr = stage.getBoundingClientRect();
    const cr = card.getBoundingClientRect();
    if (sr.width < 2 || sr.height < 2) return;

    const q = (v: number, step: number) => Math.round(v / step) * step;
    const w = q(sr.width, 4);
    const h = q(sr.height, 4);
    const edgePx = q(cr.left - sr.left, 4);
    const focusYPx = q(cr.top - sr.top + cr.height / 2, 4);
    const next = planStage(w, h, edgePx, focusYPx, tier);

    setPlan((prev) =>
      prev &&
      prev.w === next.w &&
      prev.h === next.h &&
      prev.edge === next.edge &&
      prev.focusY === next.focusY &&
      prev.chipPx === next.chipPx
        ? prev
        : next,
    );
  }, [stageRef, tier]);

  useEffect(() => {
    const stage = stageRef.current;
    const card = stage?.querySelector<HTMLElement>(".cs-card");
    if (!stage || !card) return;
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(card);
    measure();
    // the report's height moves once the display face lands — re-measure then,
    // so the focal point and the beam sit on the card's real centre line
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      ro.disconnect();
    };
  }, [measure, stageRef]);

  return plan;
}

export function ConversationStream() {
  const reduced = useReducedMotion();
  const tier = useTier();
  const stageRef = useRef<HTMLDivElement>(null);
  const { ref: figureRef, inView } = useReveal<HTMLElement>();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const plan = useStagePlan(stageRef, tier);
  const chips = useMemo(() => (plan ? buildChips(plan) : []), [plan]);

  /* The report is generated once, when the beam lands — the canvas ramps the
     beam up from the same signal, and the card's stages are delayed behind it
     in CSS. See `--cs-gen-*` in sections.css for the running order. */
  const generated = mounted && inView;

  return (
    <figure
      ref={figureRef}
      className="cs"
      aria-label="Thousands of scattered customer opinions converging into one illuminated data stream that generates the market verdict report"
    >
      <figcaption className="cs-caption">
        FIG. A · The conversation stream — thousands of scattered opinions converge,
        compress into a single output beam, and generate the market verdict.
      </figcaption>

      <div className="cs-stage" ref={stageRef}>
        {/* Layers 1 & 3 — the intake (behind the chips) and the output beam
            (above them). One rAF loop drives both. */}
        {plan ? (
          <StreamCanvases
            chips={chips}
            plan={plan}
            tier={tier}
            reduced={reduced}
            active={generated}
          />
        ) : null}

        {/* Layer 2 — the drifting opinion chips. The murmur is painted first and
            animates on CSS keyframes; only the readable foreground costs a
            Framer Motion node. */}
        {mounted && plan ? (
          <div className="cs-chips" aria-hidden="true">
            {chips.map((c, i) =>
              DEPTHS[c.depth]?.fg ? (
                <ChipEl key={i} chip={c} reduced={reduced} />
              ) : (
                <MurmurEl key={i} chip={c} />
              ),
            )}
          </div>
        ) : null}

        {/* Layer 4 — the report. Always in the DOM (it is what the geometry is
            measured from, and it must survive without JavaScript); revealed
            section by section once the beam reaches it. */}
        <VerdictReport generated={generated} />
      </div>
    </figure>
  );
}

/* ---------------------------------------------------------------- report */

/**
 * The deliverable — the first page of a confidential intelligence report, not a
 * UI component. Everything that would read as software has been removed: no
 * tiles, no grid, no panels within panels. What carries the page is what carries
 * a printed report — a stacked uppercase masthead, one standfirst sentence, four
 * readings each set as a small label over a large figure, two titled sections,
 * the call, and horizontal rules with a great deal of air between them.
 *
 * Its type scale is driven by CONTAINER queries, not the viewport, so the
 * masthead / figure / body / label ratios hold at every width the report can
 * render at — see `--cs-title` and friends in sections.css.
 *
 * `is-gen` runs the generation once the beam makes contact: the border strikes,
 * a bloom spreads from the entry point, the masthead lights, the standfirst
 * follows, the readings populate one at a time, and the verdict lands last. Every
 * stage is a CSS transition with its own `--gd` delay, so the sequence costs no
 * JavaScript once it starts.
 */
function VerdictReport({ generated }: { generated: boolean }) {
  const { title, standfirst, readings, insight, action, verdict } = perception;

  // the running order, in seconds. The beam makes contact at ~0.55s.
  const T_HEAD = 0.6;
  const T_STANDFIRST = 0.92;
  const T_READINGS = 1.18;
  const T_INSIGHT = 1.74;
  const T_ACTION = 1.9;
  const T_VERDICT = 2.12;

  const at = (s: number) => ({ "--gd": `${s}s` }) as CSSProperties;

  return (
    <aside
      className={cn("cs-card", generated && "is-gen")}
      aria-label="Market verdict — the report"
    >
      {/* where the beam terminates: a bloom on the entry line that flares once */}
      <span className="cs-card-intake" aria-hidden="true" />

      {/* the masthead. One word to a line, so it reads as a document title
          rather than a row of interface text. */}
      <header className="cs-head cs-g" style={at(T_HEAD)}>
        <span className="cs-mark" aria-hidden="true" />
        <p className="cs-masthead">
          {title.split(" ").map((word, i) => (
            <span className="cs-masthead-line" key={word}>
              {/* the words are block-level so this space never renders, but it
                  keeps the text content readable as "Market Verdict" rather than
                  "MarketVerdict" for assistive tech and text extraction */}
              {i > 0 ? " " : null}
              {word}
            </span>
          ))}
        </p>
      </header>

      <p className="cs-standfirst cs-g" style={at(T_STANDFIRST)}>
        {standfirst}
      </p>

      <div className="cs-rule cs-gr" style={at(T_READINGS - 0.1)} aria-hidden="true" />

      {/* the readings: label over figure, separated by rules and air — never
          tiled, never boxed */}
      <dl className="cs-metrics">
        {readings.map((r, i) => (
          <div
            className="cs-metric cs-g"
            key={r.label}
            style={at(T_READINGS + i * 0.11)}
            data-qual={r.qualitative ? "" : undefined}
          >
            <dt className="cs-metric-cap">{r.label}</dt>
            <dd className="cs-metric-val">
              {r.value}
              {r.unit ? <span className="cs-metric-unit">{r.unit}</span> : null}
            </dd>
          </div>
        ))}
      </dl>

      <div className="cs-rule cs-gr" style={at(T_INSIGHT - 0.12)} aria-hidden="true" />

      {/* the insight carries the report — set in the display face, brightest of
          all the prose, because it is the sentence the analysis exists to say */}
      <section className="cs-sec cs-sec--insight cs-g" style={at(T_INSIGHT)}>
        <h3 className="cs-sec-cap">{insight.label}</h3>
        <p className="cs-sec-body">{insight.body}</p>
      </section>

      <section className="cs-sec cs-g" style={at(T_ACTION)}>
        <h3 className="cs-sec-cap">{action.label}</h3>
        <p className="cs-sec-body">{action.body}</p>
      </section>

      {/* the call, between two rules — the end of the document */}
      <div className="cs-rule cs-gr" style={at(T_VERDICT - 0.12)} aria-hidden="true" />
      <section className="cs-verdict cs-g" style={at(T_VERDICT)}>
        <h3 className="cs-verdict-cap">{verdict.label}</h3>
        <p className="cs-verdict-val">{verdict.value}</p>
      </section>
      <div className="cs-rule cs-gr" style={at(T_VERDICT + 0.16)} aria-hidden="true" />
    </aside>
  );
}

/* ------------------------------------------------------------------ chip */

/**
 * The far murmur. No Framer Motion node: position, depth and drift are handed
 * to CSS as custom properties and the sway runs on a shared keyframe, so forty
 * of these cost the animation main thread nothing. `translate: -50% -50%` on the
 * element composes independently of the keyframe's `transform`, so the two never
 * fight each other.
 */
function MurmurEl({ chip }: { chip: Chip }) {
  const d = DEPTHS[chip.depth] ?? DEPTHS[0];
  const style = {
    left: `${chip.fx * 100}%`,
    top: `${chip.fy * 100}%`,
    "--op": d.op,
    "--blur": `${d.blur}px`,
    "--sc": d.scale,
    "--rot": `${chip.rot}deg`,
    "--dx": `${chip.dx}px`,
    "--dy": `${chip.dy}px`,
    "--dur": `${chip.dur}s`,
    "--delay": `${chip.delay}s`,
  } as CSSProperties;

  return (
    <div className="cs-chip cs-chip--murmur" style={style} data-depth={chip.depth}>
      <span className="cs-chip-in">{chip.text}</span>
    </div>
  );
}

function ChipEl({ chip, reduced }: { chip: Chip; reduced: boolean }) {
  const d = DEPTHS[chip.depth] ?? DEPTHS[2];
  const style = {
    left: `${chip.fx * 100}%`,
    top: `${chip.fy * 100}%`,
    "--op": d.op,
    "--blur": `${d.blur}px`,
  } as CSSProperties;

  // Static, finished frame under reduced motion.
  if (reduced) {
    return (
      <div className="cs-chip" style={style} data-depth={chip.depth}>
        <span
          className="cs-chip-in"
          style={{ transform: `scale(${d.scale}) rotate(${chip.rot}deg)`, opacity: d.op }}
        >
          {chip.text}
        </span>
      </div>
    );
  }

  const rotFrom = chip.rot;
  const rotTo = chip.rot + chip.spin;

  return (
    <motion.div
      className="cs-chip"
      style={style}
      data-depth={chip.depth}
      initial={false}
      // one long, smooth there-and-back sway — a slow drift, never a wander
      animate={{ x: [0, chip.dx, 0], y: [0, chip.dy, 0] }}
      transition={{
        duration: chip.dur,
        repeat: Infinity,
        ease: "easeInOut",
        delay: chip.delay,
      }}
    >
      <motion.span
        className="cs-chip-in"
        initial={false}
        animate={{
          scale: d.scale,
          rotate: chip.spin ? [rotFrom, rotTo, rotFrom] : rotFrom,
          opacity: chip.pulse ? [d.op, Math.min(1, d.op + 0.12), d.op] : d.op,
        }}
        transition={{
          duration: chip.dur * 0.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: chip.delay,
        }}
      >
        {chip.text}
      </motion.span>
    </motion.div>
  );
}

/* --------------------------------------------------------------- canvas */

type Particle = {
  line: number; // which tributary it rides
  t: number; // position along the curve, 0→1
  spd: number; // base speed
  sz: number; // base size
  dim: number; // 1 on a foreground tributary, well under 1 in the murmur
};

/** A mote of light travelling inside the output beam. */
type Fibre = {
  t: number; // 0 at the focal point, 1 at the card
  spd: number;
  off: number; // perpendicular offset from the beam's axis, px
  sz: number;
};

type Curve = {
  // cubic bezier control points, in px
  p0x: number;
  p0y: number;
  p1x: number;
  p1y: number;
  p2x: number;
  p2y: number;
  p3x: number;
  p3y: number;
};

function bez(a: number, b: number, c: number, d: number, t: number) {
  const mt = 1 - t;
  return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d;
}

/* The output beam is built from concentric strokes, widest and faintest first, so
   it reads as optical fibre: a broad orange haze outside, warming through amber,
   to a warm-white core. Enough steps that the falloff is smooth — at five layers
   the eye reads distinct stripes, which looks like stacked rules rather than
   light. The alphas are deliberately high: on a near-black field under `lighter`,
   anything below about 0.05 does not register at all, and a beam that does not
   register is the one thing this composition cannot afford. */
const BEAM_STEPS = 15;
const BEAM_LAYERS = Array.from({ length: BEAM_STEPS }, (_, i) => {
  const u = i / (BEAM_STEPS - 1); // 0 = outermost haze, 1 = the core
  return {
    w: 40 * Math.pow(1 - u, 2.1) + 2,
    a: 0.05 + Math.pow(u, 2.6) * 0.95,
    c: `255,${Math.round(136 + u * 117)},${Math.round(78 + u * 170)}`,
  };
});

/** Discrete packets of light running the length of the fibre. */
const PULSES = 3;

function StreamCanvases({
  chips,
  plan,
  tier,
  reduced,
  active,
}: {
  chips: Chip[];
  plan: Plan;
  tier: Tier;
  reduced: boolean;
  active: boolean;
}) {
  const backRef = useRef<HTMLCanvasElement>(null);
  const beamRef = useRef<HTMLCanvasElement>(null);
  // read inside the loop so toggling it never restarts the animation
  const activeRef = useRef(active);
  activeRef.current = active;

  /* The clock, the beam's establish ramp and the two particle fields live OUTSIDE
     the effect, in refs. The effect is keyed on the measured plan, and the plan
     changes for reasons that have nothing to do with the animation: every 4px
     bucket of a window drag, a tier flip across 979px, and — on every cold load —
     the `document.fonts.ready` re-measure that shifts the report's height. If the
     ramp restarted with the effect, the beam would sit at ~0 for the whole of a
     drag and would desync from the report's generation sequence on first paint.
     Geometry is re-derived on a replan; the animation's state survives it. */
  const timeRef = useRef(0);
  const rampRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const fibresRef = useRef<Fibre[]>([]);

  useEffect(() => {
    const back = backRef.current;
    const beamCanvas = beamRef.current;
    if (!back || !beamCanvas) return;
    const ctx = back.getContext("2d", { alpha: true });
    const bctx = beamCanvas.getContext("2d", { alpha: true });
    if (!ctx || !bctx) return;

    const w = plan.w;
    const h = plan.h;
    const focusX = plan.focus * w;
    const focusY = plan.focusY * h;
    const edgeX = plan.edge * w;
    // a hair past the card's edge: the card is opaque and painted above the beam
    // layer, so overlapping guarantees there is never a seam of black between them
    const beamEndX = edgeX + 4;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* ---- intake: the tributaries ---- */
    const curves: Curve[] = [];
    const lineLayer = document.createElement("canvas");
    const lctx = lineLayer.getContext("2d");

    // Every readable chip feeds a bright tributary; a sampled few of the murmur
    // feed a much fainter one, so the field reads as thousands converging rather
    // than a dozen. Sources must sit left of the focal point, or their curve
    // would have to double back on itself to reach it.
    const fgSrcs = chips.filter((c) => DEPTHS[c.depth]?.fg);
    const bgAll = chips.filter((c) => !DEPTHS[c.depth]?.fg && c.fx < plan.focus - 0.03);
    const bgWanted = tier === "desktop" ? 14 : tier === "tablet" ? 10 : 6;
    const step = Math.max(1, Math.floor(bgAll.length / bgWanted));
    const bgSrcs = bgAll.filter((_, i) => i % step === 0).slice(0, bgWanted);
    const srcs = [...fgSrcs, ...bgSrcs];
    const fgCount = fgSrcs.length;

    const particles = particlesRef.current;
    const perLineFg = tier === "desktop" ? 34 : tier === "tablet" ? 26 : 16;
    const perLineBg = tier === "desktop" ? 13 : tier === "tablet" ? 10 : 7;

    const buildCurves = () => {
      curves.length = 0;
      for (const c of srcs) {
        const p0x = c.fx * w;
        const p0y = c.fy * h;
        const dx = focusX - p0x;
        // leave the chip travelling horizontally, then flatten into the focal
        // point along its axis, so the tributaries merge like rivers and the
        // last stretch is already compressed into the beam's line
        const p1x = p0x + dx * 0.42;
        const p1y = p0y;
        const p2x = focusX - Math.max(52, dx * 0.16);
        const p2y = focusY + (p0y - focusY) * 0.08;
        curves.push({ p0x, p0y, p1x, p1y, p2x, p2y, p3x: focusX, p3y: focusY });
      }
    };

    // A rebuild re-derives which curve each mote rides, but carries its position
    // ALONG that curve over by index. Re-seeding from rand() would snap the whole
    // field back to its frame-one layout on every replan, which reads as the
    // stream freezing each time the window moves 4px.
    const buildParticles = () => {
      const prev = particles.slice();
      particles.length = 0;
      for (let li = 0; li < curves.length; li++) {
        const fg = li < fgCount;
        const depth = srcs[li]?.depth ?? 2;
        const n = fg ? Math.round(perLineFg * (depth === 3 ? 1 : 0.8)) : perLineBg;
        for (let k = 0; k < n; k++) {
          const s = li * 3.7 + k * 0.913 + 0.17;
          particles.push({
            line: li,
            t: prev[particles.length]?.t ?? rand(s), // keep phase across replans
            spd: fg
              ? 0.00072 + rand(s * 2.1) * 0.00082
              : 0.00048 + rand(s * 2.1) * 0.00056, // the murmur drifts slower still
            sz: fg ? 0.62 + rand(s * 3.3) * 1.16 : 0.44 + rand(s * 3.3) * 0.6,
            dim: fg ? 1 : 0.4,
          });
        }
      }
    };

    const renderLines = () => {
      if (!lctx) return;
      lineLayer.width = Math.max(1, Math.round(w * dpr));
      lineLayer.height = Math.max(1, Math.round(h * dpr));
      lctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      lctx.clearRect(0, 0, w, h);
      lctx.globalCompositeOperation = "lighter";
      lctx.lineCap = "round";

      const SEG = 26;
      for (let li = 0; li < curves.length; li++) {
        const cv = curves[li];
        if (!cv) continue;
        const fg = li < fgCount;
        const depth = srcs[li]?.depth ?? 2;
        // near chips read a touch brighter; the murmur is barely a suggestion
        const base = fg ? 0.055 + (depth - 2) * 0.02 : 0.016;
        let px = cv.p0x;
        let py = cv.p0y;
        for (let i = 1; i <= SEG; i++) {
          const t = i / SEG;
          const x = bez(cv.p0x, cv.p1x, cv.p2x, cv.p3x, t);
          const y = bez(cv.p0y, cv.p1y, cv.p2y, cv.p3y, t);
          // visible where it leaves the chip, brightening toward the confluence
          const a = base * (0.5 + t * t * 2.3);
          const g = Math.round(246 - t * 26);
          const b = Math.round(232 - t * 54);
          lctx.strokeStyle = `rgba(255,${g},${b},${a})`;
          lctx.lineWidth = fg ? 0.55 + t * 0.5 : 0.4 + t * 0.28;
          lctx.beginPath();
          lctx.moveTo(px, py);
          lctx.lineTo(x, y);
          lctx.stroke();
          px = x;
          py = y;
        }
      }
      lctx.globalCompositeOperation = "source-over";
    };

    const drawParticle = (p: Particle) => {
      const cv = curves[p.line];
      if (!cv) return;
      const t = p.t;
      const x = bez(cv.p0x, cv.p1x, cv.p2x, cv.p3x, t);
      const y = bez(cv.p0y, cv.p1y, cv.p2y, cv.p3y, t);
      // fade in off the chip, burn brightest as it reaches the focal point
      const rampIn = Math.min(1, t / 0.12);
      const bright = 0.16 + t * t * 0.78;
      const alpha = Math.min(1, bright) * rampIn * p.dim;
      const g = Math.round(248 - t * 30);
      const b = Math.round(236 - t * 60);
      const size = p.sz * (0.7 + t * 0.9);
      ctx.fillStyle = `rgba(255,${g},${b},${alpha})`;
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    };

    /* ---- output: the beam ---- */
    const fibres = fibresRef.current;
    const buildFibres = () => {
      const prev = fibres.slice();
      fibres.length = 0;
      if (!plan.beam) return;
      const n = tier === "desktop" ? 30 : 22;
      for (let i = 0; i < n; i++) {
        const s = i * 1.377 + 0.61;
        fibres.push({
          t: prev[i]?.t ?? rand(s),
          spd: 0.0042 + rand(s * 2.3) * 0.0052,
          off: (rand(s * 3.1) - 0.5) * 4.4, // stays inside the core's width
          sz: 0.5 + rand(s * 4.7) * 1.2,
        });
      }
    };

    /* The confluence — where every tributary lands and the fan is squeezed into
       the fibre. A wide warm halo for presence, a small near-white core for the
       event itself, and a horizontal lens that reads as the throat. */
    const drawFocus = (pulse: number, ramp: number) => {
      const R = Math.max(w, h);
      const r1 = R * (0.125 + pulse * 0.01);
      const g1 = bctx.createRadialGradient(focusX, focusY, 0, focusX, focusY, r1);
      g1.addColorStop(0, `rgba(255,246,232,${0.26 + pulse * 0.07})`);
      g1.addColorStop(0.2, "rgba(255,230,200,0.13)");
      g1.addColorStop(0.52, "rgba(196,86,58,0.055)"); // muted red, barely there
      g1.addColorStop(1, "rgba(196,86,58,0)");
      bctx.fillStyle = g1;
      bctx.beginPath();
      bctx.arc(focusX, focusY, r1, 0, Math.PI * 2);
      bctx.fill();

      // tighter and hotter than the halo: the fan being pinched to a point, not a
      // blob of light. Keeping it small is what lets the beam read as the
      // brightest CONTINUOUS thing rather than a bloom with a wire attached.
      const r2 = R * (0.026 + pulse * 0.004);
      const g2 = bctx.createRadialGradient(focusX, focusY, 0, focusX, focusY, r2);
      g2.addColorStop(0, `rgba(255,253,248,${0.82 + pulse * 0.18})`);
      g2.addColorStop(0.34, "rgba(255,240,220,0.3)");
      g2.addColorStop(1, "rgba(255,226,196,0)");
      bctx.fillStyle = g2;
      bctx.beginPath();
      bctx.arc(focusX, focusY, r2, 0, Math.PI * 2);
      bctx.fill();

      // the throat: a flattened flare along the beam's axis, so the compression
      // from a wide fan into one line is legible rather than implied
      if (!plan.beam || ramp <= 0) return;
      const rl = 30;
      bctx.save();
      bctx.translate(focusX, focusY);
      bctx.scale(1, 0.3);
      const g3 = bctx.createRadialGradient(0, 0, 0, 0, 0, rl);
      g3.addColorStop(0, `rgba(255,255,252,${0.5 * ramp})`);
      g3.addColorStop(0.4, `rgba(255,242,218,${0.17 * ramp})`);
      g3.addColorStop(1, "rgba(255,226,196,0)");
      bctx.fillStyle = g3;
      bctx.beginPath();
      bctx.arc(0, 0, rl, 0, Math.PI * 2);
      bctx.fill();
      bctx.restore();
    };

    /**
     * ONE straight, illuminated output line from the focal point into the report.
     * Deliberately not another curved particle path: the intake is organic, the
     * output is engineered. Concentric strokes give it a warm-white core inside
     * an orange glow; discrete pulses and a field of motes travel its length.
     */
    const drawBeam = (ramp: number, time: number) => {
      if (!plan.beam || ramp <= 0) return;
      const len = beamEndX - focusX;
      if (len <= 1) return;
      // two superposed sines so the shimmer never reads as a loop
      const shimmer = reduced
        ? 1
        : 0.87 + Math.sin(time * 0.045) * 0.08 + Math.sin(time * 0.017 + 1.7) * 0.05;

      bctx.lineCap = "round";
      for (const L of BEAM_LAYERS) {
        const a = L.a * ramp * shimmer;
        const g = bctx.createLinearGradient(focusX, focusY, beamEndX, focusY);
        g.addColorStop(0, `rgba(${L.c},0)`);
        g.addColorStop(0.12, `rgba(${L.c},${a})`);
        g.addColorStop(0.84, `rgba(${L.c},${a})`);
        g.addColorStop(1, `rgba(${L.c},${a * 0.88})`);
        bctx.strokeStyle = g;
        // the beam widens as it establishes, so switching on reads as a focus
        bctx.lineWidth = L.w * (0.5 + ramp * 0.5);
        bctx.beginPath();
        bctx.moveTo(focusX, focusY);
        bctx.lineTo(beamEndX, focusY);
        bctx.stroke();
      }

      // travelling packets — each a bright spindle sliding toward the report
      const half = Math.min(30, len * 0.32);
      for (let i = 0; i < PULSES; i++) {
        const pt = reduced ? (i + 0.5) / PULSES : (time * 0.0042 + i / PULSES) % 1;
        const px = focusX + pt * len;
        const rise = Math.sin(Math.min(1, Math.max(0, pt)) * Math.PI);
        const a = 0.62 * ramp * (0.35 + 0.65 * rise);
        const g = bctx.createLinearGradient(px - half, focusY, px + half, focusY);
        g.addColorStop(0, "rgba(255,236,206,0)");
        g.addColorStop(0.5, `rgba(255,252,244,${a})`);
        g.addColorStop(1, "rgba(255,236,206,0)");
        bctx.strokeStyle = g;
        bctx.lineWidth = 3;
        bctx.beginPath();
        bctx.moveTo(px - half, focusY);
        bctx.lineTo(px + half, focusY);
        bctx.stroke();

        const rg = bctx.createRadialGradient(px, focusY, 0, px, focusY, 13);
        rg.addColorStop(0, `rgba(255,248,232,${0.3 * ramp * rise})`);
        rg.addColorStop(1, "rgba(255,196,140,0)");
        bctx.fillStyle = rg;
        bctx.beginPath();
        bctx.arc(px, focusY, 13, 0, Math.PI * 2);
        bctx.fill();
      }

      // the information itself: motes flowing inside the fibre
      for (const f of fibres) {
        const x = focusX + f.t * len;
        const y = focusY + f.off * (0.4 + 0.6 * Math.sin(f.t * Math.PI));
        const a = ramp * (0.4 + 0.5 * Math.sin(f.t * Math.PI));
        const size = f.sz * (0.85 + 0.3 * Math.sin(f.t * Math.PI));
        bctx.fillStyle = `rgba(255,252,244,${a})`;
        bctx.fillRect(x - size / 2, y - size / 2, size, size);
      }

      // the intake flare where the beam is received at the card's edge
      const fg = bctx.createRadialGradient(edgeX, focusY, 0, edgeX, focusY, 34 * ramp);
      fg.addColorStop(0, `rgba(255,246,226,${0.34 * ramp})`);
      fg.addColorStop(0.45, `rgba(255,190,136,${0.11 * ramp})`);
      fg.addColorStop(1, "rgba(255,170,110,0)");
      bctx.fillStyle = fg;
      bctx.beginPath();
      bctx.arc(edgeX, focusY, 34 * ramp, 0, Math.PI * 2);
      bctx.fill();
    };

    /* ---- the loop ---- */
    // The beam establishes over ~0.7s once the figure is in view; the report's
    // stages are delayed behind it in CSS. Under reduced motion it is fully
    // established from the first frame — set here rather than only on the
    // preference flipping, so the one settled frame `setup()` paints below can
    // never inherit a partial ramp from an earlier non-reduced run.
    if (reduced) rampRef.current = 1;

    const drawFrame = () => {
      const time = timeRef.current;
      // -- intake layer (behind the chips) --
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      if (lctx) {
        ctx.globalAlpha = reduced ? 1 : 0.84 + Math.sin(time * 0.008) * 0.12;
        ctx.drawImage(lineLayer, 0, 0, w, h);
        ctx.globalAlpha = 1;
      }
      if (!reduced) {
        timeRef.current = time + 1;
        if (activeRef.current) rampRef.current = Math.min(1, rampRef.current + 1 / 42);
        for (const p of particles) {
          const ramp = 0.92 + p.t * 0.26;
          p.t += p.spd * ramp;
          if (p.t >= 1) p.t -= 1 + rand(p.line * 1.3 + p.t) * 0.04;
        }
        for (const f of fibres) {
          f.t += f.spd;
          if (f.t >= 1) f.t -= 1;
        }
      }
      for (const p of particles) drawParticle(p);
      ctx.globalCompositeOperation = "source-over";

      // -- output layer (above the chips) --
      const rt = rampRef.current;
      const ramp = rt * rt * (3 - 2 * rt); // smoothstep
      bctx.clearRect(0, 0, w, h);
      bctx.globalCompositeOperation = "lighter";
      const pulse = reduced ? 0.5 : 0.5 + Math.sin(time * 0.011) * 0.5;
      drawFocus(pulse, ramp);
      drawBeam(ramp, time);
      bctx.globalCompositeOperation = "source-over";
    };

    const sizeCanvas = (c: HTMLCanvasElement, c2d: CanvasRenderingContext2D) => {
      c.width = Math.max(1, Math.round(w * dpr));
      c.height = Math.max(1, Math.round(h * dpr));
      c2d.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const setup = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeCanvas(back, ctx);
      sizeCanvas(beamCanvas, bctx);
      buildCurves();
      renderLines();
      buildParticles();
      buildFibres();
      drawFrame(); // paint at least one settled frame immediately
    };

    let raf = 0;
    const loop = () => {
      drawFrame();
      raf = requestAnimationFrame(loop);
    };

    setup();
    if (!reduced) raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
    // `active` is read through a ref: flipping it must not restart the loop, or
    // the beam would jump back to zero and the fields would re-seed.
  }, [chips, plan, tier, reduced]);

  return (
    <>
      <canvas ref={backRef} className="cs-canvas" aria-hidden="true" />
      <canvas ref={beamRef} className="cs-beam" aria-hidden="true" />
    </>
  );
}

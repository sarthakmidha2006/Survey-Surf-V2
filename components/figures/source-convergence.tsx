import type { CSSProperties } from "react";

import { Reveal } from "@/components/ui/reveal";
import { sources } from "@/lib/content";

/**
 * FIG. — THE LISTENING MAP.
 *
 * The chapter's whole argument, drawn once and unlabelled: a dense fan of
 * signal flowing in from everywhere the market speaks, resolving into one
 * defensible reading (the single red node).
 *
 * Nothing here is named. The channels are printed exactly once on this page, in
 * the quiet index below the map, and the categories are legible from that list
 * — captions inside the drawing only turned it back into documentation. The
 * field carries more lines than there are sources on purpose: it reads as
 * *volume of signal*, not as a one-line-per-item chart. Illustrative geometry,
 * so the SVG is decorative to a screen reader and the figure leans on its
 * caption.
 */

// Layout grid (unitless viewBox px). A full-height fan on the left; every line
// eases to the single perception node on the right.
const VB_W = 480;
const VB_H = 330;
const LEFT = 16; // where a signal enters the frame
const GATE_X = 158; // where the straight run bends toward the node
const C1X = 252; // bezier handles — a long, calm inward ease
const C2X = 276;
const NODE_X = 344;
const NODE_Y = 165;
const TOP = 12;
const BOTTOM = 318;
const LINES = 22; // the field's density — signal volume, not a source count

/** A point on one line's curve, so the motes sit exactly on the flow. */
function pointOn(t: number, y0: number) {
  const u = 1 - t;
  const b0 = u * u * u;
  const b1 = 3 * u * u * t;
  const b2 = 3 * u * t * t;
  const b3 = t * t * t;
  return {
    x: +(b0 * GATE_X + b1 * C1X + b2 * C2X + b3 * NODE_X).toFixed(1),
    y: +((b0 + b1) * y0 + (b2 + b3) * NODE_Y).toFixed(1),
  };
}

export function SourceConvergence() {
  const rows = Array.from(
    { length: LINES },
    (_, i) => +(TOP + (i * (BOTTOM - TOP)) / (LINES - 1)).toFixed(1),
  );

  // Signals caught in transit. The positions are scattered by a small prime
  // stride rather than laid on shared arcs — otherwise the motes line up into
  // drawn rings, which reads mechanical. Deterministic, so SSR and client agree.
  const motes = rows.flatMap((y0, i) => {
    const t = 0.5 + (((i * 7) % 11) / 10) * 0.34; // 0.50 → 0.84, the approach
    const pts = [{ ...pointOn(t, y0), tier: t > 0.74 ? "near" : "mid" }];
    if (i % 2 === 0) {
      const t2 = 0.24 + (((i * 5) % 7) / 7) * 0.2; // still out in the field
      pts.push({ ...pointOn(t2, y0), tier: "far" });
    }
    return pts;
  });

  return (
    <Reveal className="listen-map" as="figure">
      <div className="listen-head">
        <span className="app">SB · Always listening</span>
        <span className="app listen-head-r">
          {sources.length} channels → 1 reading
        </span>
      </div>

      <svg
        className="listen-svg"
        viewBox={`0 0 ${VB_W} ${VB_H}`}
        role="presentation"
        aria-hidden="true"
      >
        {/* the field — thin ink hairlines, the signal drawn inward */}
        <g className="listen-lines">
          {rows.map((y0, i) => (
            <path
              key={`line-${i}`}
              className={i % 5 === 0 ? "is-lead" : undefined}
              d={`M ${LEFT} ${y0} H ${GATE_X} C ${C1X} ${y0} ${C2X} ${NODE_Y} ${NODE_X} ${NODE_Y}`}
              style={{ "--i": i } as CSSProperties}
            />
          ))}
        </g>

        {/* where each signal enters the frame */}
        <g className="listen-origins">
          {rows.map((y0, i) => (
            <circle key={`dot-${i}`} cx={LEFT} cy={y0} r={1.5} />
          ))}
        </g>

        {/* signals in transit, funnelling into the reading */}
        <g className="listen-motes">
          {motes.map((m, i) => (
            <circle
              key={`mote-${i}`}
              className={`is-${m.tier}`}
              cx={m.x}
              cy={m.y}
              r={m.tier === "near" ? 1.7 : m.tier === "far" ? 1.1 : 1.4}
            />
          ))}
        </g>

        {/* the one reading — the single red perception node, the focal point */}
        <g className="listen-node">
          <circle className="listen-node-halo" cx={NODE_X} cy={NODE_Y} r={26} />
          {/* knocks the incoming lines out of the node's own space, so the
              focal point reads clean against the field */}
          <circle
            className="listen-node-knock"
            cx={NODE_X}
            cy={NODE_Y}
            r={10}
          />
          <circle className="listen-node-ring" cx={NODE_X} cy={NODE_Y} r={13} />
          <circle
            className="listen-node-core"
            cx={NODE_X}
            cy={NODE_Y}
            r={6.5}
          />
          <text className="listen-node-label" x={NODE_X + 24} y={NODE_Y - 2}>
            ONE READING
          </text>
          <text className="listen-node-sub" x={NODE_X + 24} y={NODE_Y + 11}>
            n = 1,240
          </text>
        </g>
      </svg>

      <figcaption className="listen-cap plate-cap">
        <strong>THE LISTENING MAP</strong> — every channel, pulled to one
        defensible reading.
      </figcaption>
    </Reveal>
  );
}

"use client";

import type { CSSProperties } from "react";

import { useReveal } from "@/hooks/use-reveal";
import { gap } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * The perception exhibit — one composition, not a chart with a caption under it.
 *
 * Seven bands share ONE three-column grid (word · measurement track · word):
 * the column headings, five attributes, and the finding. The finding is not a
 * summary filed under the figure — it is the figure's LAST ROW, drawn in the
 * same language as the five above it and sitting on the same axis, just heavier
 * and set at conclusion scale. Read across, that row is a sentence: what was
 * measured · how much · across what.
 *
 * On the left, the word the company uses for itself; on the right, the word the
 * market actually lands on. The span between them, struck in the editor's red,
 * IS the gap, and it is scaled to DOMINATE the track (see `GAP_SCALE`) — the
 * bars are the exhibit's primary mark, not an accent inside it. What is left
 * either side is a short guide at the threshold of visibility; any more weight
 * and five of them read as five row rules. There is not one horizontal rule in
 * the whole figure.
 *
 * The entrance is choreographed in CSS (gated behind the `.js` class, exactly
 * like the rest of the paper's reveal system): the axis calibrates, the belief
 * words ink in and their guides extend toward centre, the market answers from
 * the right, the red measurements are struck, then the finding row lands.
 * Content is fully visible without JavaScript, and the paper's reduced-motion
 * contract stills it.
 */

/**
 * Track share per point of deviation. Tuned so the run READS as a comparison:
 * at 1.6 the smallest gap (20) takes about a third of the track and the largest
 * (48) three-quarters, so the difference between them is unmissable across the
 * page. Lower values technically encode the same numbers but collapse the bars
 * into a row of similar-looking ticks floating in white space.
 */
const GAP_SCALE = 1.6;
export function GapInstrument() {
  const { ref, inView } = useReveal<HTMLElement>({
    rootMargin: "0px 0px -12% 0px",
  });
  const g = gap.instrument;

  // Visual gap width as a share of the measurement track, from the 0–100
  // deviation. Symmetric about the centre axis, so a smaller reading pulls the
  // two guides in toward the words and a larger one drives them apart.
  const span = (dev: number) => {
    const gapPct = Math.round(dev * GAP_SCALE * 10) / 10;
    return { gapPct, sidePct: (100 - gapPct) / 2 };
  };
  const rows = g.rows.map((r) => ({ ...r, ...span(r.dev) }));
  // the finding is drawn on the same scale, so its bar reads as the mean of
  // the five above it rather than as a differently-sized graphic
  const summary = span(Number(g.indicatorValue));

  return (
    <figure
      ref={ref}
      className={cn("gi", inView && "is-in")}
      aria-label="Perception deviation — a levelling run"
    >
      {/* band 1 — the three column headings, each over the column it names */}
      <div className="gi-labels">
        <span className="gi-label gi-label--l app">{g.leftLabel}</span>
        <span className="gi-label gi-label--axis app">{g.axisLabel}</span>
        <span className="gi-label gi-label--r app">{g.rightLabel}</span>
      </div>

      {/* bands 2–6 — the levelling run, on its calibration axis */}
      <div className="gi-run">
        <span className="gi-axis" aria-hidden="true" />

        {rows.map((r, i) => (
          <div
            className="gi-row"
            key={r.belief}
            style={{ "--i": i } as CSSProperties}
          >
            <span className="gi-belief">{r.belief}</span>

            <div className="gi-track">
              <span
                className="gi-line gi-line--belief"
                aria-hidden="true"
                style={{ width: `${r.sidePct}%` }}
              />
              <span
                className="gi-line gi-line--reality"
                aria-hidden="true"
                style={{ width: `${r.sidePct}%` }}
              />
              <span
                className="gi-measure"
                aria-hidden="true"
                style={{ left: `${r.sidePct}%`, width: `${r.gapPct}%` }}
              />
              {/* the reading, set into the dimension line it measures */}
              <span
                className="gi-dev"
                style={{ left: `${r.sidePct}%`, width: `${r.gapPct}%` }}
              >
                <span className="gi-dev-n">{r.dev}</span>
              </span>
            </div>

            <span className="gi-reality">{r.reality}</span>
          </div>
        ))}
      </div>

      {/* the last row — the finding, in the same language, at conclusion scale:
          the mean struck as a heavier bar with the number set into it. It sits
          outside `.gi-run` so the run's axis can end cleanly at the last datum
          and the finding's own tail can pick it up and carry it to the bar —
          exact at every width, rather than a computed guess at the offset. */}
      <div className="gi-row gi-row--sum">
        <span className="gi-summary-lead app">{g.indicatorLead}</span>

        <div className="gi-track">
          <span className="gi-axis gi-axis--tail" aria-hidden="true" />
          <span
            className="gi-line gi-line--belief"
            aria-hidden="true"
            style={{ width: `${summary.sidePct}%` }}
          />
          <span
            className="gi-line gi-line--reality"
            aria-hidden="true"
            style={{ width: `${summary.sidePct}%` }}
          />
          <span
            className="gi-measure"
            aria-hidden="true"
            style={{ left: `${summary.sidePct}%`, width: `${summary.gapPct}%` }}
          />
          <span
            className="gi-dev"
            style={{ left: `${summary.sidePct}%`, width: `${summary.gapPct}%` }}
          >
            <span className="gi-dev-n gi-summary-val">
              {g.indicatorValue}
              <span className="gi-summary-unit">{g.indicatorUnit}</span>
            </span>
          </span>
        </div>

        <p className="gi-summary-sub">{g.indicatorSub}</p>
      </div>
    </figure>
  );
}

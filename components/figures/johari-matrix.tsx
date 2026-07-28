"use client";

import { useState } from "react";
import type { FocusEvent } from "react";

import { PenMark } from "@/components/ui/pen-mark";
import { Reveal } from "@/components/ui/reveal";
import { johariAxes, johariBlind, johariQuads } from "@/lib/content";
import { cn } from "@/lib/utils";

type Pos = "tl" | "tr" | "bl" | "br";

/**
 * The Blind Spot Matrix — the chapter's hero artifact, and now the only thing
 * on its side of the spread.
 *
 * It is a plate no longer: no figure number, no title line, no revision, no
 * classification caption, no frame. What remains is the instrument itself — two
 * labelled axes and a PERFECT SQUARE plot whose only drawn boundary is the
 * hairline cross between the four rooms. The rooms define the composition; there
 * is deliberately no box around them.
 *
 * Four rooms, each holding only what earns its space: a triage word, a name,
 * one line, one verbatim, and the coordinate that places it. The blind spot
 * (top-right) is the dark case file that argues in three beats and stays lit by
 * default; focusing any room brings it forward and dims the rest.
 *
 * The whole thing is ONE LOCKED COMPOSITION: authored at a fixed intrinsic size
 * and scaled uniformly to fit both the column it sits in and the height of the
 * window (see `.bsm-figure`). Nothing inside ever reflows.
 */
export function BlindSpotMatrix() {
  const [focus, setFocus] = useState<Pos>("tr");
  const [engaged, setEngaged] = useState(false);

  const enter = (pos: Pos) => {
    setFocus(pos);
    setEngaged(true);
  };
  const rest = () => {
    setEngaged(false);
    setFocus("tr");
  };
  const onGridBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) rest();
  };

  return (
    <Reveal as="figure" className="bsm-instrument">
      <div className="bsm-figure">
        <div className="bsm-stage">
          {/* top axis — What you can see */}
          <div className="bsm-axis bsm-axis--x">
            <span className="bsm-axis-cap">
              {johariAxes.xCaption} <span className="bsm-axis-arrow">→</span>
            </span>
            <span className="bsm-dim bsm-dim--x" aria-hidden="true" />
            <span className="bsm-axis-ends">
              <span>{johariAxes.xLeft}</span>
              <span>{johariAxes.xRight}</span>
            </span>
          </div>

          <div className="bsm-lower">
            {/* left axis — What the market sees */}
            <div className="bsm-axis bsm-axis--y">
              <span className="bsm-axis-end">{johariAxes.yTop}</span>
              <span className="bsm-axis-cap">
                {johariAxes.yCaption} <span className="bsm-axis-arrow">↑</span>
              </span>
              <span className="bsm-axis-end">{johariAxes.yBottom}</span>
              <span className="bsm-dim bsm-dim--y" aria-hidden="true" />
            </div>

            {/* the plot — a square, bounded by nothing but its own cross */}
            <div
              className="bsm-grid"
              data-focus={focus}
              data-engaged={engaged}
              onMouseLeave={rest}
              onBlur={onGridBlur}
            >
              {/* three apparatus rooms */}
              {johariQuads.map((q) => (
                <div
                  key={q.id}
                  className={cn(
                    "bsm-room",
                    `bsm-room--${q.pos}`,
                    focus === q.pos && "is-focus",
                  )}
                  data-pos={q.pos}
                  tabIndex={0}
                  aria-label={`${q.name} — ${q.coord}. ${q.body}`}
                  onMouseEnter={() => enter(q.pos)}
                  onFocus={() => enter(q.pos)}
                >
                  <span className={`bsm-chip bsm-chip--${q.swatch}`}>
                    {q.priority}
                  </span>
                  <h4 className="bsm-room-name">
                    {q.name}
                    <span className="bsm-room-tag">{q.tag}</span>
                  </h4>
                  <p className="bsm-room-desc">{q.body}</p>

                  <blockquote className="bsm-room-quote">
                    <span className="bsm-room-quote-txt">“{q.quote.text}”</span>
                    <cite>{q.quote.source}</cite>
                  </blockquote>

                  <span className="bsm-room-coord" aria-hidden="true">
                    {q.coord}
                  </span>
                  <span className="bsm-room-note" aria-hidden="true">
                    {q.note}
                  </span>
                </div>
              ))}

              {/* the blind spot — the dominant dark case file */}
              <div
                className={cn(
                  "bsm-room bsm-room--blind bsm-room--tr",
                  focus === "tr" && "is-focus",
                )}
                data-pos="tr"
                tabIndex={0}
                aria-label={`The Blind Spot — ${johariBlind.coord}. ${johariBlind.dialogue
                  .map((d) => `${d.dt}: ${d.dd}`)
                  .join(" ")}`}
                onMouseEnter={() => enter("tr")}
                onFocus={() => enter("tr")}
              >
                <span className="bsm-chip bsm-chip--blind">
                  {johariBlind.priority}
                </span>
                <h4 className="bsm-room-name bsm-room-name--blind">
                  {johariBlind.name}
                  <PenMark
                    variant="circle"
                    className="bsm-room-tag bsm-room-tag--blind"
                  >
                    {johariBlind.tag}
                  </PenMark>
                </h4>

                <dl className="bsm-dialogue">
                  {johariBlind.dialogue.map((d) => (
                    <div key={d.dt}>
                      <dt>{d.dt}</dt>
                      <dd>{d.dd}</dd>
                    </div>
                  ))}
                </dl>

                <blockquote className="bsm-verbatim">
                  <mark>“{johariBlind.quote.text}”</mark>
                  <cite>{johariBlind.quote.source}</cite>
                </blockquote>

                <div className="bsm-signal">
                  <span className="bsm-signal-label">
                    {johariBlind.confidenceLabel}
                  </span>
                  <span className="bsm-meter" aria-hidden="true">
                    <span
                      className="bsm-meter-fill"
                      style={{ width: `${johariBlind.confidence}%` }}
                    />
                  </span>
                  <span className="bsm-meter-num">
                    {johariBlind.confidence}%
                  </span>
                </div>

                <span
                  className="bsm-room-coord bsm-room-coord--blind"
                  aria-hidden="true"
                >
                  {johariBlind.coord}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

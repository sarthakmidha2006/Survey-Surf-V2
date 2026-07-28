"use client";

import { Fragment } from "react";

import { useDossierGate } from "@/components/dossier-gate";
import { tickerItems, tickerLead } from "@/lib/content";

function TickerRun({ hidden }: { hidden?: boolean }) {
  return (
    <span aria-hidden={hidden ? "true" : undefined}>
      <span className="t-lead">{tickerLead}</span>{" "}
      {tickerItems.map((item, index) => (
        <Fragment key={index}>
          <span className="t-dot">·</span> {item}{" "}
        </Fragment>
      ))}
    </span>
  );
}

/**
 * The flow band — a continuous marquee of signal sources drifting toward
 * Sibero. The one element in the issue that ignores the editorial gutter:
 * it runs edge to edge on a near-black field, a terminal tape that answers the
 * cover rather than the pages around it. Pure CSS animation; the track is
 * duplicated for a seamless loop and collapses to a static wrap under reduced
 * motion.
 *
 * THE TAPE IS PART OF THE FILE'S COVER, SO IT RUNS FROM THE TOP EVERY TIME THE
 * FILE IS OPENED OR FILED AWAY. Keying the track on the gate remounts it on
 * every turn of that state, which restarts the CSS animation at its first frame
 * rather than leaving it wherever the last read had carried it. Opening the
 * dossier a second time should feel like opening a fresh one, and closing it
 * should put the front page back exactly as the reader first met it — a tape
 * caught mid-drift is the one mark that would remember.
 */
export function Ticker() {
  const { open } = useDossierGate();

  return (
    <div className="ticker" aria-label="Sources flowing to Sibero">
      <div className="ticker-clip">
        <div className="ticker-track" key={open ? "open" : "closed"}>
          <TickerRun />
          <TickerRun hidden />
        </div>
      </div>
    </div>
  );
}

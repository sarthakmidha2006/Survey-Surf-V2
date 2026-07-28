import type { ReactNode } from "react";

import { Folio } from "@/components/ui/folio";
import { Marginalia } from "@/components/ui/marginalia";
import { Row } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Rule } from "@/components/ui/rule";
import { Heading, Kicker, Standfirst } from "@/components/ui/typography";
import { cn } from "@/lib/utils";
import type { SectionOpener } from "@/types";

/**
 * The section masthead — one component, two registers:
 *
 *  • `variant="chapter"` (default) — a MAJOR chapter opener: folio, double
 *    rule, kicker, heading and (optional) standfirst. The full editorial
 *    apparatus that announces a new chapter of the issue.
 *
 *  • `variant="quiet"` — an INTERMEDIATE section that should transition rather
 *    than restart. It drops the folio and the chapter rule (the marks that make
 *    every section read like a fresh printed page) and stands on the
 *    kicker-as-caption and a short hairline, leaning on the extra whitespace
 *    above to do the dividing the rule used to. The reading stays continuous;
 *    only major chapters get the full header.
 *
 *  • `variant="feature"` — a chapter that opens on COMPOSITION rather than on
 *    page furniture. No folio, no rule: the headline holds a narrow left column
 *    with its margin note beneath, and the lede runs wide across the right, set
 *    a notch larger than a standfirst. Two columns of unequal weight reading as
 *    one spread — for openers whose headline is short enough that the standard
 *    stacked masthead would leave the right half of the page empty.
 *
 * Pass `exhibit` to give the opener a companion visual: the editorial text
 * sits at reading width on the left and the visual fills the right half, so
 * an otherwise text-only opener becomes a balanced ~50/50 spread.
 *
 * Pass `reverse` with it to turn that spread around — the exhibit takes the
 * left half and the reading matter the right. Use it when the drawing should
 * INTRODUCE the argument rather than illustrate one already made: the reader
 * meets the figure first and reads what they are looking at beside it. It is a
 * DOM swap, not a `direction` trick, so the stacked layout on a narrow screen
 * keeps the same order — figure, then explanation.
 */
export function SectionHeader({
  opener,
  exhibit,
  reverse,
  variant = "chapter",
}: {
  opener: SectionOpener;
  exhibit?: ReactNode;
  reverse?: boolean;
  variant?: "chapter" | "quiet" | "feature";
}) {
  const lead = opener.standfirst;
  const quiet = variant === "quiet";
  const feature = variant === "feature";

  // The chapter chrome — folio + rule — is exactly what makes intermediate
  // sections feel like scanned pages, so the quiet and feature registers omit
  // it entirely (as does any opener whose content carries no folio).
  const chrome =
    quiet || feature || !opener.folio ? null : (
      <>
        <Folio left={opener.folio.left} right={opener.folio.right} />
        <Rule />
      </>
    );

  const lede = (
    <Reveal chapter>
      {quiet ? (
        /* a div, not a p: the Kicker renders its own <p>, which the HTML parser
           would otherwise close this element around, breaking the inline rule */
        <div className="opener-index">
          {opener.kicker ? (
            <Kicker className="opener-kick">{opener.kicker}</Kicker>
          ) : null}
          <span className="opener-tick" aria-hidden="true" />
        </div>
      ) : opener.kicker ? (
        <Kicker>{opener.kicker}</Kicker>
      ) : null}
      <Heading as="h2" parts={opener.heading} />
      {lead ? (
        <Standfirst dropcap={opener.dropcap} colRead>
          {lead}
        </Standfirst>
      ) : null}
    </Reveal>
  );

  // The feature spread — headline left, lede wide on the right. Each column
  // reveals on its own so the headline lands a beat before the reading matter.
  if (feature) {
    return (
      <header className="opener opener--feature">
        <Reveal className="opener-feature-head" chapter>
          {opener.kicker ? <Kicker>{opener.kicker}</Kicker> : null}
          <Heading as="h2" parts={opener.heading} />
          {opener.marginNote ? (
            <Marginalia className="opener-note" reveal={false}>
              {opener.marginNote}
            </Marginalia>
          ) : null}
        </Reveal>
        {lead ? (
          <Reveal className="opener-feature-lede" chapter>
            <Standfirst dropcap={opener.dropcap}>{lead}</Standfirst>
          </Reveal>
        ) : null}
      </header>
    );
  }

  if (exhibit) {
    const reading = (
      <div className="opener-lede">
        {lede}
        {opener.marginNote ? (
          <Marginalia className="opener-note">{opener.marginNote}</Marginalia>
        ) : null}
      </div>
    );
    const figure = <div className="opener-exhibit">{exhibit}</div>;

    return (
      <header className={cn("opener opener--split", quiet && "opener--quiet")}>
        {chrome}
        {/* the grid places the two halves in DOM order, so reversing the spread
            is a swap here and needs no second set of column rules */}
        <div className="opener-split">
          {reverse ? figure : reading}
          {reverse ? reading : figure}
        </div>
      </header>
    );
  }

  return (
    <header className={cn("opener", quiet && "opener--quiet")}>
      {/* Folio + rule span the full content grid so a chapter's dividing line
          aligns to the same right edge as the figures below; the heading and
          its margin note keep the editorial asymmetry inside the row. */}
      {chrome}
      <Row
        margin={
          opener.marginNote ? (
            <Marginalia>{opener.marginNote}</Marginalia>
          ) : undefined
        }
      >
        {lede}
      </Row>
    </header>
  );
}

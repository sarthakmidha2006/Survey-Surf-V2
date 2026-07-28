import { BlindSpotMatrix } from "@/components/figures/johari-matrix";
import { Slip } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { Heading } from "@/components/ui/typography";
import { primaryCta, sectionIds } from "@/lib/constants";
import { blindSpotSpread } from "@/lib/content";

/**
 * The Blind Spot — one spread, held inside one screen.
 *
 * LEFT (≈59%)  the matrix, and nothing else. It is the primary artifact of the
 *              chapter, so it is set large, shifted off the grid into the left
 *              gutter, and given the whole column.
 * RIGHT (≈41%) the reading column: heading, deck, three paragraphs, one link —
 *              sized to stand up to the matrix's mass rather than caption it.
 *
 * There is no chapter apparatus at all: no folio, no page number, no rule, no
 * kicker, no figure number, no classification stamp. Every label the chapter
 * used to carry has been removed, and the hierarchy — a 60/40 split, one large
 * heading, one accent mark — does the work the labels were doing.
 */
export function BlindSpotSection() {
  return (
    <section id={sectionIds.blindspot} className="chapter bs-chapter">
      <Container>
        <div className="bs-spread">
          {/* ── LEFT · the artifact ── */}
          <div className="bs-plot">
            <BlindSpotMatrix />
          </div>

          {/* ── RIGHT · the reading column ── */}
          <Reveal className="bs-read" chapter>
            <span className="bs-read-mark" aria-hidden="true" />
            <Heading as="h2" parts={blindSpotSpread.heading} />
            <p className="bs-read-deck">{blindSpotSpread.deck}</p>
            {blindSpotSpread.body.map((para) => (
              <p key={para.slice(0, 24)} className="bs-read-body">
                {para}
              </p>
            ))}
            <Slip href={primaryCta.href} className="bs-read-cta">
              {blindSpotSpread.cta} <span aria-hidden="true">→</span>
            </Slip>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

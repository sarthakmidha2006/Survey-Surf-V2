import { MethodScrolly } from "@/components/sections/method-scrolly";
import { Reveal } from "@/components/ui/reveal";
import { Chapter } from "@/components/ui/section";
import { Heading, Kicker } from "@/components/ui/typography";
import { sectionIds } from "@/lib/constants";
import { methodIntro, methodOpener, methodStages } from "@/lib/content";

/**
 * Chapter 03 — The Intelligence Engine.
 *
 * Two movements, deliberately separated:
 *
 *  1 · THE INTRODUCTION — a label, the headline, the deck, one paragraph and
 *      the cue that hands the reader to the scroll. No folio, no page number,
 *      no chapter rule: this chapter is a product page rather than a printed
 *      spread, so the type carries the section and nothing decorates it. It is
 *      set left on the same wide plate the experience below uses, so the label,
 *      the headline and the copy all start on the instrument's own left edge.
 *
 *  2 · THE EXPERIENCE — the three-column spread (`MethodScrolly`): the pipeline
 *      rail pinned left, the instrument pinned centre, and the five stage
 *      explanations moving on the right. Nothing but explanation lives there.
 */
export function MethodSection() {
  return (
    <Chapter id={sectionIds.method} className="chapter--engine">
      <Reveal as="header" className="ms-open">
        <Kicker className="ms-open-kick">{methodOpener.kicker}</Kicker>
        <Heading
          as="h2"
          parts={methodOpener.heading}
          className="ms-open-title"
        />
        <p className="ms-open-lead">{methodIntro.lead}</p>
        <p className="ms-open-body">{methodIntro.body}</p>
        <p className="ms-open-cue">{methodIntro.cue}</p>
      </Reveal>

      <MethodScrolly stages={methodStages} />
    </Chapter>
  );
}

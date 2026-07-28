import { Container } from "@/components/ui/container";
import { Folio } from "@/components/ui/folio";
import { PenMark } from "@/components/ui/pen-mark";
import { Reveal } from "@/components/ui/reveal";
import { Rule } from "@/components/ui/rule";
import { transcript } from "@/lib/content";

/** The ink spread — a single verbatim, printed on black. */
export function TranscriptSpread() {
  return (
    <section className="spread-ink" aria-label="From the transcript">
      <Container>
        <Folio left={transcript.folio.left} right={transcript.folio.right} />
        <Rule />
        <Reveal as="blockquote" className="transcript-q">
          {transcript.quoteLead}
          <PenMark variant="underline">{transcript.penText}</PenMark>
          {transcript.quoteTail}
        </Reveal>
        <p className="transcript-att">{transcript.attribution}</p>
      </Container>
    </section>
  );
}

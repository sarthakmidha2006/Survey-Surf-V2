import { PenMark } from "@/components/ui/pen-mark";
import { Reveal } from "@/components/ui/reveal";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { sectionIds } from "@/lib/constants";
import { corrections, philosophyOpener } from "@/lib/content";

/** Chapter 07 — the corrections column: what we are, and what we refuse to be. */
export function PhilosophySection() {
  return (
    <Chapter id={sectionIds.philosophy} className="chapter--flow">
      <SectionHeader opener={philosophyOpener} variant="quiet" />
      <div className="corrections">
        {corrections.map((correction) => (
          <Reveal className="correction" key={correction.assertion}>
            <p className="refusal">
              <PenMark variant="strike">{correction.refusal}</PenMark>
            </p>
            <p className="assertion">{correction.assertion}</p>
          </Reveal>
        ))}
      </div>
    </Chapter>
  );
}

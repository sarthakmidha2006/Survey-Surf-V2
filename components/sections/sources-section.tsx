import type { CSSProperties } from "react";

import { SourceConvergence } from "@/components/figures/source-convergence";
import { InkSequence } from "@/components/ui/reveal";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { sectionIds } from "@/lib/constants";
import { sources, sourcesOpener } from "@/lib/content";

/**
 * Chapter 05 — always listening.
 *
 * Told once, in three beats: the listening map makes the argument (many
 * channels, one reading), the headline and its paragraph beside it say what the
 * reader is looking at, and the index underneath simply names the channels and
 * why each is read. Nothing is explained twice — the map carries no source
 * names and the index draws no convergence.
 *
 * THE MAP OPENS THE SPREAD (`reverse`). The drawing introduces the chapter
 * rather than illustrating a claim already made: the reader meets the ten
 * channels resolving into one reading, and the explanation is beside it.
 */
export function SourcesSection() {
  return (
    <Chapter id={sectionIds.sources} className="chapter--flow chapter--listen">
      <SectionHeader
        opener={sourcesOpener}
        exhibit={<SourceConvergence />}
        variant="quiet"
        reverse
      />
      <InkSequence className="signal-index" as="ul">
        {sources.map((source, i) => (
          <li
            key={source.name}
            className="signal"
            style={{ "--i": i } as CSSProperties}
          >
            <span className="signal-name">{source.name}</span>
            <span className="signal-note">{source.note}</span>
          </li>
        ))}
      </InkSequence>
    </Chapter>
  );
}

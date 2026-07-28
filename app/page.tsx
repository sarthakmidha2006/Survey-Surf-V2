import type { Metadata } from "next";

import { BlindSpotSection } from "@/components/sections/blind-spot-section";
import { CoverLift } from "@/components/sections/cover-lift";
import { DossierFold } from "@/components/sections/dossier-fold";
import {
  DossierClose,
  DossierInvite,
} from "@/components/sections/dossier-invite";
import { DossierSection } from "@/components/sections/dossier-section";
import { GapSection } from "@/components/sections/gap-section";
import { Hero } from "@/components/sections/hero";
import { MethodSection } from "@/components/sections/method-section";
import { MultiplierSection } from "@/components/sections/multiplier-section";
import { PhilosophySection } from "@/components/sections/philosophy-section";
import { SourcesSection } from "@/components/sections/sources-section";
import { StatementSpread } from "@/components/sections/statement-spread";
import { Ticker } from "@/components/sections/ticker";
import { ChapterSeam } from "@/components/ui/chapter-seam";
import { chapterSeams } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({ path: "/" });

/**
 * Issue 01 — read top to bottom, in two halves.
 *
 * THE FRONT PAGE is the whole argument and nothing more: the cover, the gap,
 * the blind spot, the engine, and the turn that lands it. Only the major
 * chapters open with a full chapter header; the seams bridge them so the front
 * reads as one bound issue. It closes on the invitation and the flow band — the
 * tape is the front page's footer, not a divider.
 *
 * THE SECOND HALF — the multiplier, the listening chapter, the deliverable and
 * the closing stance — is bound in below it but folded away (`DossierFold`)
 * until the reader takes the invitation or the masthead's call to action. Same
 * components, same order, same animations: only the fold is new.
 *
 * THE TWO ARE JOINED BY ONE GESTURE. The cover sits on its own stage
 * (`CoverLift`) and the whole report is one layer above it, so the first scroll
 * lifts the cover off the file and Chapter 01 rises out from underneath. It
 * happens once. Past it, `.report` is an ordinary document in ordinary flow.
 */
export default function HomePage() {
  return (
    <>
      <CoverLift>
        <Hero />
      </CoverLift>

      {/* `data-paper-edge` — the masthead reads its top edge to know when the
          paper has reached the bar, which during the lift is not where the
          cover's own box says it is. */}
      <div className="report" data-paper-edge>
        {/* ── The problem, the blind spot, the method — bound by seams ── */}
        <GapSection />
        <ChapterSeam seam={chapterSeams.gapToBlind} />
        <BlindSpotSection />
        <ChapterSeam seam={chapterSeams.blindToMethod} />
        <MethodSection />

        {/* ── The turn, the invitation, and the tape that closes the front ── */}
        <StatementSpread />
        <DossierInvite />
        <Ticker />

        {/* ── The second half, opened on request and filed away from its own
               last line ── */}
        <DossierFold>
          <div className="movement">
            <MultiplierSection />
            <SourcesSection />
          </div>
          <DossierSection />
          <PhilosophySection />
          <DossierClose />
        </DossierFold>
      </div>
    </>
  );
}

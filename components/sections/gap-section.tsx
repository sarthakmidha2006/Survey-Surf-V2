import { GapInstrument } from "@/components/figures/gap-instrument";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { sectionIds } from "@/lib/constants";
import { gap } from "@/lib/content";

/** Chapter 01 — the costly gap between self-image and market-image. */
export function GapSection() {
  return (
    <Chapter id={sectionIds.gap} className="chapter--onescreen">
      <SectionHeader opener={gap.opener} variant="feature" />
      <GapInstrument />
    </Chapter>
  );
}

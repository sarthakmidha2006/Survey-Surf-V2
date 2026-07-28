import {
  AbsoluteBars,
  RelativeBars,
} from "@/components/figures/perception-bars";
import { Plate } from "@/components/ui/plate";
import { Reveal } from "@/components/ui/reveal";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs } from "@/components/ui/tabs";
import { sectionIds } from "@/lib/constants";
import { multiplierOpener, perceptionPanelLabel } from "@/lib/content";

/** The multiplier: perception read absolute, then relative. */
export function MultiplierSection() {
  return (
    <Chapter id={sectionIds.multiplier} className="chapter--flow">
      <SectionHeader opener={multiplierOpener} variant="quiet" />

      <Reveal as="figure" className="fig-plate draw-bars">
        <Plate>
          <Tabs
            ariaLabel="Perception read"
            tabBarClassName="plate-tab-bar"
            appendix={
              <span className="panel-label">{perceptionPanelLabel}</span>
            }
            items={[
              { id: "panelAbs", label: "Absolute", content: <AbsoluteBars /> },
              { id: "panelRel", label: "Relative", content: <RelativeBars /> },
            ]}
          />
        </Plate>
      </Reveal>
    </Chapter>
  );
}

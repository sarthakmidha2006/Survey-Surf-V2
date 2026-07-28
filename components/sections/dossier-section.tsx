import { CompetitiveScatter } from "@/components/figures/competitive-scatter";
import { BarMeter } from "@/components/ui/bar-meter";
import { LeaderRow } from "@/components/ui/leader-row";
import { Marginalia } from "@/components/ui/marginalia";
import { FigHead, Plate } from "@/components/ui/plate";
import { Reveal } from "@/components/ui/reveal";
import { Chapter } from "@/components/ui/section";
import { SectionHeader } from "@/components/ui/section-header";
import { Tabs } from "@/components/ui/tabs";
import { Heading, Kicker } from "@/components/ui/typography";
import { sectionIds } from "@/lib/constants";
import {
  dossierBlindSpot,
  dossierCompetitive,
  dossierDocCells,
  dossierEmotionalMap,
  dossierMessaging,
  dossierOpener,
} from "@/lib/content";

/** Chapter 06 — the deliverable: a dossier, not a dashboard. */
export function DossierSection() {
  const blindSpotPanel = (
    <div className="row">
      <div>
        <Heading as="h3" parts={dossierBlindSpot.heading} />
        <p className="body-copy">{dossierBlindSpot.body}</p>
        <div className="stats-strip">
          <table className="table-print">
            <thead>
              <tr>
                {dossierBlindSpot.table.head.map((head) => (
                  <th key={head}>{head}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{dossierBlindSpot.table.row[0]}</td>
                <td>{dossierBlindSpot.table.row[1]}</td>
                <td>
                  <em>{dossierBlindSpot.table.row[2]}</em>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="margin-cell">
        <Marginalia reveal={false}>{dossierBlindSpot.marginNote}</Marginalia>
      </div>
    </div>
  );

  const emotionalPanel = (
    <figure>
      <Plate>
        <FigHead
          left={<strong>{dossierEmotionalMap.figHead.title}</strong>}
          right={dossierEmotionalMap.figHead.right}
        />
        {dossierEmotionalMap.bars.map((bar) => (
          <BarMeter
            key={bar.label}
            label={bar.label}
            sub={bar.sub}
            value={bar.value}
            display={`${bar.value}%`}
          />
        ))}
        <p className="emap-terms">
          <span className="app">{dossierEmotionalMap.indexTermsLabel}</span>
          {dossierEmotionalMap.indexTerms}
        </p>
      </Plate>
    </figure>
  );

  const competitivePanel = (
    <figure>
      <Plate>
        <FigHead
          left={<strong>{dossierCompetitive.figHead.title}</strong>}
          right={dossierCompetitive.figHead.right}
        />
        <CompetitiveScatter />
        <div className="row">
          <p className="fig-read">
            <span className="read-label">{dossierCompetitive.read.label}</span>
            {dossierCompetitive.read.text}
          </p>
        </div>
      </Plate>
    </figure>
  );

  const messagingPanel = (
    <>
      <figure>
        <Plate>
          <div className="msg-pair">
            <div className="msg-card">
              <Kicker className="mb-0">{dossierMessaging.today.kicker}</Kicker>
              <p className="pullq">{dossierMessaging.today.quote}</p>
              <p className="msg-verdict">{dossierMessaging.today.verdict}</p>
            </div>
            <div className="msg-card">
              <Kicker className="mb-0">
                {dossierMessaging.opportunity.kicker}
              </Kicker>
              <p className="pullq">{dossierMessaging.opportunity.quote}</p>
              <p className="msg-verdict">
                {dossierMessaging.opportunity.verdict}
              </p>
            </div>
          </div>
        </Plate>
      </figure>
      <div className="campaigns ink-seq is-in">
        <p className="index-head app">{dossierMessaging.campaignsLabel}</p>
        {dossierMessaging.campaigns.map((item) => (
          <LeaderRow key={item.num} item={item} />
        ))}
      </div>
    </>
  );

  return (
    <Chapter id={sectionIds.dossier}>
      <SectionHeader opener={dossierOpener} />

      <Reveal className="doc-head">
        <div className="doc-head-cells">
          {dossierDocCells.map((cell) => (
            <span className="doc-cell" key={cell.label}>
              {cell.strong ? <strong>{cell.label}</strong> : cell.label}
            </span>
          ))}
        </div>
      </Reveal>

      <Reveal className="dossier-tabs">
        <Tabs
          ariaLabel="Dossier reports"
          panelClassName="dossier-panel"
          items={[
            { id: "dp1", label: "The Blind Spot", content: blindSpotPanel },
            { id: "dp2", label: "Emotional Map", content: emotionalPanel },
            {
              id: "dp3",
              label: "Competitive Perception",
              content: competitivePanel,
            },
            { id: "dp4", label: "Messaging", content: messagingPanel },
          ]}
        />
      </Reveal>
    </Chapter>
  );
}

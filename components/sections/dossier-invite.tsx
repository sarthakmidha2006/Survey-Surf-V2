"use client";

import { useDossierGate } from "@/components/dossier-gate";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { dossierCta, sectionIds } from "@/lib/constants";
import { dossierInvite } from "@/lib/content";

/**
 * The turn itself — one control, printed in two places, wired to one state.
 *
 * The label always says what the next press will DO, never what the page is
 * currently showing, so the same button reads correctly at the head of the file
 * and at its foot.
 */
function DossierToggle() {
  const { open, toggle } = useDossierGate();

  return (
    <button
      type="button"
      className="di-link"
      onClick={toggle}
      aria-expanded={open}
      aria-controls={sectionIds.continued}
      data-open={open || undefined}
    >
      <span className="di-label">
        {open ? dossierCta.close : dossierCta.open}
      </span>
      {/* One glyph, turned — the file's own mark, not two icons swapped. The
          publication's forward arrow while the file is closed (the same mark
          every other editorial link carries), turned back on itself once it is
          open, because the next press is the way back. */}
      <span className="di-arrow" aria-hidden="true">
        →
      </span>
    </button>
  );
}

/**
 * The invitation — the page-turn, not a destination. A toggle: it opens the
 * file and it files it away again.
 *
 * The front page has made its argument and the turn has landed it; the second
 * half is folded away behind this one line. Two marks only: a hairline drawn
 * almost the full width of the grid, and the invitation beneath it on the
 * publication's left margin with the copper arrow that carries the eye. No
 * chapter marker, no metadata, nothing closing the row on the right — a band
 * this short reads as a divider, and a divider needs no apparatus.
 *
 * On paper, deliberately: the turn above it and the tape below it are both
 * dark, and this band is the moment the publication returns to its own ground.
 * It is sized to the line it carries so the tape follows immediately and pulls
 * the reader into the file.
 */
export function DossierInvite() {
  return (
    <section
      id={sectionIds.invitation}
      className="dossier-invite"
      aria-label={dossierInvite.label}
    >
      <Container>
        <Reveal className="di-in">
          <span className="di-rule" aria-hidden="true" />
          <p className="di-line">
            <DossierToggle />
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

/**
 * The same turn, set at the FOOT of the file — the last line inside the fold.
 *
 * A reader who has read the file to the end has to be able to close it where
 * they are standing. Without this, the only control is back at the invitation,
 * which is several thousand pixels above them: the file would be a door that
 * only opens from the outside. It is the same button and the same state, so it
 * always reads "Close the Dossier", and pressing it runs the same sequence as
 * every other press — back to the invitation first, then the fold shuts.
 *
 * It lives inside the fold on purpose. It is part of the file, not of the front
 * page, so it disappears with the file rather than lingering under a landing
 * page that has nothing left to close.
 *
 * It does not reveal on scroll the way the invitation does. The fold's own fade
 * has already carried it in, and a control that inks itself only once the reader
 * arrives is a control they may not find — editorial matter can afford to
 * appear, a way out cannot.
 */
export function DossierClose() {
  return (
    <section
      className="dossier-invite dossier-invite--foot"
      aria-label={dossierInvite.footLabel}
    >
      <Container>
        <div className="di-in">
          <span className="di-rule" aria-hidden="true" />
          <p className="di-line">
            <DossierToggle />
          </p>
        </div>
      </Container>
    </section>
  );
}

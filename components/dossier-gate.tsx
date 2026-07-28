"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface DossierGate {
  /** Whether the second half of the issue is open. */
  open: boolean;
  /** Open it if closed, file it away if open. */
  toggle: () => void;
  /** Open it with no gesture — a deep link that lands inside it. */
  openNow: () => void;
}

const DossierGateContext = createContext<DossierGate | null>(null);

/**
 * The gate between the two halves of the issue.
 *
 * The front page tells the story; the methodology is folded away behind a
 * single editorial toggle — the invitation below the turn, and only that. The
 * masthead points a reader down to it but never throws it for them, so the file
 * is only ever opened in front of the file. The state lives above the page so the
 * invitation and the fold it controls, which are siblings, share one boolean
 * rather than agreeing by accident.
 *
 * One boolean, held for as long as the reader stays on the page. Nothing else
 * writes to it: scrolling, revealing and resizing all leave it alone, so the
 * second half never opens or files itself away on its own.
 */
export function DossierGateProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((current) => !current), []);
  const openNow = useCallback(() => setOpen(true), []);

  const value = useMemo(
    () => ({ open, toggle, openNow }),
    [open, toggle, openNow],
  );

  return (
    <DossierGateContext.Provider value={value}>
      {children}
    </DossierGateContext.Provider>
  );
}

export function useDossierGate(): DossierGate {
  const gate = useContext(DossierGateContext);
  if (!gate) {
    throw new Error("useDossierGate must be used inside <DossierGateProvider>");
  }
  return gate;
}

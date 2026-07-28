"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { DossierGateProvider } from "@/components/dossier-gate";

/**
 * Client-side providers. TanStack Query today; a natural home for any future
 * theme/session/analytics providers. The QueryClient is created once per
 * mount so it is never shared across requests on the server.
 *
 * The dossier gate is mounted here because it has to sit above both the
 * masthead (in the layout) and the fold (in the page) for the two calls to
 * action to be one switch.
 */
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <DossierGateProvider>{children}</DossierGateProvider>
    </QueryClientProvider>
  );
}

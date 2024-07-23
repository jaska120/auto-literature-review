"use client";

import { useHasHydrated } from "@/hooks/use-has-hydrated";
import { useBoundStore } from "@/state/bound-store";
import { Loading } from "./loading";

interface StoreLoadingProps {
  children: React.ReactNode;
}

/**
 * Render a loading spinner while the store is hydrating.
 */
export function StoreLoading({ children }: StoreLoadingProps) {
  const hydrated = useHasHydrated(useBoundStore);

  if (!hydrated) {
    return <Loading />;
  }

  return children;
}

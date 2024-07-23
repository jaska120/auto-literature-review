import { useEffect, useState } from "react";

interface PersistedStore {
  persist: {
    hasHydrated: () => boolean;
  };
}

/**
 * A hook to check if all provided stores have hydrated.
 */
export function useHasHydrated(...stores: PersistedStore[]) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (stores.every((s) => s.persist.hasHydrated())) {
      setHydrated(true);
    }
  }, [stores]);

  return hydrated;
}

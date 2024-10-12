import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createConfigSlice } from "./config/config";
import { createSearchSlice } from "./search/search";
import { ConfigSlice } from "./config/types";
import { SearchSlice } from "./search/types";
import { storeScopusApiKeys } from "./effects/scopus/scopus";

export const useBoundStore = create<ConfigSlice & SearchSlice>()(
  persist(
    (...args) => ({
      ...createConfigSlice(...args),
      ...createSearchSlice(...args),
    }),
    {
      name: "bound-store",
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            storeScopusApiKeys(
              state.connections.scopus.apiKeys?.[0],
              state.connections.scopus.apiKeys?.[1]
            );
          }
        };
      },
    }
  )
);

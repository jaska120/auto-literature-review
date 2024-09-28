import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createConfigSlice } from "./config/config";
import { createSearchSlice } from "./search/search";
import { ConfigSlice } from "./config/types";
import { SearchSlice } from "./search/types";
import { storeScopusApiKey } from "./effects/scopus/scopus";

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
            storeScopusApiKey(state.connections.scopus.apiKey);
          }
        };
      },
    }
  )
);

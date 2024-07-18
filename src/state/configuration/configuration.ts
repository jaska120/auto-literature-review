import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";
import { ConfigurationState, ConfigurationActions } from "./types";
import { testScopusApiKey } from "@/effects/scopus/scopus";

export const useConfigurationStore = create<ConfigurationState & ConfigurationActions>()(
  devtools(
    persist(
      (set) => ({
        scopusApiKey: undefined,
        saveScopusApiKey: async (scopusApiKey) => {
          const valid = scopusApiKey ? await testScopusApiKey(scopusApiKey) : false;
          if (!scopusApiKey || valid) {
            set({ scopusApiKey });
          }
          return valid;
        },
      }),
      {
        name: "configuration-store",
        version: 1,
      }
    )
  )
);

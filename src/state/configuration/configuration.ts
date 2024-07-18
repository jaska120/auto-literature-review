import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {} from "@redux-devtools/extension";
import { testScopusApiKey } from "@/effects/scopus/scopus";
import { ConfigurationState, ConfigurationActions, ExternalService } from "./types";

const TEST_API_KEY_MAP: Record<ExternalService, (apiKey: string) => Promise<boolean>> = {
  scopus: testScopusApiKey,
  openAI: async () => true,
};

export const useConfigurationStore = create<ConfigurationState & ConfigurationActions>()(
  devtools(
    persist(
      (set) => ({
        connections: {
          scopus: {
            apiKey: undefined,
            valid: false,
          },
          openAI: {
            apiKey: undefined,
            valid: false,
          },
        },
        saveApiKey: async (service, apiKey) => {
          const testFn = TEST_API_KEY_MAP[service];
          const valid = apiKey ? await testFn(apiKey) : false;
          if (!apiKey || valid) {
            set((state) => ({
              connections: {
                ...state.connections,
                [service]: {
                  apiKey,
                  valid,
                },
              },
            }));
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

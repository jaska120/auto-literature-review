import { create } from "zustand";
import { persist } from "zustand/middleware";
import { testScopusApiKey } from "@/effects/scopus/scopus";
import * as Op from "@/utils/operation";
import { ConfigurationState, ConfigurationActions, ExternalService } from "./types";

const TEST_API_KEY_MAP: Record<ExternalService, (apiKey: string) => Promise<boolean>> = {
  scopus: testScopusApiKey,
  openAI: async () => true,
};

export const useConfigurationStore = create<ConfigurationState & ConfigurationActions>()(
  persist(
    (set) => ({
      connections: {
        scopus: {
          apiKey: undefined,
          test: Op.idle,
        },
        openAI: {
          apiKey: undefined,
          test: Op.idle,
        },
      },
      saveApiKey: async (service, apiKey) => {
        if (!apiKey) {
          set((state) => ({
            connections: {
              ...state.connections,
              [service]: { ...state.connections[service], apiKey, test: Op.idle },
            },
          }));
          return;
        }

        set((state) => ({
          connections: {
            ...state.connections,
            [service]: { ...state.connections[service], test: Op.running },
          },
        }));

        const testFn = TEST_API_KEY_MAP[service];
        const valid = await testFn(apiKey);

        set((state) => ({
          connections: {
            ...state.connections,
            [service]: {
              apiKey: valid ? apiKey : undefined,
              test: valid ? Op.success(undefined) : Op.error(new Error("Invalid API key")),
            },
          },
        }));
      },
    }),
    {
      name: "configuration-store",
    }
  )
);
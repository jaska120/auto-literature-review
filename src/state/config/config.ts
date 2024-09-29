import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { testAndSetScopusApiKey, removeScopusApiKey } from "../effects/scopus/scopus";
import { testAndSetOpenAIApiKey, removeOpenAIApiKey } from "../effects/openai/openai";
import { ExternalService, ConfigSlice } from "./types";

const REMOVE_API_KEY_MAP: Record<ExternalService, () => void> = {
  scopus: removeScopusApiKey,
  openAI: removeOpenAIApiKey,
};

const TEST_API_KEY_MAP: Record<ExternalService, (apiKey: string) => Promise<boolean>> = {
  scopus: testAndSetScopusApiKey,
  openAI: testAndSetOpenAIApiKey,
};

export const createConfigSlice: StateCreator<ConfigSlice> = (set) => ({
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
      REMOVE_API_KEY_MAP[service]();
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

    const valid = await TEST_API_KEY_MAP[service](apiKey);

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
});

import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { testAndSetScopusApiKeys, removeScopusApiKeys } from "../effects/scopus/scopus";
import { testAndSetOpenAIApiKey, removeOpenAIApiKey } from "../effects/openai/openai";
import { ExternalService, ConfigSlice, ConfigState } from "./types";

const REMOVE_API_KEY_MAP: Record<ExternalService, () => void> = {
  scopus: removeScopusApiKeys,
  openAI: removeOpenAIApiKey,
};

const TEST_API_KEY_MAP: Record<ExternalService, (...apiKeys: string[]) => Promise<boolean>> = {
  scopus: testAndSetScopusApiKeys,
  openAI: testAndSetOpenAIApiKey,
};

const initialConnection: ConfigState["connections"]["scopus"] = {
  apiKeys: [],
  test: Op.idle,
};
const initialState: ConfigState = {
  connections: {
    scopus: initialConnection,
    openAI: initialConnection,
  },
};

export const createConfigSlice: StateCreator<ConfigSlice> = (set) => ({
  ...initialState,
  saveApiKey: async (service, apiKeys) => {
    if (!apiKeys) {
      REMOVE_API_KEY_MAP[service]();
      set((state) => ({
        connections: {
          ...state.connections,
          [service]: { ...state.connections[service], apiKeys, test: Op.idle },
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

    const valid = await TEST_API_KEY_MAP[service](...apiKeys);

    set((state) => ({
      connections: {
        ...state.connections,
        [service]: {
          apiKeys: valid ? apiKeys : undefined,
          test: valid ? Op.success(undefined) : Op.error(new Error("Invalid API key")),
        },
      },
    }));
  },
});

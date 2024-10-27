import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { createConfigSlice } from "./config/config";
import { createSearchSlice } from "./search/search";
import { createFlowSlice } from "./flow/flow";
import { createIntelligenceSlice } from "./intelligence/intelligence";
import { ConfigSlice } from "./config/types";
import { SearchSlice } from "./search/types";
import { registerScopusApiKeys } from "./effects/scopus/scopus";
import { IntelligenceSlice } from "./intelligence/types";
import { registerOpenAIApiKey } from "./effects/openai/openai";
import { FlowSlice } from "./flow/types";

function isIsoDateString(v: unknown): v is string {
  if (typeof v !== "string") {
    return false;
  }

  // Check if the string matches the ISO 8601 date format (YYYY-MM-DDTHH:mm:ss.sssZ)
  const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?Z$/;
  if (!isoDateRegex.test(v)) {
    return false;
  }

  // Check if the value can be successfully converted to a valid Date object
  const date = new Date(v);
  return !Number.isNaN(date.getTime());
}

const storage = createJSONStorage(() => localStorage, {
  reviver: (key, value) => {
    if (isIsoDateString(value)) {
      return new Date(value);
    }
    return value;
  },
});

export const useBoundStore = create<FlowSlice & ConfigSlice & SearchSlice & IntelligenceSlice>()(
  persist(
    (...args) => ({
      ...createFlowSlice(...args),
      ...createConfigSlice(...args),
      ...createSearchSlice(...args),
      ...createIntelligenceSlice(...args),
    }),
    {
      name: "bound-store",
      storage,
      onRehydrateStorage: () => {
        return (state) => {
          if (state) {
            registerScopusApiKeys(
              state.connections.scopus.apiKeys?.[0],
              state.connections.scopus.apiKeys?.[1]
            );
            registerOpenAIApiKey(state.connections.openAI.apiKeys?.[0]);
          }
        };
      },
    }
  )
);

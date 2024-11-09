import { StateCreator } from "zustand";
import { getValue } from "@/utils/operation";
import { FlowState, FlowSlice } from "./types";
import { SearchSlice } from "../search/types";
import { IntelligenceSlice } from "../intelligence/types";
import { searchInitialState } from "../search/search";
import { intelligenceInitialState } from "../intelligence/intelligence";

export const flowInitialState: FlowState = {
  flowStep: 0,
};

export const createFlowSlice: StateCreator<
  FlowSlice & SearchSlice & IntelligenceSlice,
  [],
  [],
  FlowSlice
> = (set, get) => ({
  ...flowInitialState,
  setFlowStep: (update) => {
    set((state) => {
      if (typeof update === "function") {
        return { flowStep: update(state.flowStep) };
      }
      return { flowStep: update };
    });
  },
  applySearchString: () => {
    const value = getValue(get().searchStringResult.currentResult)?.searchString;
    if (value) {
      set({
        literatureQuery: value,
        literatureSearchResult: searchInitialState.literatureSearchResult,
        fullLiteratureSearchResult: searchInitialState.fullLiteratureSearchResult,
      });
      return true;
    }
    return false;
  },
  applySearch: async () => {
    get().fetchFullLiteratureSearch();
    set({ evaluateLiteratureTestResult: intelligenceInitialState.evaluateLiteratureTestResult });
  },
  evaluateLiteratureTest: async (prompt) => {
    const { fullLiteratureSearchResult, askAIForLiteratureEvaluation } = get();
    const allMetadata = getValue(fullLiteratureSearchResult);
    if (allMetadata && allMetadata.length > 0) {
      await askAIForLiteratureEvaluation(allMetadata.slice(0, 3), prompt);
    }
  },
});

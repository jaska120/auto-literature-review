import { StateCreator } from "zustand";
import { getValue } from "@/utils/operation";
import { FlowState, FlowSlice } from "./types";
import { SearchSlice } from "../search/types";
import { IntelligenceSlice } from "../intelligence/types";
import { searchInitialState } from "../search/search";

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
      });
      return true;
    }
    return false;
  },
  applySearch: async () => {
    get().fetchFullLiteratureSearch();
  },
});

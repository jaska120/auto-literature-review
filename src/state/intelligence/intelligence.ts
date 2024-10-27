import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { IntelligenceSlice, IntelligenceState } from "./types";
import { askAIForSearchString } from "../effects/openai/openai";

export const intelligenceInitialState: IntelligenceState = {
  searchStringPrompt: undefined,
  searchStringResult: { currentResult: Op.idle },
};

export const createIntelligenceSlice: StateCreator<IntelligenceSlice> = (set) => ({
  ...intelligenceInitialState,
  askAIForSearchString: async (prompt) => {
    set({ searchStringPrompt: prompt, searchStringResult: { currentResult: Op.running } });
    try {
      const results = await askAIForSearchString(prompt);
      if (results.length === 0) {
        throw new Error("Failed to get complete answer from AI. Please adjust your prompt.");
      }
      set({ searchStringResult: { currentResult: Op.success(results) } });
    } catch (e) {
      set({ searchStringResult: { currentResult: Op.error(e) } });
    }
  },
});

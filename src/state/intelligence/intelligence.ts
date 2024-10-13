import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { IntelligenceSlice, IntelligenceState } from "./types";
import { askAI } from "../effects/openai/openai";
import { searchStringSystemPrompt } from "./search-string-system-prompt";

const initialState: IntelligenceState = {
  searchStringSystemPrompt,
  searchStringPrompt: undefined,
  searchStringResult: { currentResult: Op.idle },
};

export const createIntelligenceSlice: StateCreator<IntelligenceSlice> = (set, get) => ({
  ...initialState,
  askAIForSearchString: async (prompt) => {
    set({ searchStringPrompt: prompt, searchStringResult: { currentResult: Op.running } });
    try {
      const results = await askAI(get().searchStringSystemPrompt, prompt);
      if (results.length === 0) {
        throw new Error("Failed to get complete answer from AI. Please adjust your prompt.");
      }
      set({ searchStringResult: { currentResult: Op.success(results) } });
    } catch (e) {
      set({ searchStringResult: { currentResult: Op.error(e) } });
    }
  },
});

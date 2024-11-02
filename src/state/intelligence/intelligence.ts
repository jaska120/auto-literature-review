import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { IntelligenceSlice, IntelligenceState } from "./types";
import { askAIForLiteratureEvaluation, askAIForSearchString } from "../effects/openai/openai";

export const intelligenceInitialState: IntelligenceState = {
  searchStringPrompt: undefined,
  searchStringResult: { currentResult: Op.idle },
  evaluateLiteraturePrompt: undefined,
  evaluateLireatureMetadata: [],
  evaluateLiteratureResult: { currentResult: Op.idle },
};

export const createIntelligenceSlice: StateCreator<IntelligenceSlice> = (set) => ({
  ...intelligenceInitialState,
  askAIForSearchString: async (prompt) => {
    set({ searchStringPrompt: prompt, searchStringResult: { currentResult: Op.running } });
    try {
      const result = await askAIForSearchString(prompt);
      set({ searchStringResult: { currentResult: Op.success(result) } });
    } catch (e) {
      set({ searchStringResult: { currentResult: Op.error(e) } });
    }
  },
  askAIForLiteratureEvaluation: async (prompt) => {
    set({
      evaluateLiteraturePrompt: prompt,
      evaluateLiteratureResult: { currentResult: Op.running },
    });
    try {
      const result = await askAIForLiteratureEvaluation(prompt);
      set({ evaluateLiteratureResult: { currentResult: Op.success(result) } });
    } catch (e) {
      set({ evaluateLiteratureResult: { currentResult: Op.error(e) } });
    }
  },
});

import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { IntelligenceSlice, IntelligenceState } from "./types";
import {
  askAIForLiteratureEvaluation,
  askAIForSearchString,
  generateLiteratureEvaluationPrompt,
} from "../effects/openai/openai";

export const intelligenceInitialState: IntelligenceState = {
  searchStringPrompt: undefined,
  searchStringResult: { currentResult: Op.idle },
  evaluateLiteraturePrompt: undefined,
  evaluateLiteratureTestResult: { currentResult: Op.idle },
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
  askAIForLiteratureEvaluation: async (metadatas, prompt) => {
    set({
      evaluateLiteraturePrompt: prompt,
      evaluateLiteratureTestResult: { currentResult: Op.running },
    });

    const prompts = metadatas.map((m) => generateLiteratureEvaluationPrompt(m, prompt));

    try {
      const results = await Promise.all(prompts.map((p) => askAIForLiteratureEvaluation(p)));
      const testResults = prompts.map((p, i) => ({
        prompt: p,
        result: results[i],
      }));
      set({ evaluateLiteratureTestResult: { currentResult: Op.success(testResults) } });
    } catch (e) {
      set({ evaluateLiteratureTestResult: { currentResult: Op.error(e) } });
    }
  },
});

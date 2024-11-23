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
  evaluateLiteratureResults: { currentResult: Op.idle },
};

export const createIntelligenceSlice: StateCreator<IntelligenceSlice> = (set, get) => ({
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
      evaluateLiteratureResults: { currentResult: Op.running },
    });

    const prompts = metadatas.map((m) => generateLiteratureEvaluationPrompt(m, prompt));

    try {
      const results = await Promise.all(prompts.map((p) => askAIForLiteratureEvaluation(p)));
      const testResults = prompts.map((p, i) => ({
        literature: metadatas[i],
        prompt: p,
        result: results[i],
      }));
      set({ evaluateLiteratureResults: { currentResult: Op.success(testResults) } });
    } catch (e) {
      set({ evaluateLiteratureResults: { currentResult: Op.error(e) } });
    }
  },
  fetchFullLiteratureEvaluation: async (metadatas) => {
    const { evaluateLiteraturePrompt, evaluateLiteratureResults } = get();

    if (!evaluateLiteraturePrompt) {
      throw new Error("Make test evaluation first.");
    }

    const prompts = metadatas.map((m) =>
      generateLiteratureEvaluationPrompt(m, evaluateLiteraturePrompt)
    );

    const results = await Promise.all(
      prompts.map(async (p, i) => {
        const cachedResponse = Op.getValue(evaluateLiteratureResults.currentResult)?.find(
          (r) => r.prompt === p
        );
        if (cachedResponse) {
          return cachedResponse;
        }
        return {
          literature: metadatas[i],
          prompt: p,
          result: await askAIForLiteratureEvaluation(p),
        };
      })
    );

    set({ evaluateLiteratureResults: { currentResult: Op.success(results) } });

    return results;
  },
});

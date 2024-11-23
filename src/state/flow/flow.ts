/* eslint-disable no-plusplus */
import { StateCreator } from "zustand";
import { getValue } from "@/utils/operation";
import { FlowState, FlowSlice } from "./types";
import { SearchSlice } from "../search/types";
import { IntelligenceSlice } from "../intelligence/types";
import { searchInitialState } from "../search/search";
import { intelligenceInitialState } from "../intelligence/intelligence";
import { saveCSVFile } from "../effects/file-system/file-system";

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
    }
  },
  applySearch: async () => {
    set({ evaluateLiteratureResults: intelligenceInitialState.evaluateLiteratureResults });
  },
  evaluateLiteratureTest: async (prompt) => {
    const { literatureSearchResult, askAIForLiteratureEvaluation } = get();
    const threePapers = literatureSearchResult.results[0]?.result.slice(0, 3) || [];
    if (threePapers.length) {
      await askAIForLiteratureEvaluation(threePapers, prompt);
    }
  },
  generateReport: async () => {
    const { fetchFullLiteratureSearch, fetchFullLiteratureEvaluation } = get();
    const allLiterature = await fetchFullLiteratureSearch();
    const evaluations = await fetchFullLiteratureEvaluation(allLiterature);

    const today = new Date();
    const csv = await saveCSVFile(
      `auto-literature-review-report-${today.toISOString().slice(0, 19)}Z.csv`,
      [
        "title",
        "publication",
        "publish_year",
        "cited_by_count",
        "authors",
        "keywords",
        "abstract",
        "evaluation_prompt",
        "evaluation_inclusion",
        "evaluation_justification",
      ]
    );

    for (let i = 0; i < evaluations.length; i++) {
      const { literature, prompt, result } = evaluations[i];
      csv.write([
        literature.title,
        literature.publication,
        literature.publishDate?.getFullYear().toString() || "?",
        literature.citedByCount || "",
        literature.authors.join(","),
        literature.keywords.join(","),
        literature.abstract,
        prompt,
        result.inclusion ? "include" : "exclude",
        result.justification,
      ]);
    }

    csv.end();
  },
});

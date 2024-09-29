import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { SearchSlice, SearchState } from "./types";
import { searchScopus } from "../effects/scopus/scopus";

const initialState: SearchState = {
  literatureQuery: undefined,
  literatureSearchResult: { results: [], currentResult: Op.idle },
};

export const createSearchSlice: StateCreator<SearchSlice> = (set, get) => ({
  ...initialState,
  searchLiterature: async (query, isPaginationLink) => {
    if (!isPaginationLink) {
      set({ literatureQuery: query, literatureSearchResult: initialState.literatureSearchResult });
    }

    const cachedResult = get().literatureSearchResult.results.find((r) => r.links.self === query);
    if (cachedResult) {
      set(({ literatureSearchResult }) => ({
        literatureSearchResult: {
          ...literatureSearchResult,
          currentResult: Op.success(cachedResult),
        },
      }));
      return;
    }

    set(({ literatureSearchResult }) => ({
      literatureSearchResult: { ...literatureSearchResult, currentResult: Op.running },
    }));

    try {
      const response = await searchScopus(query, isPaginationLink);
      set(({ literatureSearchResult }) => ({
        literatureSearchResult: {
          results: [...literatureSearchResult.results, response],
          currentResult: Op.success(response),
        },
      }));
    } catch (e) {
      set(({ literatureSearchResult }) => ({
        literatureSearchResult: {
          ...literatureSearchResult,
          currentResult: Op.error(e),
        },
      }));
    }
  },
});

import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { SearchSlice, SearchState } from "./types";
import { hasAllResults, searchScopus } from "../effects/scopus/scopus";

/** The max number of results that can be processed. */
const SEARCH_LIMIT = 500;

export const searchInitialState: SearchState = {
  literatureQuery: undefined,
  literatureSearchResult: { results: [], currentResult: Op.idle, isComplete: false },
  fullLiteratureSearchResult: Op.idle,
};

export const createSearchSlice: StateCreator<SearchSlice> = (set, get) => ({
  ...searchInitialState,
  setLiteratureQuery: (updater) => {
    set(({ literatureQuery }) => ({
      literatureQuery: typeof updater === "function" ? updater(literatureQuery) : updater,
      literatureSearchResult: searchInitialState.literatureSearchResult,
    }));
  },
  searchLiterature: async (query, isPaginationLink) => {
    if (!isPaginationLink) {
      set({
        literatureQuery: query,
        literatureSearchResult: searchInitialState.literatureSearchResult,
      });
    }

    const cachedResult = get().literatureSearchResult.results.find((r) => r.links.self === query);
    if (cachedResult) {
      set(({ literatureSearchResult }) => ({
        literatureSearchResult: {
          ...literatureSearchResult,
          currentResult: Op.success(cachedResult),
        },
      }));
      return undefined;
    }

    set(({ literatureSearchResult }) => ({
      literatureSearchResult: { ...literatureSearchResult, currentResult: Op.running },
    }));

    try {
      const response = await searchScopus(query, isPaginationLink);
      set(({ literatureSearchResult }) => {
        const results = [...literatureSearchResult.results, response];

        return {
          literatureSearchResult: {
            isComplete: hasAllResults(results),
            results,
            currentResult: Op.success(response),
          },
        };
      });
      return response;
    } catch (e) {
      set(({ literatureSearchResult }) => ({
        literatureSearchResult: {
          ...literatureSearchResult,
          currentResult: Op.error(e),
        },
      }));
    }
    return undefined;
  },
  fetchFullLiteratureSearch: async () => {
    const { literatureSearchResult, searchLiterature } = get();
    const firstPage = literatureSearchResult.results.find((r) => r.page === 1);

    if (!firstPage || !firstPage.links.next) {
      set({ fullLiteratureSearchResult: Op.error(new Error("Make a search first")) });
      return;
    }

    if (firstPage.totalResults > SEARCH_LIMIT) {
      set({
        fullLiteratureSearchResult: Op.error(
          new Error(`Narrow down search to less than ${SEARCH_LIMIT} results`)
        ),
      });
      return;
    }

    let nextLink: string | undefined = firstPage.links.next;
    set({ fullLiteratureSearchResult: Op.running });

    try {
      do {
        // eslint-disable-next-line no-await-in-loop
        const result = await searchLiterature(nextLink, true);
        nextLink = result?.links.next || undefined;
      } while (nextLink);

      const { isComplete, results } = get().literatureSearchResult;

      if (isComplete) {
        const literature = results.map((r) => r.result).flat();
        set({ fullLiteratureSearchResult: Op.success(literature) });
      } else {
        set({ fullLiteratureSearchResult: Op.error(new Error("Failed to fetch all pages")) });
      }
    } catch (e) {
      set({ fullLiteratureSearchResult: Op.error(e) });
    }
  },
});

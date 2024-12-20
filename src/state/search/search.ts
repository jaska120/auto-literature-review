import { StateCreator } from "zustand";
import * as Op from "@/utils/operation";
import { SearchSlice, SearchState } from "./types";
import { hasAllResults, searchScopus } from "../effects/scopus/scopus";
import { LiteratureMetadata, Pagination } from "../types";

/** The max number of results that can be processed. */
const SEARCH_LIMIT = 2000;

export const searchInitialState: SearchState = {
  literatureQuery: undefined,
  literatureSearchResult: { results: [], currentResult: Op.idle },
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
    const { literatureSearchResult } = get();
    const firstPage = literatureSearchResult.results.find((r) => r.page === 1);

    if (!firstPage || !firstPage.links.next) {
      throw new Error("Make a search first");
    }

    if (firstPage.totalResults > SEARCH_LIMIT) {
      throw new Error(`Narrow down search to less than ${SEARCH_LIMIT} results`);
    }

    const { currentResult } = literatureSearchResult;
    let nextLink: string | undefined = firstPage.links.next;

    const results = [firstPage];

    do {
      const cachedResponse = literatureSearchResult.results.find(
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        (r) => r.links.self === nextLink
      );

      const response: Pagination<LiteratureMetadata[]> =
        // eslint-disable-next-line no-await-in-loop
        cachedResponse || (await searchScopus(nextLink, true));

      results.push(response);
      nextLink = response?.links.next || undefined;
    } while (nextLink);

    if (hasAllResults(results)) {
      set(() => ({
        literatureSearchResult: { results, currentResult },
      }));
      return results.map((r) => r.result).flat();
    }
    throw new Error("Failed to fetch all pages");
  },
});

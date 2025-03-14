import { LiteratureMetadata, PaginatedResult, Pagination } from "../types";

export interface SearchState {
  literatureQuery: string | undefined;
  literatureSearchResult: PaginatedResult<LiteratureMetadata[]>;
}

export interface SearchActions {
  setLiteratureQuery: (
    updater: string | undefined | ((prevQuery: string | undefined) => string | undefined)
  ) => void;
  searchLiterature: (
    queryOrLink: string,
    isPaginationLink: boolean
  ) => Promise<Pagination<LiteratureMetadata[]> | undefined>;
  /** For given search, fetch all results to memory. */
  fetchFullLiteratureSearch: () => Promise<LiteratureMetadata[]>;
}

export type SearchSlice = SearchState & SearchActions;

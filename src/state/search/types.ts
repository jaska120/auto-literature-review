import { LiteratureMetadata, PaginatedResult } from "../types";

export interface SearchState {
  literatureQuery: string | undefined;
  literatureSearchResult: PaginatedResult<LiteratureMetadata[]>;
}

export interface SearchActions {
  setLiteratureQuery: (
    updater: string | undefined | ((prevQuery: string | undefined) => string | undefined)
  ) => void;
  searchLiterature: (queryOrLink: string, isPaginationLink: boolean) => Promise<void>;
}

export type SearchSlice = SearchState & SearchActions;

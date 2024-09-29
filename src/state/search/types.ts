import { LiteratureMetadata, PaginatedResult } from "../types";

export interface SearchState {
  literatureQuery: string | undefined;
  literatureSearchResult: PaginatedResult<LiteratureMetadata[]>;
}

export interface SearchActions {
  searchLiterature: (queryOrLink: string, isPaginationLink: boolean) => Promise<void>;
}

export type SearchSlice = SearchState & SearchActions;

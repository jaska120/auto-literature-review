import { Operation } from "@/utils/operation";
import { LiteratureMetadata, PaginatedResult, Pagination } from "../types";

export interface SearchState {
  literatureQuery: string | undefined;
  literatureSearchResult: PaginatedResult<LiteratureMetadata[]>;
  fullLiteratureSearchResult: Operation<LiteratureMetadata[]>;
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
  fetchFullLiteratureSearch: () => Promise<void>;
}

export type SearchSlice = SearchState & SearchActions;

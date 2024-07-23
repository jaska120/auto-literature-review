import { Operation } from "@/utils/operation";
import { ScopusSearchResponse } from "@/clients/elsevier/types";

interface SearchState {
  literatureSearch: Operation<ScopusSearchResponse>;
}

interface SearchActions {
  loadLiteratureSearch: (query: string) => Promise<void>;
}

export type SearchSlice = SearchState & SearchActions;

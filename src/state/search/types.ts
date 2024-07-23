import { Operation } from "@/utils/operation";

interface SearchState {
  literatureSearch: Operation<unknown>;
}

interface SearchActions {
  loadLiteratureSearch: (query: string) => Promise<void>;
}

export type SearchSlice = SearchState & SearchActions;

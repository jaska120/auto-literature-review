import { Operation } from "@/utils/operation";
import { LiteratureMetadata } from "../types";

interface SearchState {
  literatureQuery: string | undefined;
  literatureSearch: Operation<LiteratureMetadata[]>;
}

interface SearchActions {
  loadLiteratureSearch: (query: string) => Promise<void>;
}

export type SearchSlice = SearchState & SearchActions;

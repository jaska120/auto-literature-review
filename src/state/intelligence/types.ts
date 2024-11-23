import {
  Result,
  SearchStringIntelligentAnswer,
  LiteratureMetadata,
  LiteratureEvaluation,
} from "../types";

export interface IntelligenceState {
  searchStringPrompt: string | undefined;
  searchStringResult: Result<SearchStringIntelligentAnswer>;
  evaluateLiteraturePrompt: string | undefined;
  evaluateLiteratureResults: Result<LiteratureEvaluation[]>;
}

export interface IntelligenceActions {
  askAIForSearchString: (prompt: string) => Promise<void>;
  askAIForLiteratureEvaluation: (metadatas: LiteratureMetadata[], prompt: string) => Promise<void>;
  fetchFullLiteratureEvaluation: (
    metadatas: LiteratureMetadata[]
  ) => Promise<LiteratureEvaluation[]>;
}

export type IntelligenceSlice = IntelligenceState & IntelligenceActions;

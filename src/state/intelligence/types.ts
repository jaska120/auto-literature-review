import {
  Result,
  SearchStringIntelligentAnswer,
  EvaluateLiteratureIntelligentAnswer,
  LiteratureMetadata,
} from "../types";

export interface IntelligenceState {
  searchStringPrompt: string | undefined;
  searchStringResult: Result<SearchStringIntelligentAnswer>;
  evaluateLiteraturePrompt: string | undefined;
  evaluateLireatureMetadata: LiteratureMetadata[];
  evaluateLiteratureResult: Result<EvaluateLiteratureIntelligentAnswer>;
}

export interface IntelligenceActions {
  askAIForSearchString: (prompt: string) => Promise<void>;
  askAIForLiteratureEvaluation: (prompt: string) => Promise<void>;
}

export type IntelligenceSlice = IntelligenceState & IntelligenceActions;

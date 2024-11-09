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
  evaluateLiteratureTestResult: Result<
    {
      prompt: string;
      result: EvaluateLiteratureIntelligentAnswer;
    }[]
  >;
}

export interface IntelligenceActions {
  askAIForSearchString: (prompt: string) => Promise<void>;
  askAIForLiteratureEvaluation: (metadatas: LiteratureMetadata[], prompt: string) => Promise<void>;
}

export type IntelligenceSlice = IntelligenceState & IntelligenceActions;

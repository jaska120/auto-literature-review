import { Result, SearchStringIntelligentAnswer } from "../types";

export interface IntelligenceState {
  searchStringPrompt: string | undefined;
  searchStringResult: Result<SearchStringIntelligentAnswer[]>;
}

export interface IntelligenceActions {
  askAIForSearchString: (prompt: string) => Promise<void>;
}

export type IntelligenceSlice = IntelligenceState & IntelligenceActions;

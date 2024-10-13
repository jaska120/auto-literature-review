import { Result, IntelligentAnswer } from "../types";

export interface IntelligenceState {
  searchStringPrompt: string | undefined;
  searchStringResult: Result<IntelligentAnswer[]>;
}

export interface IntelligenceActions {
  askAIForSearchString: (prompt: string) => Promise<void>;
}

export type IntelligenceSlice = IntelligenceState & IntelligenceActions;

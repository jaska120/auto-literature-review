export interface FlowState {
  flowStep: number;
}

export interface FlowActions {
  setFlowStep: (updater: number | ((prevStep: number) => number)) => void;
  applySearchString: () => void;
  applySearch: () => void;
  evaluateLiteratureTest: (prompt: string) => Promise<void>;
}

export type FlowSlice = FlowState & FlowActions;

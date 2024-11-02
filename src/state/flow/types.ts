export interface FlowState {
  flowStep: number;
}

export interface FlowActions {
  setFlowStep: (updater: number | ((prevStep: number) => number)) => void;
  applySearchString: () => void;
  applySearch: () => void;
}

export type FlowSlice = FlowState & FlowActions;

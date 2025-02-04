export interface StateMachineConfigInterface {
  id: string;
  initial: string;
  context: ContextInterface;
  states: Record<string, StateRecordInterface>;
  on: Record<string, OnRecordStateMachineInterface>;
}

interface ContextInterface {
  retries: number;
  applicationStatus: string;
  stagingState: string;
  currentStage: string;
  applicationFinalStatus: string;
  onboardingStages: Record<string, OnboardingStagesRecordInterface>;
}

interface OnboardingStagesRecordInterface {
  title?: string;
  state?: string;
  isEnabled?: boolean;
  order?: number;
  description?: string;
  items?: Array<any>;
  buttons?: Array<string>;
}

interface StateRecordInterface {
  on?: OnStateRecordInterface | Record<string, string>;
  entry?: string;
  type?: string;
  ''?: Array<ActionInteface>;
  '*'?: string;
}

interface OnStateRecordInterface {
  FORWARD?: Array<ActionInteface>;
  SELECT?: string;
  RETRY?: ActionInteface;
  APPROVE?: ActionInteface;
}

interface ActionInteface {
  target?: string;
  cond?: { type: string; property?: string } | string;
  actions?: Array<string> | string;
}

interface OnRecordStateMachineInterface {
  actions: string;
  internal?: boolean;
}

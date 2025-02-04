export interface ResponseInterface {
  applicationInfo: {
    currentStage: null;
    applicationStatus: string;
    stagingState: string;
    applicationFinalStatus: string;
  };
  stages: {
    stageType: string;
    isEnabled: boolean;
    state: string;
    order: number;
  }[];
  errors: {
    description: null;
    items: any[];
  };
}

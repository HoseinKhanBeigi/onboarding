import { ActiveApplicationInterface } from './activeApplication.interface';

export interface ApplicationInterface {
  applications: Array<ActiveApplicationInterface>;
  application?: CurrentApplicationInterface;
  needActivation?: boolean;
}

export type RelationType = 'MYSELF' | 'CHILD' | 'PARENTS';

export interface ApplicationInfoInterface {
  currentStage: string;
  applicationID: string;
  applicationStatus: string;
  stagingState: string;
  applicationFinalStatus: string;
  productGroupCode: string;
  productType: 'NORMAL' | 'SEJAM' | 'ESIGN';
  products: Array<string>;
  referrerCode?: string;
  stagingDescription: string;
  startOnboardingBy: RelationType;
}

export interface CurrentApplicationInterface {
  preCondition: {
    product: string;
    other: boolean;
  };
  applicationInfo: ApplicationInfoInterface;
  stages: Array<ApplicationStages>;
  startOnboardingDto: {
    nationalCode: string;
    other: boolean;
    product: string;
    productGroupCode: string;
    registrationNumber: string;
    relationshipType: string;
    sejamOtp: any;
    startOnboardingFor: RelationType;
  };
  errors: any;
}

export interface ApplicationStages {
  stageType: string;
  state: string;
  title: string;
  isEnabled: boolean;
  data: any;
}

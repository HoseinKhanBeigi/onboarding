import { RelationType } from './application.interface';

export interface ApplicationItemInterface {
  firstName: string;
  lastName: string;
  fullName: string;
  productGroup: string;
  applicationID: string;
  applicationStatus: string; // TODO: please add the cases
  startOnboardingFor: RelationType;
  applicationFinalStatus: string;
  stagingState: string;
  productType: string;
}

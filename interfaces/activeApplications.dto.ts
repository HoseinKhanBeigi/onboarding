import {ActiveApplicationInterface} from './activeApplication.interface';

export interface ActiveApplicationsDto {
  needsUserRegistration: boolean;
  applications: Array<ActiveApplicationInterface>;
  isImportedLead: boolean;
}
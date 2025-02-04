export interface ActiveApplicationInterface {
  productType: string;
  productName: string;
  productGroup: string;
  applicationFinalStatus: "IN_PROGRESS" | "WON" | "SEMI_WON" | "LOST",
  stagingState: string;
  applicationID: string;
  cardGroup: string;
  stagingDescription: string;
  applicationInfoId: string;
  authorizedAUerId: string;
  currentStage: string;
  firstName: string;
  fullName: string;
  lastName: string;
  relations: Array<ApplicationRelationDto>;
  startOnboardingFor: string;
  type: "BUSINESS" | "PERSON";
  userId: string;
}

interface ApplicationRelationDto {
  relatedUserId: string;
  relationType: string;
}
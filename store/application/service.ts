type GetActiveApplicationsPath = () => string;
export const getActiveApplicationsPath: GetActiveApplicationsPath = () =>
  `/v1/applications`;
type StartApplicationPath = () => string;
export const startApplicationPath: StartApplicationPath = () =>
  `/v1/applications`;
type GetApplicationByIdPath = (id: string) => string;
export const getApplicationByIdPath: GetApplicationByIdPath = id =>
  `/v1/applications/${id}`;
type SubmitApplicationByIdPath = (id: string) => string;
export const submitApplicationByIdPath: SubmitApplicationByIdPath = id =>
  `/v1/applications/${id}`;
type SetReferralCodePath = (id: string) => string;
export const setReferralCodePath: SetReferralCodePath = id =>
  `/v1/applications/${id}/referral-code`;

type SaveStageDataPath = (applicationId: string, stageName: string) => string;
export const saveStageDataPath: SaveStageDataPath = (
  applicationId,
  stageName,
) => `/v1/applications/${applicationId}/${stageName.toLowerCase()}`;

export default saveStageDataPath;

type GetConfigPath = (brand: string) => string;
export const getConfigPath: GetConfigPath = type =>
  `/v1/configuration/extra-data/${type}`;

export default getConfigPath;

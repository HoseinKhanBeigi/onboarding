import { AxiosResponse } from 'axios';

export interface ConfigReduxRootState {
  city: Array<ConfigEntity>;
  province: Array<ConfigEntity>;
  income: Array<ConfigEntity>;
  degree: Array<ConfigEntity>;
  job: Array<ConfigEntity>;
}

export interface ConfigEntity {
  id: number;
  name: string;
  available: boolean;
}

export interface MappedOption {
  key: string | number;
  value: string | number;
  text: string;
}

export type UnMappedConfigResponse = Array<any>;
export type MappedConfigResponse = Array<ConfigEntity>;

export type ContentEntityMapper = (
  response: AxiosResponse<UnMappedConfigResponse>,
) => AxiosResponse<MappedConfigResponse>;

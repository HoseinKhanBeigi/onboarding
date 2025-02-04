import { StageStatusEnum } from './stageStatus.enum';

export interface StepRouteInterface {
  title: string;
  key: string;
  path: string;
  status?: StageStatusEnum;
  builtin?: string;
}

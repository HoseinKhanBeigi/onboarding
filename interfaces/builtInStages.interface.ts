import { StageInterface } from './stage.interface';

export interface BuiltInStageProps {
  brand: string | undefined;
  stage: StageInterface;
  actions: Record<string, any>;
}

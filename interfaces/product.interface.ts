import {StageInterface} from './stage.interface';
import {DataSourceInterface} from "./entity.interface";

interface RulesAndConditionsInterface {
  content: Array<string>;
  needToRemoteSubmit: boolean;
  submit?: DataSourceInterface;
}

export interface ProductInterface {
  id: string;
  name: string;
  stages: Array<StageInterface>;
  submit?: DataSourceInterface;
}

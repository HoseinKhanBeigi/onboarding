import {StateMachineConfigInterface} from './stateMachineConfig.interface';

export interface StateMachineInterface {
  id: string;
  name: string;
  stateMachineConfig: StateMachineConfigInterface;
}

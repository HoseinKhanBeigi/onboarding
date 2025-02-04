import { useMemo } from 'react';
import { useMachine } from '@xstate/react';
import { Machine } from 'xstate';
import { actions, guards } from './index';
import { mergeApplicationIntoContext } from './actions';

export default function useXStateMachine(
  currentStage: string,
  stateMachineConfig: any,
  application?: any,
): {
  currentStage: string;
  updateState: (param: string, response?: object) => void;
  buttons: Array<string>;
} {
  const withActionConfig = useMemo(
    () =>
      Machine<any, any>(stateMachineConfig).withConfig(
        {
          guards,
          actions,
          activities: {},
          services: {},
        },
        mergeApplicationIntoContext(application, stateMachineConfig.context),
      ),
    [stateMachineConfig],
  );

  withActionConfig.config.initial = currentStage;
  const [current, send] = useMachine(withActionConfig);

  const updateState = (status, response?: object) => {
    if (response) {
      send('UPDATE-XSTATE-CONTEXT', response);
      send(status, response);
    } else {
      send(status);
    }
  };

  return {
    currentStage: current.value as string,
    buttons: current.context.onboardingStages[current.value as string]
      ?.buttons as Array<string>,
    updateState,
  };
}

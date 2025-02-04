import { assign } from 'xstate';
import { ResponseInterface } from '../interfaces/Xstate';
import { StageUtils } from '../lib/StageUtils';

export const countRetries = assign<object>({
  retries: (context: { retries: number }, event) => context.retries + 1,
});

export function mergeApplicationIntoContext(application, context) {
  if (!application.applicationInfo) {
    return { ...context };
  }
  const stages = application.stages.reduce(
    (o, key) => ({
      ...o,
      [key.stageType]: {
        state: key.state,
        isEnabled: key.isEnabled,
        order: key.order,
      },
    }),
    {},
  );
  Object.keys(context.onboardingStages)
    .filter(
      key =>
        !(key in stages) && context.onboardingStages[key]?.contains?.length > 0,
    )
    .forEach(key => {
      const [state, isEnabled] = StageUtils.stageStateGenerator(
        key,
        application,
        context.onboardingStages[key]?.contains,
      );
      stages[key] = { state, isEnabled };
    });
  const onboardingStages = (() => {
    const onboardingStagesMap = {};
    for (const stage in context.onboardingStages) {
      if (context.onboardingStages.hasOwnProperty(stage)) {
        onboardingStagesMap[stage] = {
          ...context.onboardingStages[stage],
        };
        if (stages.hasOwnProperty(stage)) {
          onboardingStagesMap[stage] = {
            ...onboardingStagesMap[stage],
            ...stages[stage],
          };
        }
      }
    }
    return onboardingStagesMap;
  })();
  const updatedContext = {
    applicationStatus: application.applicationInfo.applicationStatus,
    stagingState: application.applicationInfo.stagingState,
    currentStage: application.applicationInfo.currentStage,
    applicationFinalStatus: application.applicationInfo.applicationFinalStatus,
    onboardingStages,
  };
  return {
    ...context,
    ...updatedContext,
  };
}

export const updateContext = assign<any>(
  (context, event: ResponseInterface) => {
    return mergeApplicationIntoContext(event, context);
  },
);

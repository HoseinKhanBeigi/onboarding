import {StringUtils} from '../lib/StringUtils';

export const canEditThisStage = ({ onboardingStages }, event, { state }) => {
  return (
    onboardingStages[state.value].isEnabled &&
    onboardingStages[state.value].state !== 'LOCKED'
  );
};

export const inProgress = ({
  applicationStatus,
  applicationFinalStatus,
  currentStage,
}) => {
  return (
    (applicationFinalStatus !== 'WON' && applicationStatus === 'IN_PROGRESS') ||
    StringUtils.isItFilled(currentStage)
  );
};

export const isLocked = ({ onboardingStages }, secondValue, { state }) => {
  const currentStage = onboardingStages[state.value];
  if (state.event.type === 'UPDATE-XSTATE-CONTEXT') {
    return false;
  } else {
    return !currentStage.isEnabled;
  }
};

export const readyToSubmit = ({
  applicationStatus,
  currentStage,
  stagingState,
}) => {
  return (
    ['IN_PROGRESS', 'SUBMITTED'].includes(applicationStatus) &&
    !['PENDING', 'PENDING_KYC'].includes(stagingState) &&
    !StringUtils.isItFilled(currentStage)
  );
};

export const isPending = ({ stagingState }) => {
  return ['PENDING', 'PENDING_KYC'].includes(stagingState);
};

export const isApproved = ({ applicationStatus }) => {
  return applicationStatus === 'APPROVED';
};

export const isWon = ({ applicationFinalStatus }) => {
  return applicationFinalStatus === 'WON';
};

export const enableSubmitButton = ({ currentStage, stagingState }, event) => {
  return !currentStage && stagingState === 'DATA_ENTRY';
};

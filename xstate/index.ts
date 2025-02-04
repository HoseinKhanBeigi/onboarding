import {countRetries, updateContext} from './actions';

import {inProgress, isApproved, isLocked, isPending, isWon, readyToSubmit,} from './guards';

export const actions = {
  countRetries,
  updateContext,
};

export const guards = {
  inProgress,
  readyToSubmit,
  isPending,
  isWon,
  isApproved,
  isLocked,
};

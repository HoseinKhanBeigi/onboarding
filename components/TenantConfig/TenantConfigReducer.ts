const Actions = {
  BULK_SAVE: 'BULK_SAVE',
  DELETE: 'DELETE',
};

export function saveKeys(payload) {
  return {
    type: Actions.BULK_SAVE,
    payload,
  };
}

export function deleteKey(payload) {
  return {
    type: Actions.DELETE,
    payload,
  };
}

export const TenantConfigReducer = (state, action) => {
  if (action.type === Actions.BULK_SAVE) {
    const map = state || {};
    Object.keys(action.payload).forEach(key => {
      map[key] = action.payload[key];
    });
    return { ...map };
  } else if (action.type === Actions.DELETE) {
    const { [action.payload.key]: target, ...map } = state || {};
    return { ...map };
  } else {
    return state;
  }
};

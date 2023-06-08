import produce from 'immer';
import pluginId from '../pluginId';
import defaultState from './useConfig/defaultState';

export const RESOLVE_CONFIG = `${pluginId}/config/resolve-config`;

export const initialState = {
  isLoading: true,
  ...defaultState,
};

const localeReducer = produce((draftState = initialState, action = {}) => {
  switch (action.type) {
    case RESOLVE_CONFIG: {
      draftState.isLoading = false;
      draftState.config = action.config;
      break;
    }

    default:
      return draftState;
  }

  return draftState;
});

export const reducerPrefix = `${pluginId}_config`;

const reducers = {
  [reducerPrefix]: localeReducer,
};

export default reducers;

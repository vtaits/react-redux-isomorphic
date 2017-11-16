import {
  LOAD_CONTEXT,
  LOAD_CONTEXT_SUCCESS,
  LOAD_CONTEXT_ERROR,

  DESTROY,
} from './actionsTypes';

export function loadContext(ssrId) {
  return {
    type: LOAD_CONTEXT,
    payload: {
      ssrId,
    },
  };
}

export function loadContextSuccess(ssrId, context) {
  return {
    type: LOAD_CONTEXT_SUCCESS,
    payload: {
      ssrId,
      context,
    },
  };
}

export function loadContextError(ssrId, error) {
  return {
    type: LOAD_CONTEXT_ERROR,
    payload: {
      ssrId,
      error,
    },
  };
}

export function destroy(ssrId) {
  return {
    type: DESTROY,
    payload: {
      ssrId,
    },
  };
}

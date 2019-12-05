import {
  LOAD_CONTEXT,
  RELOAD_CONTEXT,
  LOAD_CONTEXT_SUCCESS,
  LOAD_CONTEXT_ERROR,

  DESTROY,
} from './actionsTypes';

export function loadContext(isomorphicId) {
  return {
    type: LOAD_CONTEXT,
    payload: {
      isomorphicId,
    },
  };
}

export function reloadContext(isomorphicId) {
  return {
    type: RELOAD_CONTEXT,
    payload: {
      isomorphicId,
    },
  };
}

export function loadContextSuccess(isomorphicId, context) {
  return {
    type: LOAD_CONTEXT_SUCCESS,
    payload: {
      isomorphicId,
      context,
    },
  };
}

export function loadContextError(isomorphicId, error) {
  return {
    type: LOAD_CONTEXT_ERROR,
    payload: {
      isomorphicId,
      error,
    },
  };
}

export function destroy(isomorphicId) {
  return {
    type: DESTROY,
    payload: {
      isomorphicId,
    },
  };
}

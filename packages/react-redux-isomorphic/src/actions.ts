import {
  LOAD_CONTEXT,
  RELOAD_CONTEXT,
  LOAD_CONTEXT_SUCCESS,
  LOAD_CONTEXT_ERROR,

  DESTROY,
} from './actionsTypes';

export type LoadContextAction = {
  type: typeof LOAD_CONTEXT;
  payload: {
    isomorphicId: string;
  };
};

export const loadContext = (isomorphicId: string): LoadContextAction => ({
  type: LOAD_CONTEXT,
  payload: {
    isomorphicId,
  },
});

export type ReloadContextAction = {
  type: typeof RELOAD_CONTEXT;
  payload: {
    isomorphicId: string;
  };
};

export const reloadContext = (isomorphicId: string): ReloadContextAction => ({
  type: RELOAD_CONTEXT,
  payload: {
    isomorphicId,
  },
});

export type LoadContextSuccessAction<IsomorphicContext> = {
  type: typeof LOAD_CONTEXT_SUCCESS;
  payload: {
    isomorphicId: string;
    context: IsomorphicContext;
  };
};

export const loadContextSuccess = <IsomorphicContext>(
  isomorphicId: string,
  context: IsomorphicContext,
): LoadContextSuccessAction<IsomorphicContext> => ({
    type: LOAD_CONTEXT_SUCCESS,
    payload: {
      isomorphicId,
      context,
    },
  });

export type LoadContextErrorAction<IsomorphicError> = {
  type: typeof LOAD_CONTEXT_ERROR;
  payload: {
    isomorphicId: string;
    error: IsomorphicError;
  };
};

export const loadContextError = <IsomorphicError>(
  isomorphicId: string,
  error: IsomorphicError,
): LoadContextErrorAction<IsomorphicError> => ({
    type: LOAD_CONTEXT_ERROR,
    payload: {
      isomorphicId,
      error,
    },
  });

export type DestroyAction = {
  type: typeof DESTROY;
  payload: {
    isomorphicId: string;
  };
};

export const destroy = (isomorphicId: string): DestroyAction => ({
  type: DESTROY,
  payload: {
    isomorphicId,
  },
});

export type IsomorphicAction<IsomorphicContext, IsomorphicError> =
  | LoadContextAction
  | ReloadContextAction
  | LoadContextSuccessAction<IsomorphicContext>
  | LoadContextErrorAction<IsomorphicError>
  | DestroyAction;

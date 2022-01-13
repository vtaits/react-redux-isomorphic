import invariant from 'invariant';

import {
  LOAD_CONTEXT,
  RELOAD_CONTEXT,
  LOAD_CONTEXT_SUCCESS,
  LOAD_CONTEXT_ERROR,

  DESTROY,
} from './actionsTypes';

import type {
  LoadContextSuccessAction,
  LoadContextErrorAction,
  IsomorphicAction,
} from './actions';

import type {
  SingleState,
  FullState,
} from './types';

export const initialState: FullState = {
  pendingComponents: [],
  componentsParams: {},
};

export const componentInitialState = {
  isReady: false,
  isLoading: false,
  isReloading: false,
  context: null,
  error: null,
};

export const componentReducer = <IsomorphicContext, IsomorphicError>(
  prevState: SingleState<IsomorphicContext, IsomorphicError>,
  action: IsomorphicAction<IsomorphicContext, IsomorphicError>,
): SingleState<IsomorphicContext, IsomorphicError> => {
  const state = prevState || componentInitialState;

  switch (action.type) {
    case LOAD_CONTEXT:
      return {
        ...state,
        isLoading: true,
      };

    case RELOAD_CONTEXT:
      return {
        ...state,
        isLoading: true,
        isReloading: true,
      };

    case LOAD_CONTEXT_SUCCESS:
      return {
        ...state,
        isReady: true,
        isLoading: false,
        isReloading: false,
        context: (action as LoadContextSuccessAction<IsomorphicContext>).payload.context,
      };

    case LOAD_CONTEXT_ERROR:
      return {
        ...state,
        isReady: true,
        isLoading: false,
        isReloading: false,
        error: (action as LoadContextErrorAction<IsomorphicError>).payload.error,
      };

    case DESTROY:
      return componentInitialState;

    default:
      return state;
  }
};

const reactReduxIsomorphic = (
  prevState: FullState,
  action: IsomorphicAction<any, any>,
): FullState => {
  const state = prevState || initialState;

  switch (action.type) {
    case LOAD_CONTEXT:
      invariant(
        !state.pendingComponents.includes(action.payload.isomorphicId),
        `Duplication of components with isomorphicId "${action.payload.isomorphicId}"`,
      );

      return {
        ...state,

        pendingComponents: state.pendingComponents
          .concat([action.payload.isomorphicId]),

        componentsParams: {
          ...state.componentsParams,
          [action.payload.isomorphicId]: componentReducer(
            state.componentsParams[action.payload.isomorphicId],
            action,
          ),
        },
      };

    case RELOAD_CONTEXT:
      if (!state.componentsParams[action.payload.isomorphicId]) {
        return state;
      }

      return {
        ...state,

        componentsParams: {
          ...state.componentsParams,
          [action.payload.isomorphicId]: componentReducer(
            state.componentsParams[action.payload.isomorphicId],
            action,
          ),
        },
      };

    case LOAD_CONTEXT_SUCCESS:
      if (!state.componentsParams[action.payload.isomorphicId]) {
        return state;
      }

      return {
        ...state,

        pendingComponents: state.pendingComponents
          .filter((pendingIsomorphicId) => pendingIsomorphicId !== action.payload.isomorphicId),

        componentsParams: {
          ...state.componentsParams,
          [action.payload.isomorphicId]: componentReducer(
            state.componentsParams[action.payload.isomorphicId],
            action,
          ),
        },
      };

    case LOAD_CONTEXT_ERROR:
      if (!state.componentsParams[action.payload.isomorphicId]) {
        return state;
      }

      return {
        ...state,

        pendingComponents: state.pendingComponents
          .filter((pendingIsomorphicId) => pendingIsomorphicId !== action.payload.isomorphicId),

        componentsParams: {
          ...state.componentsParams,
          [action.payload.isomorphicId]: componentReducer(
            state.componentsParams[action.payload.isomorphicId],
            action,
          ),
        },
      };

    case DESTROY:
      invariant(
        state.componentsParams[action.payload.isomorphicId],
        `Components with isomorphicId "${action.payload.isomorphicId}" is not registered`,
      );

      return {
        ...state,

        pendingComponents: state.pendingComponents
          .filter((pendingIsomorphicId) => pendingIsomorphicId !== action.payload.isomorphicId),

        componentsParams: {
          ...state.componentsParams,
          [action.payload.isomorphicId]: componentReducer(
            state.componentsParams[action.payload.isomorphicId],
            action,
          ),
        },
      };

    default:
      return state;
  }
};

export default reactReduxIsomorphic;

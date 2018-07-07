import invariant from 'invariant';

import {
  LOAD_CONTEXT,
  LOAD_CONTEXT_SUCCESS,
  LOAD_CONTEXT_ERROR,

  DESTROY,
} from './actionsTypes';

export const initialState = {
  pendingComponents: [],
  componentsParams: {},
};

export const componentInitialState = {
  isReady: false,
  isLoading: false,
  context: null,
  error: null,
};

export function componentReducer(state = componentInitialState, action) {
  switch (action.type) {
    case LOAD_CONTEXT:
      return {
        ...state,
        isLoading: true,
      };

    case LOAD_CONTEXT_SUCCESS:
      return {
        ...state,
        isReady: true,
        isLoading: false,
        context: action.payload.context,
      };

    case LOAD_CONTEXT_ERROR:
      return {
        ...state,
        isReady: true,
        isLoading: false,
        error: action.payload.error,
      };

    case DESTROY:
      return componentInitialState;

    default:
      return state;
  }
}

export default function reactReduxIsomorphic(state = initialState, action) {
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

    case LOAD_CONTEXT_SUCCESS:
      {
        const isComponentRegistered = state.pendingComponents
          .includes(action.payload.isomorphicId);

        if (!isComponentRegistered) {
          return state;
        }
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
      {
        const isComponentRegistered = state.pendingComponents
          .includes(action.payload.isomorphicId);

        if (!isComponentRegistered) {
          return state;
        }
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
}

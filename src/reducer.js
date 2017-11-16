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
  switch (action) {
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

export default function reactReduxSSR(state = initialState, action) {
  switch (action.type) {
    case LOAD_CONTEXT:
      invariant(
        !state.pendingComponents.includes(action.payload.ssrId),
        `Duplication of components with ssrId "${action.payload.ssrId}"`,
      );

      return {
        ...state,

        pendingComponents: state.pendingComponents
          .concat([action.payload.ssrId]),

        componentsParams: {
          ...state.componentsParams,
          [action.payload.ssrId]: componentReducer(
            state.componentsParams[action.payload.ssrId],
            action,
          ),
        },
      };

    case LOAD_CONTEXT_SUCCESS:
      {
        const isComponentRegistered = state.pendingComponents
          .includes(action.payload.ssrId);

        if (!isComponentRegistered) {
          return state;
        }
      }

      return {
        ...state,

        pendingComponents: state.pendingComponents
          .filter(pendingSSRId => pendingSSRId !== action.payload.ssrId),

        componentsParams: {
          ...state.componentsParams,
          [action.payload.ssrId]: componentReducer(
            state.componentsParams[action.payload.ssrId],
            action,
          ),
        },
      };

    case LOAD_CONTEXT_ERROR:
      {
        const isComponentRegistered = state.pendingComponents
          .includes(action.payload.ssrId);

        if (!isComponentRegistered) {
          return state;
        }
      }

      return {
        ...state,

        pendingComponents: state.pendingComponents
          .filter(pendingSSRId => pendingSSRId !== action.payload.ssrId),

        componentsParams: {
          ...state.componentsParams,
          [action.payload.ssrId]: componentReducer(
            state.componentsParams[action.payload.ssrId],
            action,
          ),
        },
      };

    case DESTROY:
      invariant(
        state.pendingComponents.includes(action.payload.ssrId),
        `Components with ssrId "${action.payload.ssrId}" is not registered`,
      );

      return {
        ...state,

        pendingComponents: state.pendingComponents
          .filter(pendingSSRId => pendingSSRId !== action.payload.ssrId),

        componentsParams: {
          ...state.componentsParams,
          [action.payload.ssrId]: componentReducer(
            state.componentsParams[action.payload.ssrId],
            action,
          ),
        },
      };

    default:
      return state;
  }
}

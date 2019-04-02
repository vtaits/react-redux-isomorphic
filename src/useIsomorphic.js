/**
 * Experimental feature
 * TO DO: add tests
 */

import { useContext, useEffect } from 'react';
import { ReactReduxContext } from 'react-redux';

import IsomorphicContext from './context';
import getComponentState from './getComponentState';
import { LoadContextError } from './errors';

import {
  loadContext,
  loadContextSuccess,
  loadContextError,

  destroy,
} from './actions';

const useEffectFake = (handler) => {
  handler();
};

const useIsomorphic = (isomorphicId, getContext) => {
  const {
    store,
    storeState,
  } = useContext(ReactReduxContext);
  const {
    loadParams,
    isFakeHooks,
  } = useContext(IsomorphicContext);

  const componentState = getComponentState(storeState, isomorphicId);

  const useEffectIsomorphic = isFakeHooks
    ? useEffectFake
    : useEffect;

  useEffectIsomorphic(() => {
    if (
      !componentState.isLoading
      && !componentState.isReady
    ) {
      store.dispatch(loadContext(isomorphicId));

      const requestContext = async () => {
        let context;
        let error;
        try {
          context = await getContext(loadParams);
        } catch (catchedError) {
          error = catchedError;
        }

        if (!error) {
          store.dispatch(loadContextSuccess(isomorphicId, context));
          return;
        }

        if (error instanceof LoadContextError) {
          store.dispatch(loadContextError(isomorphicId, error.error));
          return;
        }

        throw error;
      };

      requestContext();
    }

    return () => {
      store.dispatch(destroy(isomorphicId));
    };
  }, [isomorphicId]);

  return componentState;
};

export default useIsomorphic;

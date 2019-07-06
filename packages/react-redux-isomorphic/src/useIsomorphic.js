import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

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
  const componentState = useSelector((storeState) => getComponentState(storeState, isomorphicId));
  const dispatch = useDispatch();

  const {
    loadParams,
    isFakeHooks,
  } = React.useContext(IsomorphicContext);

  const useEffectIsomorphic = isFakeHooks
    ? useEffectFake
    : React.useEffect;

  useEffectIsomorphic(() => {
    if (
      !componentState.isLoading
      && !componentState.isReady
    ) {
      dispatch(loadContext(isomorphicId));

      const requestContext = async () => {
        let context;
        let error;
        try {
          context = await getContext(loadParams);
        } catch (catchedError) {
          error = catchedError;
        }

        if (!error) {
          dispatch(loadContextSuccess(isomorphicId, context));
          return;
        }

        if (error instanceof LoadContextError) {
          dispatch(loadContextError(isomorphicId, error.error));
          return;
        }

        throw error;
      };

      requestContext();
    }

    return () => {
      dispatch(destroy(isomorphicId));
    };
  }, [isomorphicId]);

  return componentState;
};

export default useIsomorphic;

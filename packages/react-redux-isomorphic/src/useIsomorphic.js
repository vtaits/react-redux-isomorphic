import React from 'react';
import { useDispatch } from 'react-redux';

import IsomorphicContext from './context';
import useComponentState from './useComponentState';
import requestContext from './requestContext';

import {
  loadContext,
  reloadContext,

  destroy,
} from './actions';

const useEffectFake = (handler) => {
  handler();
};

const useIsomorphic = (isomorphicId, getContext) => {
  const {
    isReady,
    isLoading,
    isReloading,
    context,
    error,
  } = useComponentState(isomorphicId);

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
      !isLoading
      && !isReady
    ) {
      dispatch(loadContext(isomorphicId));

      requestContext(
        isomorphicId,
        getContext,
        loadParams,
        dispatch,
      );
    }

    return () => {
      dispatch(destroy(isomorphicId));
    };
  }, [isomorphicId]);

  const reload = React.useCallback(
    () => {
      if (isLoading) {
        return;
      }

      dispatch(reloadContext(isomorphicId));

      requestContext(
        isomorphicId,
        getContext,
        loadParams,
        dispatch,
      );
    },

    [isomorphicId, isLoading, getContext],
  );

  return {
    isReady,
    isLoading,
    isReloading,
    context,
    error,

    reload,
  };
};

export default useIsomorphic;

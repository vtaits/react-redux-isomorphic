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

import type {
  UseIsomorphicResult,
} from './types';

const useEffectFake: typeof React.useEffect = (handler) => {
  handler();
};

const useIsomorphic = <LoadParams, IsomorphicContext, IsomorphicError = Error>(
  isomorphicId: string,
  getContext: (loadParams: LoadParams) => IsomorphicContext | Promise<IsomorphicContext>,
): UseIsomorphicResult<IsomorphicContext, IsomorphicError> => {
  const {
    isReady,
    isLoading,
    isReloading,
    context,
    error,
  } = useComponentState<IsomorphicContext, IsomorphicError>(isomorphicId);

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

      requestContext<LoadParams, IsomorphicContext, IsomorphicError>(
        isomorphicId,
        getContext,
        loadParams as LoadParams,
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

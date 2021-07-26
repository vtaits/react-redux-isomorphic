import type {
  Dispatch,
} from 'redux';

import { LoadContextError } from './errors';

import {
  loadContextSuccess,
  loadContextError,
} from './actions';

import type {
  DefaultLoadParams,
} from './types';

const requestContext = async <
IsomorphicContext,
IsomorphicError,
LoadParams = DefaultLoadParams,
>(
  isomorphicId: string,
  getContext: (loadParams: LoadParams) => IsomorphicContext | Promise<IsomorphicContext>,
  loadParams: LoadParams,
  dispatch: Dispatch,
): Promise<void> => {
  let context: IsomorphicContext;
  let error: IsomorphicError;
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

  // eslint-disable-next-line @typescript-eslint/no-throw-literal
  throw error;
};

export default requestContext;

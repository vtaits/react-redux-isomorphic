import type {
  Dispatch,
} from 'redux';

import { LoadContextError } from './errors';

import {
  loadContextSuccess,
  loadContextError,
} from './actions';

const requestContext = async <LoadParams, IsomorphicContext, IsomorphicError>(
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

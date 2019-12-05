import { LoadContextError } from './errors';

import {
  loadContextSuccess,
  loadContextError,
} from './actions';

const requestContext = async (
  isomorphicId,
  getContext,
  loadParams,
  dispatch,
) => {
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

export default requestContext;

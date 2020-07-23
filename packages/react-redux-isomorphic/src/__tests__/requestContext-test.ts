import {
  loadContextSuccess,
  loadContextError,
} from '../actions';
import { LoadContextError } from '../errors';

import requestContext from '../requestContext';

afterEach(() => {
  jest.clearAllMocks();
});

const loadParams = Symbol('Load params');

test('should request context successfully', async () => {
  const isomorphicContext = Symbol('context');

  const getContext = jest.fn(() => isomorphicContext);

  const dispatch = jest.fn();

  await requestContext(
    'testId',
    getContext,
    loadParams,
    dispatch,
  );

  expect(getContext).toHaveBeenCalledTimes(1);
  expect(getContext).toHaveBeenCalledWith(loadParams);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(loadContextSuccess('testId', isomorphicContext));
});

test('should request context with error', async () => {
  const isomorphicError = Symbol('error');

  const getContext = jest.fn(async () => {
    throw new LoadContextError(isomorphicError);
  });

  const dispatch = jest.fn();

  await requestContext(
    'testId',
    getContext,
    loadParams,
    dispatch,
  );

  expect(getContext).toHaveBeenCalledTimes(1);
  expect(getContext).toHaveBeenCalledWith(loadParams);

  expect(dispatch).toHaveBeenCalledTimes(1);
  expect(dispatch).toHaveBeenCalledWith(loadContextError('testId', isomorphicError));
});

test('should throw error up', async () => {
  const error = new Error('test');

  const getContext = jest.fn(async () => {
    throw error;
  });

  const dispatch = jest.fn();

  let catchedError;
  try {
    await requestContext(
      'testId',
      getContext,
      loadParams,
      dispatch,
    );
  } catch (e) {
    catchedError = e;
  }

  expect(getContext).toHaveBeenCalledTimes(1);
  expect(getContext).toHaveBeenCalledWith(loadParams);

  expect(dispatch).toHaveBeenCalledTimes(0);

  expect(catchedError).toBe(error);
});

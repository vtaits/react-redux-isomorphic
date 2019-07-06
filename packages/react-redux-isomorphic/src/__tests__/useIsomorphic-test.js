import React from 'react';
import * as reactRedux from 'react-redux';

import {
  loadContext,
  loadContextSuccess,
  loadContextError,

  destroy,
} from '../actions';
import { LoadContextError } from '../errors';

import useIsomorphic from '../useIsomorphic';

const waitForCalls = (mockFn, callsNumber) => new Promise((resolve) => {
  const interval = setInterval(() => {
    if (mockFn.mock.calls.length >= callsNumber) {
      clearInterval(interval);

      resolve();
    }
  }, 5);
});

afterEach(() => {
  jest.clearAllMocks();
});

const loadParams = Symbol('Load params');

const defaultUseContext = () => ({
  isFakeHooks: false,
  loadParams,
});

const mock = ({
  useContext = defaultUseContext,
  useEffect = Function.prototype,
  useSelector = Function.prototype,
  dispatch = Function.prototype,
}) => {
  jest.spyOn(React, 'useContext').mockImplementation(useContext);

  jest.spyOn(React, 'useEffect').mockImplementation(useEffect);
  jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);
  jest.spyOn(reactRedux, 'useSelector').mockImplementation(useSelector);
};

test('should return response of useSelector', () => {
  const componentState = Symbol('Component state');

  mock({
    useSelector: () => componentState,
  });

  expect(useIsomorphic()).toBe(componentState);
});

test('should provide isomorphicId to useEffect', () => {
  const useEffect = jest.fn();

  mock({
    useEffect,
  });

  useIsomorphic('testId');

  expect(useEffect.mock.calls[0][1]).toEqual(['testId']);
});

test('should not load anything for loading component', () => {
  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    isLoading: true,
  };

  mock({
    useSelector: () => componentState,

    dispatch,
    useEffect,
  });

  useIsomorphic();

  const effect = useEffect.mock.calls[0][0];

  effect();

  expect(dispatch.mock.calls.length).toBe(0);
});

test('should not load anything for ready component', () => {
  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    isReady: true,
  };

  mock({
    useSelector: () => componentState,

    dispatch,
    useEffect,
  });

  useIsomorphic();

  const effect = useEffect.mock.calls[0][0];

  effect();

  expect(dispatch.mock.calls.length).toBe(0);
});

test('should request context successfully', async () => {
  const isomorphicContext = Symbol('context');

  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    isLoading: false,
    isReady: false,
  };

  mock({
    useSelector: () => componentState,

    dispatch,
    useEffect,
  });

  useIsomorphic('testId', async () => isomorphicContext);

  const effect = useEffect.mock.calls[0][0];

  effect();

  expect(dispatch.mock.calls.length).toBe(1);
  expect(dispatch.mock.calls[0][0]).toEqual(loadContext('testId'));

  await waitForCalls(dispatch, 2);

  expect(dispatch.mock.calls.length).toBe(2);
  expect(dispatch.mock.calls[1][0]).toEqual(loadContextSuccess('testId', isomorphicContext));
});

test('should request context with error', async () => {
  const isomorphicError = Symbol('error');

  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    isLoading: false,
    isReady: false,
  };

  mock({
    useSelector: () => componentState,

    dispatch,
    useEffect,
  });

  useIsomorphic('testId', async () => {
    throw new LoadContextError(isomorphicError);
  });

  const effect = useEffect.mock.calls[0][0];

  effect();

  expect(dispatch.mock.calls.length).toBe(1);
  expect(dispatch.mock.calls[0][0]).toEqual(loadContext('testId'));

  await waitForCalls(dispatch, 2);

  expect(dispatch.mock.calls.length).toBe(2);
  expect(dispatch.mock.calls[1][0]).toEqual(loadContextError('testId', isomorphicError));
});

test('should destroy with useEffect', () => {
  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    isLoading: false,
    isReady: false,
  };

  mock({
    useSelector: () => componentState,

    dispatch,
    useEffect,
  });

  useIsomorphic('testId', async () => null);

  const effect = useEffect.mock.calls[0][0];

  const destroyEffect = effect();

  expect(dispatch.mock.calls.length).toBe(1);
  expect(dispatch.mock.calls[0][0]).toEqual(loadContext('testId'));

  destroyEffect();

  expect(dispatch.mock.calls.length).toBe(2);
  expect(dispatch.mock.calls[1][0]).toEqual(destroy('testId'));
});

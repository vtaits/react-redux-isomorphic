import React from 'react';
import * as reactRedux from 'react-redux';

import {
  loadContext,
  reloadContext,
  destroy,
} from '../actions';

import useIsomorphic from '../useIsomorphic';

import * as requestContextModule from '../requestContext';

afterEach(() => {
  jest.clearAllMocks();
});

const loadParams = Symbol('Load params');

const defaultUseContext = () => ({
  isFakeHooks: false,
  loadParams,
});

const mock = ({
  requestContext = () => Promise.resolve(),
  useContext = defaultUseContext,
  useEffect = () => {},
  useCallback = () => () => {},
  componentState = null,
  dispatch = () => null,
}) => {
  jest.spyOn(React, 'useContext').mockImplementation(useContext);
  jest.spyOn(React, 'useEffect').mockImplementation(useEffect);
  jest.spyOn(React, 'useCallback').mockImplementation(useCallback);

  jest.spyOn(reactRedux, 'useDispatch').mockImplementation(() => dispatch);
  jest.spyOn(reactRedux, 'useSelector').mockImplementation(() => componentState);

  jest.spyOn(requestContextModule, 'default').mockImplementation(requestContext);
};

const defaultComponentState = {
  isReady: false,
  isLoading: false,
  isReloading: false,
  context: Symbol('Component state'),
  error: null,
};

test('should return response of useComponentState', () => {
  const componentState = defaultComponentState;

  mock({
    componentState,
  });

  const {
    isReady,
    isLoading,
    isReloading,
    context,
    error,
  } = useIsomorphic('testId', () => null);

  expect(isReady).toBe(componentState.isReady);
  expect(isLoading).toBe(componentState.isLoading);
  expect(isReloading).toBe(componentState.isReloading);
  expect(context).toBe(componentState.context);
  expect(error).toBe(componentState.error);
});

test('should provide isomorphicId to useEffect', () => {
  const useEffect = jest.fn();

  mock({
    useEffect,
    componentState: defaultComponentState,
  });

  useIsomorphic('testId', () => null);

  expect(useEffect.mock.calls[0][1]).toEqual(['testId']);
});

test('should not load anything for loading component', () => {
  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    ...defaultComponentState,
    isLoading: true,
  };

  mock({
    componentState,
    dispatch,
    useEffect,
  });

  useIsomorphic('testId', () => null);

  const effect = useEffect.mock.calls[0][0];

  effect();

  expect(dispatch.mock.calls.length).toBe(0);
});

test('should not load anything for ready component', () => {
  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    ...defaultComponentState,
    isReady: true,
  };

  mock({
    componentState,
    dispatch,
    useEffect,
  });

  useIsomorphic('testId', () => null);

  const effect = useEffect.mock.calls[0][0];

  effect();

  expect(dispatch.mock.calls.length).toBe(0);
});

test('should request context', async () => {
  const requestContext = jest.fn();
  const isomorphicContext = Symbol('context');

  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    ...defaultComponentState,
    isLoading: false,
    isReady: false,
  };

  mock({
    requestContext,
    componentState,
    dispatch,
    useEffect,
  });

  const getContext = async () => isomorphicContext;

  useIsomorphic('testId', getContext);

  const effect = useEffect.mock.calls[0][0];

  effect();

  expect(dispatch.mock.calls.length).toBe(1);
  expect(dispatch.mock.calls[0][0]).toEqual(loadContext('testId'));

  expect(requestContext.mock.calls.length).toBe(1);
  expect(requestContext.mock.calls[0][0]).toBe('testId');
  expect(requestContext.mock.calls[0][1]).toBe(getContext);
  expect(requestContext.mock.calls[0][2]).toBe(loadParams);
  expect(requestContext.mock.calls[0][3]).toBe(dispatch);
});

test('should destroy with useEffect', () => {
  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    ...defaultComponentState,
    isLoading: false,
    isReady: false,
  };

  mock({
    componentState,
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

test('should not reload loading component', () => {
  const isomorphicContext = Symbol('context');
  const dispatch = jest.fn();
  const useCallback = jest.fn()
    .mockImplementation((fn) => fn);

  const componentState = {
    ...defaultComponentState,
    isLoading: true,
  };

  mock({
    componentState,
    dispatch,
    useCallback,
  });

  const getContext = async () => isomorphicContext;

  const {
    reload,
  } = useIsomorphic('testId', getContext);

  expect(useCallback.mock.calls[0][1]).toEqual([
    'testId',
    true,
    getContext,
  ]);

  reload();

  expect(dispatch.mock.calls.length).toBe(0);
});

test('should reload component', () => {
  const requestContext = jest.fn();
  const isomorphicContext = Symbol('context');
  const useCallback = jest.fn()
    .mockImplementation((fn) => fn);

  const dispatch = jest.fn();
  const useEffect = jest.fn();

  const componentState = {
    ...defaultComponentState,
    isLoading: false,
    isReady: true,
  };

  mock({
    useCallback,
    requestContext,
    componentState,
    dispatch,
    useEffect,
  });

  const getContext = async () => isomorphicContext;

  const {
    reload,
  } = useIsomorphic('testId', getContext);

  expect(useCallback.mock.calls[0][1]).toEqual([
    'testId',
    false,
    getContext,
  ]);

  reload();

  expect(dispatch.mock.calls.length).toBe(1);
  expect(dispatch.mock.calls[0][0]).toEqual(reloadContext('testId'));

  expect(requestContext.mock.calls.length).toBe(1);
  expect(requestContext.mock.calls[0][0]).toBe('testId');
  expect(requestContext.mock.calls[0][1]).toBe(getContext);
  expect(requestContext.mock.calls[0][2]).toBe(loadParams);
  expect(requestContext.mock.calls[0][3]).toBe(dispatch);
});

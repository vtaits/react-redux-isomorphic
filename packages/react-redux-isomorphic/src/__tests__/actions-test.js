import { isFSA } from 'flux-standard-action';

import {
  LOAD_CONTEXT,
  RELOAD_CONTEXT,
  LOAD_CONTEXT_SUCCESS,
  LOAD_CONTEXT_ERROR,
  DESTROY,
} from '../actionsTypes';

import {
  loadContext,
  reloadContext,
  loadContextSuccess,
  loadContextError,
  destroy,
} from '../actions';

test('loadContext action is FSA', () => {
  expect(isFSA(loadContext(1))).toBeTruthy();
});

test('should create loadContext action', () => {
  expect(loadContext(1))
    .toEqual({
      type: LOAD_CONTEXT,
      payload: {
        isomorphicId: 1,
      },
    });
});

test('reloadContext action is FSA', () => {
  expect(isFSA(reloadContext(1))).toBeTruthy();
});

test('should create reloadContext action', () => {
  expect(reloadContext(1))
    .toEqual({
      type: RELOAD_CONTEXT,
      payload: {
        isomorphicId: 1,
      },
    });
});

test('loadContextSuccess action is FSA', () => {
  expect(isFSA(loadContextSuccess(1, {
    test: 'value',
  }))).toBeTruthy();
});

test('should create loadContextSuccess action', () => {
  expect(loadContextSuccess(1, {
    test: 'value',
  }))
    .toEqual({
      type: LOAD_CONTEXT_SUCCESS,
      payload: {
        isomorphicId: 1,
        context: {
          test: 'value',
        },
      },
    });
});

test('loadContextError action is FSA', () => {
  expect(isFSA(loadContextError(1, {
    test: 'value',
  }))).toBeTruthy();
});

test('should create loadContextError action', () => {
  expect(loadContextError(1, {
    test: 'value',
  }))
    .toEqual({
      type: LOAD_CONTEXT_ERROR,
      payload: {
        isomorphicId: 1,
        error: {
          test: 'value',
        },
      },
    });
});

test('destroy action is FSA', () => {
  expect(isFSA(loadContextError(1, {
    test: 'value',
  }))).toBeTruthy();
});

test('should create destroy action', () => {
  expect(destroy(1))
    .toEqual({
      type: DESTROY,
      payload: {
        isomorphicId: 1,
      },
    });
});

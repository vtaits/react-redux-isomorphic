import {
  loadContext,
  loadContextSuccess,
  loadContextError,
  destroy,
} from '../actions';

import reducer, { initialState, componentInitialState } from '../reducer';

test('should work with empty state', () => {
  expect(reducer(undefined, {
    type: 'CUSTOM_ACTION',
  })).toEqual(initialState);
});

test('should respond loadContext action', () => {
  let state = reducer(undefined, loadContext('test1'));

  expect(state.pendingComponents).toEqual(['test1']);
  expect(state.componentsParams).toEqual({
    test1: {
      ...componentInitialState,
      isLoading: true,
    },
  });

  state = reducer(state, loadContext('test2'));

  expect(state.pendingComponents).toEqual(['test1', 'test2']);
  expect(state.componentsParams).toEqual({
    test1: {
      ...componentInitialState,
      isLoading: true,
    },
    test2: {
      ...componentInitialState,
      isLoading: true,
    },
  });
});

test('should throw error if loadContext calls multiple times with same isomorphicId', () => {
  expect(() => {
    const state = reducer(undefined, loadContext('test1'));
    reducer(state, loadContext('test1'));
  }).toThrow();
});

test('should respond loadContextSuccess action', () => {
  let state = reducer(undefined, loadContext('test1'));
  state = reducer(state, loadContext('test2'));

  state = reducer(state, loadContextSuccess('test1', {
    testProp1: 'value1',
  }));

  expect(state.pendingComponents).toEqual(['test2']);
  expect(state.componentsParams).toEqual({
    test1: {
      ...componentInitialState,
      isReady: true,
      isLoading: false,
      context: {
        testProp1: 'value1',
      },
    },
    test2: {
      ...componentInitialState,
      isLoading: true,
    },
  });

  state = reducer(state, loadContextSuccess('test2', {
    testProp2: 'value2',
  }));

  expect(state.pendingComponents).toEqual([]);
  expect(state.componentsParams).toEqual({
    test1: {
      ...componentInitialState,
      isReady: true,
      isLoading: false,
      context: {
        testProp1: 'value1',
      },
    },
    test2: {
      ...componentInitialState,
      isReady: true,
      isLoading: false,
      context: {
        testProp2: 'value2',
      },
    },
  });
});

test('should respond loadContextError action', () => {
  let state = reducer(undefined, loadContext('test1'));
  state = reducer(state, loadContext('test2'));

  state = reducer(state, loadContextError('test1', {
    testProp1: 'value1',
  }));

  expect(state.pendingComponents).toEqual(['test2']);
  expect(state.componentsParams).toEqual({
    test1: {
      ...componentInitialState,
      isReady: true,
      isLoading: false,
      error: {
        testProp1: 'value1',
      },
    },
    test2: {
      ...componentInitialState,
      isLoading: true,
    },
  });

  state = reducer(state, loadContextError('test2', {
    testProp2: 'value2',
  }));

  expect(state.pendingComponents).toEqual([]);
  expect(state.componentsParams).toEqual({
    test1: {
      ...componentInitialState,
      isReady: true,
      isLoading: false,
      error: {
        testProp1: 'value1',
      },
    },
    test2: {
      ...componentInitialState,
      isReady: true,
      isLoading: false,
      error: {
        testProp2: 'value2',
      },
    },
  });
});

test('should respond destroy action', () => {
  let state = reducer(undefined, loadContext('test1'));
  state = reducer(state, loadContextSuccess('test1', {
    testProp1: 'value1',
  }));

  state = reducer(state, destroy('test1'));

  expect(state.pendingComponents).toEqual([]);
  expect(state.componentsParams).toEqual({
    test1: componentInitialState,
  });
});

test('should throw error on destroy action if component is not registered', () => {
  expect(() => {
    reducer(undefined, destroy('test1'));
  }).toThrow();
});

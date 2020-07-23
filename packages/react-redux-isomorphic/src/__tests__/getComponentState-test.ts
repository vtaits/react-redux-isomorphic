import { componentInitialState } from '../reducer';

import getComponentState from '../getComponentState';

test('should return state of component if defined', () => {
  const testState = {
    isReady: true,
    isLoading: false,
    isReloading: false,
    context: 'test',
    error: null,
  };

  const storeState = {
    reactReduxIsomorphic: {
      componentsParams: {
        test: testState,
      },

      pendingComponents: [],
    },
  };

  expect(getComponentState(storeState, 'test')).toBe(testState);
});

test('should return initial state if not defined', () => {
  const storeState = {
    reactReduxIsomorphic: {
      componentsParams: {},
      pendingComponents: [],
    },
  };

  expect(getComponentState(storeState, 'test')).toBe(componentInitialState);
});

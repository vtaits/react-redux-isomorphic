import type {
  Store,
} from 'redux';

import {
  waitForContext,
} from '../waitForContext';

import type {
  StoreState,
} from '../types';

const createStore = (initialState: StoreState): Store<StoreState> => {
  let state: StoreState = initialState;
  let listeners = [];

  return {
    subscribe: (listener) => {
      listeners.push(listener);

      return () => {
        listeners = listeners
          .filter((registeredListener) => registeredListener !== listener);
      };
    },

    dispatch: ({
      payload: newState,
    }: {
      payload: StoreState;
    }) => {
      state = newState;

      listeners.forEach((listener) => {
        listener();
      });
    },

    getState: () => state,
  } as Store<StoreState>;
};

test('should call if pendingComponents length is 0', async (done) => {
  const store = createStore({
    reactReduxIsomorphic: {
      componentsParams: {},
      pendingComponents: [],
    },
  });

  await waitForContext(store);

  done();
});

test('should call after pendingComponents length is becoming 0', async () => {
  const store = createStore({
    reactReduxIsomorphic: {
      componentsParams: {},
      pendingComponents: ['test1', 'test2'],
    },
  });

  let call1 = false;
  let call2 = false;
  let call3 = false;

  setTimeout(() => {
    call1 = true;

    store.dispatch({
      type: 'TEST',
      payload: {
        reactReduxIsomorphic: {
          pendingComponents: ['test1'],
        },
      },
    });

    setTimeout(() => {
      call2 = true;

      store.dispatch({
        type: 'TEST',
        payload: {
          reactReduxIsomorphic: {
            pendingComponents: [],
          },
        },
      });

      setTimeout(() => {
        call3 = true;

        store.dispatch({
          type: 'TEST',
          payload: {
            reactReduxIsomorphic: {
              pendingComponents: [],
            },
          },
        });
      });
    });
  });

  await waitForContext(store);

  expect(call1).toBe(true);
  expect(call2).toBe(true);
  expect(call3).toBe(false);
});

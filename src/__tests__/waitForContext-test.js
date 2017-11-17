import waitForContext from '../waitForContext';

const createStore = (initialState) => {
  let state = initialState;
  let listeners = [];

  return {
    subscribe: (listener) => {
      listeners.push(listener);

      return () => {
        listeners = listeners
          .filter(registeredListener => registeredListener !== listener);
      };
    },

    dispatch: (newState) => {
      state = newState;

      listeners.forEach((listener) => {
        listener();
      });
    },

    getState: () => state,
  };
};

test('should call if pendingComponents length is 0', async (done) => {
  const store = createStore({
    reactReduxSSR: {
      pendingComponents: [],
    },
  });

  await waitForContext(store);

  done();
});

test('should call after pendingComponents length is becoming 0', async () => {
  const store = createStore({
    reactReduxSSR: {
      pendingComponents: ['test1', 'test2'],
    },
  });

  let call1 = false;
  let call2 = false;
  let call3 = false;

  setTimeout(() => {
    call1 = true;

    store.dispatch({
      reactReduxSSR: {
        pendingComponents: ['test1'],
      },
    });

    setTimeout(() => {
      call2 = true;

      store.dispatch({
        reactReduxSSR: {
          pendingComponents: [],
        },
      });

      setTimeout(() => {
        call3 = true;

        store.dispatch({
          reactReduxSSR: {
            pendingComponents: [],
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

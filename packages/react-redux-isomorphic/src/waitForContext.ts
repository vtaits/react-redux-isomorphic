import type {
  Store,
} from 'redux';

import type {
  StoreState,
} from './types';

export const isAllComponentsLoaded = (
  store: Store<StoreState>,
): boolean => {
  const {
    reactReduxIsomorphic: {
      pendingComponents,
    },
  } = store.getState();

  return pendingComponents.length === 0;
};

const waitForContext = (store: Store<StoreState>): Promise<void> => {
  if (isAllComponentsLoaded(store)) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const unsubscribe = store.subscribe(() => {
      if (isAllComponentsLoaded(store)) {
        unsubscribe();

        resolve();
      }
    });
  });
};

export default waitForContext;

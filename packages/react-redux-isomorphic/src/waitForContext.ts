import type {
  Store,
} from 'redux';

import type {
  StoreState,
} from './types';

import {
  isAllComponentsLoaded,
} from './isAllComponentsLoaded';

export const waitForContext = (store: Store<StoreState>): Promise<void> => {
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

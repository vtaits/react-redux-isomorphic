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

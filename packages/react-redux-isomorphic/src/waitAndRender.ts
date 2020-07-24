import type {
  Store,
} from 'redux';

import {
  waitForContext,
} from './waitForContext';

import {
  isAllComponentsLoaded,
} from './isAllComponentsLoaded';

import type {
  StoreState,
} from './types';

export const waitAndRender = async <Result>(
  render: () => Result,
  store: Store<StoreState>,
): Promise<Result> => {
  let result: Result;

  for (
    result = render();
    !isAllComponentsLoaded(store);
    result = render()
  ) {
    // eslint-disable-next-line no-await-in-loop
    await waitForContext(store);
  }

  return result;
};

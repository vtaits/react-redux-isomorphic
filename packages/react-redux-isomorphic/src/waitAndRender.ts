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
  render: () => Result | Promise<Result>,
  store: Store<StoreState>,
): Promise<Result> => {
  let result = await render();

  while (!isAllComponentsLoaded(store)) {
    // eslint-disable-next-line no-await-in-loop
    await waitForContext(store);

    // eslint-disable-next-line no-await-in-loop
    result = await render();
  }

  return result;
};

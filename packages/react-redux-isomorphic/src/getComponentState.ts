import { componentInitialState } from './reducer';

import type {
  SingleState,
  StoreState,
} from './types';

const getComponentState = <IsomorphicContext, IsomorphicError>(
  storeState: StoreState,
  isomorphicId: string,
): SingleState<IsomorphicContext, IsomorphicError> => {
  const {
    componentsParams,
  } = storeState.reactReduxIsomorphic;

  const componentState = componentsParams[isomorphicId];

  if (componentState) {
    return componentState;
  }

  return componentInitialState;
};

export default getComponentState;

import { useSelector } from 'react-redux';

import getComponentState from './getComponentState';

import type {
  SingleState,
  StoreState,
} from './types';

const useComponentState = <IsomorphicContext, IsomorphicError>(
  isomorphicId: string,
): SingleState<IsomorphicContext, IsomorphicError> => {
  const componentState = useSelector(
    (storeState: StoreState) => getComponentState(storeState, isomorphicId),
  );

  return componentState as SingleState<IsomorphicContext, IsomorphicError>;
};

export default useComponentState;

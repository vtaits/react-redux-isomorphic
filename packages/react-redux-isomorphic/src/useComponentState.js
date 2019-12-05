import { useSelector } from 'react-redux';

import getComponentState from './getComponentState';

const useComponentState = (isomorphicId) => {
  const componentState = useSelector((storeState) => getComponentState(storeState, isomorphicId));

  return componentState;
};

export default useComponentState;

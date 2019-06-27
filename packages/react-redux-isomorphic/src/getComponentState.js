import { componentInitialState } from './reducer';

const getComponentState = (storeState, isomorphicId) => {
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

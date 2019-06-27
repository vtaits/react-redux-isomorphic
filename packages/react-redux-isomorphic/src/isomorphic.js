import { connect } from 'react-redux';
import invariant from 'invariant';

import IsomorphicWrapper from './IsomorphicWrapper';
import * as actions from './actions';

import getComponentState from './getComponentState';

export default function isomorphic({
  isomorphicId,
  getContext,
  shouldReload,
}) {
  invariant(
    typeof getContext === 'function',
    'getContext should be a function',
  );

  if (shouldReload) {
    invariant(
      typeof shouldReload === 'function',
      'shouldReload should be a function',
    );
  }

  return (component) => {
    const mapStateToProps = (storeState, componentProps) => {
      const currentIsomorphicId = isomorphicId || componentProps.isomorphicId;

      invariant(
        currentIsomorphicId,
        'isomorphicId is required in isomorphic decorated component props or decorator params',
      );

      return {
        component,
        componentProps,

        isomorphicId: currentIsomorphicId,
        isomorphic: getComponentState(storeState, currentIsomorphicId),

        getContext,
        shouldReload,
      };
    };

    const mapDispatchToProps = {
      ...actions,
    };

    return connect(mapStateToProps, mapDispatchToProps)(IsomorphicWrapper);
  };
}

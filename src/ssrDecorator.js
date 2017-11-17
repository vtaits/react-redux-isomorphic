import { connect } from 'react-redux';
import invariant from 'invariant';

import SSRWrapper from './SSRWrapper';
import * as actions from './actions';

import { componentInitialState } from './reducer';

export default function ssrDecorator({
  ssrId,
  getContext,
}) {
  invariant(
    typeof getContext === 'function',
    'getContext should be a function',
  );

  return (component) => {
    const mapStateToProps = ({
      reactReduxSSR,
    }, componentProps) => {
      const currentSSRId = ssrId || componentProps.ssrId;

      invariant(
        currentSSRId,
        'ssrId is required in ssr decorated component props or decorator params',
      );

      return {
        component,
        componentProps,

        ssrId: currentSSRId,
        ssr: reactReduxSSR.componentsParams[currentSSRId] ||
          componentInitialState,

        getContext,
      };
    };

    const mapDispatchToProps = {
      ...actions,
    };

    return connect(mapStateToProps, mapDispatchToProps)(SSRWrapper);
  };
}

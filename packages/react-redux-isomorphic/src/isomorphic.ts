import type {
  ComponentType,
} from 'react';
import { connect } from 'react-redux';
import invariant from 'invariant';

import IsomorphicWrapper from './IsomorphicWrapper';
import type {
  ContextResolverProps,
} from './IsomorphicWrapper';
import * as actions from './actions';

import getComponentState from './getComponentState';

export type IsomorphicParams<BaseProps, LoadParams, IsomorphicContext> = {
  isomorphicId?: string;
  getContext: (
    loadParams: LoadParams,
    baseProps: BaseProps,
  ) => IsomorphicContext | Promise<IsomorphicContext>;
  shouldReload?: (prevProps: BaseProps, nextProps: BaseProps) => boolean;
};

const isomorphic = <BaseProps, LoadParams, IsomorphicContext, IsomorphicError = Error>({
  isomorphicId,
  getContext,
  shouldReload,
}: IsomorphicParams<BaseProps, LoadParams, IsomorphicContext>): (
    component: ComponentType<ContextResolverProps<
    BaseProps, LoadParams, IsomorphicContext, IsomorphicError>>,
  ) => ComponentType<BaseProps> => {
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

  return (
    component: ComponentType<ContextResolverProps<
    BaseProps, LoadParams, IsomorphicContext, IsomorphicError>>,
  ): ComponentType<BaseProps> => {
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
};

export default isomorphic;

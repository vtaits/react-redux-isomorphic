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
import type {
  DefaultLoadParams,
} from './types';

export type IsomorphicParams<BaseProps, IsomorphicContext, LoadParams = DefaultLoadParams> = {
  isomorphicId?: string;
  getContext: (
    loadParams: LoadParams,
    baseProps: BaseProps,
  ) => IsomorphicContext | Promise<IsomorphicContext>;
  shouldReload?: (prevProps: BaseProps, nextProps: BaseProps) => boolean;
};

const isomorphic = <
BaseProps,
IsomorphicContext,
IsomorphicError = Error,
LoadParams = DefaultLoadParams,
>({
    isomorphicId,
    getContext,
    shouldReload,
  }: IsomorphicParams<BaseProps, IsomorphicContext, LoadParams>): (
    component: ComponentType<ContextResolverProps<
    BaseProps, IsomorphicContext, IsomorphicError, LoadParams>>,
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
    BaseProps, IsomorphicContext, IsomorphicError, LoadParams>>,
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

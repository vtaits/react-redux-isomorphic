import { createElement, Component } from 'react';
import type {
  ComponentType,
  ReactElement,
} from 'react';

import inject from './inject';

import { LoadContextError } from './errors';

import type {
  DefaultLoadParams,
  SingleState,
} from './types';

export type ContextResolverProps<
BaseProps,
IsomorphicContext,
IsomorphicError,
LoadParams = DefaultLoadParams,
> = {
  component: ComponentType<BaseProps & {
    isomorphic: SingleState<IsomorphicContext, IsomorphicError>;
  }>,
  componentProps: BaseProps;

  isomorphicId: string;

  isomorphic: SingleState<IsomorphicContext, IsomorphicError>;

  loadParams: LoadParams;
  getContext: (
    loadParams: LoadParams,
    baseProps: BaseProps,
  ) => IsomorphicContext | Promise<IsomorphicContext>;
  shouldReload?: (prevProps: BaseProps, nextProps: BaseProps) => boolean;

  loadContext: (isomorphicId: string) => void;
  loadContextSuccess: (isomorphicId: string, isomorphicContext: IsomorphicContext) => void;
  loadContextError: (isomorphicId: string, isomorphicError: IsomorphicError) => void;

  destroy: (isomorphicId: string) => void;
};

export class ContextResolver<
BaseProps,
IsomorphicContext,
IsomorphicError,
LoadParams = DefaultLoadParams,
> extends Component<ContextResolverProps<
  BaseProps,
  LoadParams,
  IsomorphicContext,
  IsomorphicError
  >> {
  constructor(props: ContextResolverProps<
  BaseProps,
  LoadParams,
  IsomorphicContext,
  IsomorphicError
  >) {
    super(props);

    this.init();
  }

  async componentDidUpdate(oldProps: ContextResolverProps<
  BaseProps,
  LoadParams,
  IsomorphicContext,
  IsomorphicError
  >): Promise<void> {
    const {
      shouldReload,
      componentProps,
    } = this.props;

    if (
      shouldReload
      && shouldReload(componentProps, oldProps.componentProps)
    ) {
      await this.destroy();

      await this.init();
    }
  }

  componentWillUnmount(): void {
    this.destroy();
  }

  init(): Promise<IsomorphicContext> {
    const {
      isomorphic: {
        isReady,
      },
      isomorphicId,
      loadContext,
    } = this.props;

    if (!isReady) {
      loadContext(isomorphicId);
    }

    return this.requestContext();
  }

  async requestContext(): Promise<IsomorphicContext> {
    const {
      componentProps,

      isomorphicId,
      isomorphic: {
        isReady,
      },

      loadParams,
      getContext,

      loadContextSuccess,
      loadContextError,
    } = this.props;

    if (isReady) {
      return;
    }

    let error: Error;
    try {
      const context = await getContext(loadParams, componentProps);

      loadContextSuccess(isomorphicId, context);
    } catch (catchedError) {
      error = catchedError;
    }

    if (!error) {
      return;
    }

    if (error instanceof LoadContextError) {
      loadContextError(isomorphicId, error.error);
    } else {
      throw error;
    }
  }

  destroy(): void {
    const {
      isomorphicId,
      destroy,
    } = this.props;

    destroy(isomorphicId);
  }

  render(): ReactElement {
    const {
      isomorphic,

      component,
      componentProps,
    } = this.props;

    return createElement(component, {
      ...componentProps,
      isomorphic,
    });
  }
}

const IsomorphicWrapper = inject(ContextResolver);

export default IsomorphicWrapper;

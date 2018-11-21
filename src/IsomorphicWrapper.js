import { createElement, Component } from 'react';
import PropTypes from 'prop-types';

import inject from './inject';
import { isomorphicIdPropTypes, isomorphicPropTypes } from './propTypes';

import { LoadContextError } from './errors';

export class ContextResolver extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    componentProps: PropTypes.object.isRequired,

    isomorphicId: isomorphicIdPropTypes.isRequired,

    isomorphic: isomorphicPropTypes({}).isRequired,

    loadParams: PropTypes.object.isRequired,
    getContext: PropTypes.func.isRequired,
    shouldReload: PropTypes.func,

    loadContext: PropTypes.func.isRequired,
    loadContextSuccess: PropTypes.func.isRequired,
    loadContextError: PropTypes.func.isRequired,

    destroy: PropTypes.func.isRequired,
  }

  static defaultProps = {
    shouldReload: null,
  }

  constructor(props) {
    super(props);

    this.init();
  }

  async componentDidUpdate(oldProps) {
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

  componentWillUnmount() {
    this.destroy();
  }

  init() {
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

  async requestContext() {
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

    let error;
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

  destroy() {
    const {
      isomorphicId,
      destroy,
    } = this.props;

    destroy(isomorphicId);
  }

  render() {
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

import { createElement, Component } from 'react';
import PropTypes from 'prop-types';

import { reactReduxIsomorphicContextTypes } from './contextTypes';
import { isomorphicIdPropTypes, isomorphicPropTypes } from './propTypes';

import { LoadContextError } from './errors';

class IsomorphicWrapper extends Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    componentProps: PropTypes.object.isRequired,

    isomorphicId: isomorphicIdPropTypes.isRequired,

    isomorphic: isomorphicPropTypes({}).isRequired,

    getContext: PropTypes.func.isRequired,
    shouldReload: PropTypes.func,

    loadContext: PropTypes.func.isRequired,
    loadContextSuccess: PropTypes.func.isRequired,
    loadContextError: PropTypes.func.isRequired,

    destroy: PropTypes.func.isRequired,
  }

  static contextTypes = {
    reactReduxIsomorphic: reactReduxIsomorphicContextTypes.isRequired,
  };


  static defaultProps = {
    shouldReload: null,
  }

  constructor(props, context) {
    super(props, context);

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
      this.destroy();

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

      getContext,

      loadContextSuccess,
      loadContextError,
    } = this.props;

    const {
      reactReduxIsomorphic: {
        loadParams,
      },
    } = this.context;

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

export default IsomorphicWrapper;

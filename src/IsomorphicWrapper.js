import { createElement, Component } from 'react';
import PropTypes from 'prop-types';

import { reactReduxIsomorphicContextTypes } from './contextTypes';
import { isomorphicIdPropTypes, isomorphicPropTypes } from './propTypes';

import { LoadContextError } from './errors';

class IsomorphicWrapper extends Component {
  static contextTypes = {
    reactReduxIsomorphic: reactReduxIsomorphicContextTypes.isRequired,
  };

  static propTypes = {
    component: PropTypes.func.isRequired,
    componentProps: PropTypes.object.isRequired,

    isomorphicId: isomorphicIdPropTypes.isRequired,

    isomorphic: isomorphicPropTypes({}).isRequired,

    getContext: PropTypes.func.isRequired,

    loadContext: PropTypes.func.isRequired,
    loadContextSuccess: PropTypes.func.isRequired,
    loadContextError: PropTypes.func.isRequired,

    destroy: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    if (!props.isomorphic.isReady) {
      props.loadContext(props.isomorphicId);
    }
  }

  async componentWillMount() {
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

  componentWillUnmount() {
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

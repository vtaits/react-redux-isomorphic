import { createElement, Component } from 'react';
import PropTypes from 'prop-types';

import { reactReduxSSRContextTypes } from './contextTypes';
import { ssrIdPropTypes, ssrPropTypes } from './propTypes';

class SSRWrapper extends Component {
  static contextTypes = {
    reactReduxSSR: reactReduxSSRContextTypes.isRequired,
  };

  static propTypes = {
    component: PropTypes.func.isRequired,
    componentProps: PropTypes.object.isRequired,

    ssrId: ssrIdPropTypes.isRequired,

    ssr: ssrPropTypes({}).isRequired,

    getContext: PropTypes.func.isRequired,

    loadContext: PropTypes.func.isRequired,
    loadContextSuccess: PropTypes.func.isRequired,
    loadContextError: PropTypes.func.isRequired,

    destroy: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    if (!props.ssr.isReady) {
      props.loadContext(props.ssrId);
    }
  }

  async componentDidMount() {
    const {
      componentProps,

      ssrId,
      ssr: {
        isReady,
      },

      getContext,

      loadContextSuccess,
      loadContextError,
    } = this.props;

    const {
      reactReduxSSR: {
        loadParams,
      },
    } = this.context;

    if (isReady) {
      return;
    }

    try {
      const context = await getContext(loadParams, componentProps);

      loadContextSuccess(ssrId, context);
    } catch (error) {
      loadContextError(ssrId, error);
    }
  }

  componentWillUnmount() {
    const {
      ssrId,
      destroy,
    } = this.props;

    destroy(ssrId);
  }

  render() {
    const {
      ssr,

      component,
      componentProps,
    } = this.props;

    return createElement(component, {
      ...componentProps,
      ssr,
    });
  }
}

export default SSRWrapper;

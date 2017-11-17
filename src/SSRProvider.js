import { Component } from 'react';
import PropTypes from 'prop-types';

import { reactReduxSSRContextTypes } from './contextTypes';

class SSRProvider extends Component {
  static childContextTypes = {
    reactReduxSSR: reactReduxSSRContextTypes.isRequired,
  }

  static propTypes = {
    loadParams: PropTypes.object,
    children: PropTypes.node,
  }

  static defaultProps = {
    loadParams: {},
    children: null,
  }

  getChildContext() {
    return {
      reactReduxSSR: {
        loadParams: this.props.loadParams,
      },
    };
  }

  render() {
    return this.props.children;
  }
}

export default SSRProvider;

import { Component } from 'react';
import PropTypes from 'prop-types';

import { reactReduxIsomorphicContextTypes } from './contextTypes';

class IsomorphicProvider extends Component {
  static propTypes = {
    loadParams: PropTypes.object,
    children: PropTypes.node,
  }

  static childContextTypes = {
    reactReduxIsomorphic: reactReduxIsomorphicContextTypes.isRequired,
  }

  static defaultProps = {
    loadParams: {},
    children: null,
  }

  getChildContext() {
    return {
      reactReduxIsomorphic: {
        loadParams: this.props.loadParams,
      },
    };
  }

  render() {
    return this.props.children;
  }
}

export default IsomorphicProvider;

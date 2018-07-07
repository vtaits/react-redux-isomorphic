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
    const {
      loadParams,
    } = this.props;

    return {
      reactReduxIsomorphic: {
        loadParams,
      },
    };
  }

  render() {
    const {
      children,
    } = this.props;

    return children;
  }
}

export default IsomorphicProvider;

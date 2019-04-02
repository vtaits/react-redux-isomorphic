import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IsomorphicContext from './context';

class Injector extends Component {
  static propTypes = {
    children: PropTypes.func.isRequired,
  }

  renderChildren = ({
    loadParams,
  }) => {
    const {
      children,
    } = this.props;

    return children(loadParams);
  }

  render() {
    return (
      <IsomorphicContext.Consumer>
        {this.renderChildren}
      </IsomorphicContext.Consumer>
    );
  }
}

export default Injector;

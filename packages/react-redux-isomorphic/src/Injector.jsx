import React, { Component } from 'react';
import PropTypes from 'prop-types';

import IsomorphicContext from './context';

class Injector extends Component {
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

Injector.propTypes = {
  children: PropTypes.func.isRequired,
};

export default Injector;

import React from 'react';
import PropTypes from 'prop-types';

import IsomorphicContext from './context';

const IsomorphicProvider = ({
  loadParams,
  children,
}) => (
  <IsomorphicContext.Provider value={loadParams}>
    {children}
  </IsomorphicContext.Provider>
);

IsomorphicProvider.propTypes = {
  loadParams: PropTypes.object,
  children: PropTypes.node,
};

IsomorphicProvider.defaultProps = {
  loadParams: {},
  children: null,
};

export default IsomorphicProvider;

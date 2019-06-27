import React from 'react';
import PropTypes from 'prop-types';

import IsomorphicContext from './context';

const IsomorphicProvider = ({
  loadParams,
  isFakeHooks,
  children,
}) => (
  <IsomorphicContext.Provider
    value={{
      loadParams,
      isFakeHooks,
    }}
  >
    {children}
  </IsomorphicContext.Provider>
);

IsomorphicProvider.propTypes = {
  loadParams: PropTypes.object,
  isFakeHooks: PropTypes.bool,
  children: PropTypes.node,
};

IsomorphicProvider.defaultProps = {
  loadParams: {},
  isFakeHooks: false,
  children: null,
};

export default IsomorphicProvider;

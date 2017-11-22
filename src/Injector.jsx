import { createElement } from 'react';
import PropTypes from 'prop-types';

import { reactReduxIsomorphicContextTypes } from './contextTypes';

const Injector = ({
  component,
  ...componentProps
}, {
  reactReduxIsomorphic: {
    loadParams,
  },
}) => createElement(component, {
  ...componentProps,
  loadParams,
});

Injector.contextTypes = {
  reactReduxIsomorphic: reactReduxIsomorphicContextTypes.isRequired,
};

Injector.propTypes = {
  component: PropTypes.func.isRequired,
};

export default Injector;

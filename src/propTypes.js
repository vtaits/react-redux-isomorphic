import PropTypes from 'prop-types';

export const ssrIdPropTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

export const ssrPropTypes = ({
  context = PropTypes.any,
  error = PropTypes.any,
}) => PropTypes.shape({
  isReady: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  context,
  error,
});

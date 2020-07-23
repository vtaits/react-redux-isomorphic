import PropTypes from 'prop-types';

export const isomorphicIdPropTypes = PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number,
]);

export const isomorphicPropTypes = ({
  context = PropTypes.any,
  error = PropTypes.any,
}: {
  context: any;
  error: any;
}): any => PropTypes.shape({
  isReady: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isReloading: PropTypes.bool.isRequired,
  context,
  error,
});

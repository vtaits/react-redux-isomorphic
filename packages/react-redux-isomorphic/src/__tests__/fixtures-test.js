import checkPropTypes from 'check-prop-types';

import { isomorphicProps } from '../fixtures';
import { isomorphicPropTypes } from '../propTypes';

test('should be a correct props of component', () => {
  expect(checkPropTypes(
    {
      isomorphic: isomorphicPropTypes({}),
    },
    isomorphicProps,
    'prop',
    'TestComponentName',
  )).toBeFalsy();
});

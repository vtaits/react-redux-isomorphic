import checkPropTypes from 'check-prop-types';

import { ssrProps } from '../fixtures';
import { ssrPropTypes } from '../propTypes';

test('should be a correct props of component', () => {
  expect(checkPropTypes(
    {
      ssr: ssrPropTypes({}),
    },
    ssrProps,
    'prop',
    'TestComponentName',
  )).toBeFalsy();
});

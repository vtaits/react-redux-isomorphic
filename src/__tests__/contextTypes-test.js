import checkPropTypes from 'check-prop-types';

import { reactReduxIsomorphicContextTypes } from '../contextTypes';

test('should accept object with params', () => {
  expect(checkPropTypes(
    {
      reactReduxIsomorphic: reactReduxIsomorphicContextTypes,
    },
    {
      reactReduxIsomorphic: {
        fetch: () => {},
        isServerRender: true,
      },
    },
    'prop',
    'TestComponentName',
  ))
    .toBeFalsy();
});

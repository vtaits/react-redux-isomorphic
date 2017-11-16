import checkPropTypes from 'check-prop-types';

import { reactReduxSSRContextTypes } from '../contextTypes';

test('should accept object with params', () => {
  expect(checkPropTypes(
    {
      reactReduxSSR: reactReduxSSRContextTypes,
    },
    {
      reactReduxSSR: {
        fetch: () => {},
        isServerRender: true,
      },
    },
    'prop',
    'TestComponentName',
  ))
    .toBeFalsy();
});

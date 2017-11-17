import * as indexExports from '../index';

import {
  ssrIdPropTypes,
  ssrPropTypes,
} from '../propTypes';
import reducer from '../reducer';
import ssrDecorator from '../ssrDecorator';
import SSRProvider from '../SSRProvider';
import waitForContext from '../waitForContext';

test('should export needed modules', () => {
  expect(indexExports.ssrIdPropTypes).toBe(ssrIdPropTypes);
  expect(indexExports.ssrPropTypes).toBe(ssrPropTypes);
  expect(indexExports.reducer).toBe(reducer);
  expect(indexExports.ssrDecorator).toBe(ssrDecorator);
  expect(indexExports.SSRProvider).toBe(SSRProvider);
  expect(indexExports.waitForContext).toBe(waitForContext);
});

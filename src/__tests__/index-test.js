import * as indexExports from '../index';

import {
  isomorphicIdPropTypes,
  isomorphicPropTypes,
} from '../propTypes';
import reducer from '../reducer';
import inject from '../inject';
import Injector from '../Injector';
import useLoadParams from '../useLoadParams';
import isomorphic from '../isomorphic';
import IsomorphicProvider from '../IsomorphicProvider';
import waitForContext from '../waitForContext';
import { LoadContextError } from '../errors';

test('should export needed modules', () => {
  expect(indexExports.isomorphicIdPropTypes).toBe(isomorphicIdPropTypes);
  expect(indexExports.isomorphicPropTypes).toBe(isomorphicPropTypes);
  expect(indexExports.reducer).toBe(reducer);
  expect(indexExports.inject).toBe(inject);
  expect(indexExports.Injector).toBe(Injector);
  expect(indexExports.useLoadParams).toBe(useLoadParams);
  expect(indexExports.isomorphic).toBe(isomorphic);
  expect(indexExports.IsomorphicProvider).toBe(IsomorphicProvider);
  expect(indexExports.waitForContext).toBe(waitForContext);
  expect(indexExports.LoadContextError).toBe(LoadContextError);
});

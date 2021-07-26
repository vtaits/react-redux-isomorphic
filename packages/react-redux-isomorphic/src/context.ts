import { createContext } from 'react';

import type {
  DefaultLoadParams,
} from './types';

const IsomorphicContext = createContext<{
  loadParams: DefaultLoadParams;
  isFakeHooks: boolean;
}>({
  loadParams: {},
  isFakeHooks: false,
});

export default IsomorphicContext;

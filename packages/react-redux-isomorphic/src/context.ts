import { createContext } from 'react';

const IsomorphicContext = createContext<{
  loadParams: Record<string, any>;
  isFakeHooks: boolean;
}>({
  loadParams: {},
  isFakeHooks: false,
});

export default IsomorphicContext;

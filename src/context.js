import { createContext } from 'react';

const IsomorphicContext = createContext({
  loadParams: {},
  isFakeHooks: false,
});

export default IsomorphicContext;

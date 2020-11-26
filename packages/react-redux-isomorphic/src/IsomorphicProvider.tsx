import type {
  FC,
  ReactNode,
} from 'react';

import IsomorphicContext from './context';

export type IsomorphicProviderProps = {
  loadParams?: Record<string, any>;
  isFakeHooks?: boolean;
  children?: ReactNode;
};

const IsomorphicProvider: FC<IsomorphicProviderProps> = ({
  loadParams,
  isFakeHooks,
  children,
}) => (
  <IsomorphicContext.Provider
    value={{
      loadParams,
      isFakeHooks,
    }}
  >
    {children}
  </IsomorphicContext.Provider>
);

IsomorphicProvider.defaultProps = {
  loadParams: {},
  isFakeHooks: false,
  children: null,
};

export default IsomorphicProvider;

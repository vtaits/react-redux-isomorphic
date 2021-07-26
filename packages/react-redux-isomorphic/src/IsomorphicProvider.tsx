import type {
  ReactElement,
  ReactNode,
} from 'react';

import IsomorphicContext from './context';

import type {
  DefaultLoadParams,
} from './types';

export type IsomorphicProviderProps<LoadParams = DefaultLoadParams> = {
  loadParams?: LoadParams;
  isFakeHooks?: boolean;
  children?: ReactNode;
};

function IsomorphicProvider<LoadParams = DefaultLoadParams>({
  loadParams,
  isFakeHooks,
  children,
}: IsomorphicProviderProps<LoadParams>): ReactElement {
  return (
    <IsomorphicContext.Provider
      value={{
        loadParams,
        isFakeHooks,
      }}
    >
      {children}
    </IsomorphicContext.Provider>
  );
}

IsomorphicProvider.defaultProps = {
  loadParams: {},
  isFakeHooks: false,
  children: null,
};

export default IsomorphicProvider;

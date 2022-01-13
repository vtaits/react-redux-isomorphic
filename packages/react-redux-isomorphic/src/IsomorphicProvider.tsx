import {
  useMemo,
} from 'react';
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
  const value = useMemo(() => ({
    loadParams,
    isFakeHooks,
  }), [
    loadParams,
    isFakeHooks,
  ]);

  return (
    <IsomorphicContext.Provider
      value={value}
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface DefaultLoadParams {}

export type SingleState<IsomorphicContext, IsomorphicError = Error> = {
  isReady: boolean;
  isLoading: boolean;
  isReloading: boolean;
  context: IsomorphicContext | null,
  error: IsomorphicError | null,
};

export type FullState = {
  pendingComponents: string[];
  componentsParams: {
    [key: string]: SingleState<any, any>;
  };
};

export type StoreState = {
  reactReduxIsomorphic: FullState;
  [key: string]: any;
};

export type UseIsomorphicResult<IsomorphicContext, IsomorphicError = Error> =
  & SingleState<IsomorphicContext, IsomorphicError>
  & {
    reload: () => void;
  };

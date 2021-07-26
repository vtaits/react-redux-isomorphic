import { useContext } from 'react';

import IsomorphicContext from './context';
import type {
  DefaultLoadParams,
} from './types';

const useLoadParams = <LoadParams = DefaultLoadParams>(): LoadParams => {
  const { loadParams } = useContext(IsomorphicContext);

  return loadParams as LoadParams;
};

export default useLoadParams;

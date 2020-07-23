import { useContext } from 'react';

import IsomorphicContext from './context';

const useLoadParams = <LoadParams>(): LoadParams => {
  const { loadParams } = useContext(IsomorphicContext);

  return loadParams as LoadParams;
};

export default useLoadParams;

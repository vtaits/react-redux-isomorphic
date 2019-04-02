import { useContext } from 'react';

import IsomorphicContext from './context';

const useLoadParams = () => {
  const { loadParams } = useContext(IsomorphicContext);

  return loadParams;
};

export default useLoadParams;

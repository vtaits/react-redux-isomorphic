import { useContext } from 'react';

import IsomorphicContext from './context';

const useLoadParams = () => useContext(IsomorphicContext);

export default useLoadParams;

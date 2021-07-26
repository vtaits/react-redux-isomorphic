import 'react-redux-isomorphic';

import type {
  LoadParams,
} from './types';

declare module 'react-redux-isomorphic' {
  export interface DefaultLoadParams extends LoadParams {
  }
}

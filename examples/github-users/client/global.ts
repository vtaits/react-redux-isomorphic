import type {
  StoreState,
} from 'react-redux-isomorphic';

declare global {
  interface Window {
    __PRELOADED_STATE__: StoreState;
  }
}

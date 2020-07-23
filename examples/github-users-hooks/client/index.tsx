import 'whatwg-fetch';

import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { hydrate } from 'react-dom';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import {
  IsomorphicProvider,
} from 'react-redux-isomorphic';

import Routes from '../shared/Routes';
import reducers from '../shared/reducers';

import './global';

const store = createStore(reducers, window.__PRELOADED_STATE__);

hydrate(
  <Provider store={store}>
    <IsomorphicProvider
      loadParams={{
        setTitle: (titleForSet: string) => {
          document.title = titleForSet;
        },
        setStatus: () => {},
        fetch,
      }}
    >
      <BrowserRouter>
        <Routes/>
      </BrowserRouter>
    </IsomorphicProvider>
  </Provider>,
  document.getElementById('app'),
);

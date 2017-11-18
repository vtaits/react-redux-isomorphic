import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { renderToString } from 'react-dom/server';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import {
  IsomorphicProvider,
  waitForContext,
} from 'react-redux-isomorphic';

import fetch from 'node-fetch';

import path from 'path';

import express from 'express';

import Routes from './shared/Routes';
import reducers from './shared/reducers';

const app = express();

function renderHTML(reactMarkup, title, initialState) {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/latest/css/bootstrap.min.css">
<body>
<div id="app">${reactMarkup}</div>
<script>
window.__PRELOADED_STATE__ = ${JSON.stringify(initialState).replace(/</g, '\\u003c')};
</script>
<script src="/dist/bundle.js"></script>
</body>
</html>`;
}

function fetchGithub(url) {
  return fetch(url.replace(/^\/api\//, 'https://api.github.com/'));
}

app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/api/*', async (req, res) => {
  const githubResponse = await fetchGithub(req.url);

  const { status } = githubResponse;
  const json = await githubResponse.json();

  res.status(status).send(json);
});

app.get('*', async (req, res) => {
  const store = createStore(reducers);

  let title = '';
  let status = 200;

  const context = {};
  const componentForRender = (
    <Provider store={store}>
      <IsomorphicProvider
        loadParams={{
          setTitle: (titleForSet) => {
            title = titleForSet;
          },
          setStatus: (statusForSet) => {
            status = statusForSet;
          },
          fetch: requestUrl => fetchGithub(requestUrl),
        }}
      >
        <StaticRouter
          location={req.url}
          context={context}
        >
          <Routes />
        </StaticRouter>
      </IsomorphicProvider>
    </Provider>
  );

  // call context loaders
  renderToString(componentForRender);

  await waitForContext(store);

  // collect markup
  const reactMarkup = renderToString(componentForRender);

  const html = renderHTML(reactMarkup, title, store.getState());

  res.status(status).send(html);
});

export default app;

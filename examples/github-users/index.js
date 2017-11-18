'use strict';

require('babel-polyfill');

const path = require('path');
const appModulePath = require('app-module-path');
appModulePath.addPath(path.join(__dirname, 'shared'));

require('babel-register')({
  presets: [
    'env',
    'react',
    'stage-2',
  ],
});

const server = require('./server.jsx').default;
const PORT = 3000;

server.listen(PORT, function () {
  console.log('Server listening on', PORT);
});

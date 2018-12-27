'use strict';

const path = require('path');
const appModulePath = require('app-module-path');
appModulePath.addPath(path.join(__dirname, 'shared'));

require('@babel/register')({
  presets: [
    '@babel/env',
    '@babel/react',
  ],

  plugins: [
    '@babel/plugin-transform-runtime',
    '@babel/plugin-proposal-class-properties',
  ],
});

const server = require('./server.jsx').default;
const PORT = 3000;

server.listen(PORT, function () {
  console.log('Server listening on', PORT);
});

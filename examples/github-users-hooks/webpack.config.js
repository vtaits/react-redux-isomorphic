const path = require('path');
const LoadablePlugin = require('@loadable/webpack-plugin');

const context = path.join(__dirname, 'client');

module.exports = {
  mode: 'development',
  context,
  entry: './index.tsx',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [{
      test: [/(\.ts)/, /(\.tsx)/],
      exclude: /node_modules/,
      use: [{
        loader: 'babel-loader',
        options: {
          rootMode: 'upward',
        },
      }],
    }],
  },
  resolve: {
    modules: [
      context,
      'shared',
      'node_modules',
    ],
    extensions: ['.js', '.ts', '.tsx'],
  },
  plugins: [new LoadablePlugin()],
};

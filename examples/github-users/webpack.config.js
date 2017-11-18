const webpack = require('webpack')
const path = require('path')

const context = path.join(__dirname, 'client')

module.exports = function() {
  return {
    context,
    entry: './index.jsx',
    output: {
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    module: {
      rules: [{
        test: [/(\.js)/, /(\.jsx)/],
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', { modules: false }],
              'react',
              'stage-2',
            ],
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
      extensions: ['.js', '.jsx'],
    },
  }
}

const webpack = require('webpack');
const path = require('path');

// utils
const ROOT_DIR = path.resolve(__dirname, '../');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);

module.exports = {
  entry: {
    dependencies: Object.keys(require('../package.json').dependencies),
  },
  output: {
    path: resolvePath('webpack/dist'),
    filename: '[name].dll.js',
    libraryTarget: 'var',
    library: '_dll_[name]_[hash]',
  },
  resolve: {
    alias: {},
  },
  plugins: [
    new webpack.DllPlugin({
      path: resolvePath('webpack/dist', '[name].manifest.json'),
      name: '_dll_[name]_[hash]',
    }),
  ],
};

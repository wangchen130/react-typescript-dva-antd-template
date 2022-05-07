const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const pkg = require('../package.json');
const isAnalyze = process.argv.includes('--analyze');


const ROOT_DIR = path.resolve(__dirname, '../');
const resolvePath = (...args) => path.resolve(ROOT_DIR, ...args);


const SRC_DIR = resolvePath('src');
const BUILD_DIR = resolvePath('dist');
const PUBLIC_DIR = resolvePath('src/public');

const isDev = process.env.NODE_ENV !== 'production';

const alias = {
  src: SRC_DIR,
  "@": SRC_DIR,
};

const styleLoader = isDev ? 'style-loader' : MiniCssExtractPlugin.loader;
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: isDev,
  },
};
const cssLoaderModule = {
  loader: 'css-loader',
  options: Object.assign({}, cssLoader.options, {
    modules: {
      localIdentName: '[path][name]__[local]--[hash:base64:5]',
    },
  }),
};

const babelLoaderOptions = {
  babelrc: false,
  cacheDirectory: isDev,
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: pkg.browserslist,
        },
        forceAllTransforms: !isDev,
        modules: false,
        useBuiltIns: false,
        debug: false,
      },
    ],
    [
      '@babel/preset-react',
      {
        development: isDev,
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    ['@babel/plugin-transform-runtime', { corejs: 2 }],
    '@babel/plugin-proposal-function-bind',
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    [
      '@babel/plugin-proposal-class-properties',
      {
        loose: false,
      },
    ],
    '@babel/plugin-proposal-json-strings',
    // 热加载
    ...(isDev ? ['dva-hmr', 'react-hot-loader/babel'] : []),

    // 按需加载antd
    [
      'import',
      {
        libraryName: 'antd',
        libraryDirectory: 'lib',
        style: true,
      },
    ],
  ],
};

module.exports = {
  mode: isDev ? 'development' : 'production',
  devtool: isDev ? 'cheap-module-eval-source-map' : false,
  entry: {
    app: [
      ...(isDev ? ['webpack-hot-middleware/client?path=/__webpack_hmr'] : []),
      './src/index.ts',
    ],
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      minSize: 30000,
      minChunks: 5,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        antd: {
          test: /[\\/]node_modules[\\/]antd/,
          name: 'antd',
          chunks: 'all',
          enforce: true,
          priority: 0,
        },
        react: {
          test: /[\\/]node_modules[\\/]react\-dom/,
          name: 'react',
          chunks: 'all',
          enforce: true,
          priority: 0,
        },
        vendors: {
          test: /[\\/]node_modules[\\/]([^(antd))|(^(react\-dom)])/,
          name: 'vendors',
          chunks: 'all',
          enforce: true,
          priority: 0,
        },
        commons: {
          chunks: 'initial',
          minChunks: 3,
          name: 'syncs',
          maxInitialRequests: 5, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
          priority: -3,
          reuseExistingChunk: true,
        },
        asyncs: {
          chunks: 'async',
          minChunks: 2,
          name: 'asyncs',
          maxInitialRequests: 1, // The default limit is too small to showcase the effect
          minSize: 0, // This is example is too small to create commons chunks
          priority: -4,
          reuseExistingChunk: true,
        },
      },
    },
  },

  output: {
    path: BUILD_DIR,
    filename: isDev ? '[name].js' : '[name].[hash:7].js',
    chunkFilename: isDev ? 'chunks/[name].js' : 'chunks/[name].[chunkhash:8].js',
    publicPath: '/',
  },
  resolve: {
    modules: ['node_modules', SRC_DIR],
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    alias,
  },

  module: {
    rules: [
      {
        test: /\.(j|t)s[x]?$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: path.resolve(__dirname, '../src'),
        options: {
          formatter: eslintFormatter,
          failOnError: !isDev,
          configFile: isDev ? resolvePath('.eslintrc.dev.js') : resolvePath('.eslintrc.js'),
        },
      },
      {
        test: /\.(j|t)s[x]?$/,
        include: [SRC_DIR],
        loader: 'babel-loader',
        options: babelLoaderOptions,
      },
      {
        test: /\.woff(2)?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/font-woff',
        },
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          mimetype: 'application/octet-stream',
        },
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'babel-loader',
            options: babelLoaderOptions,
          },
          {
            loader: '@svgr/webpack',
            options: {
              babel: false,
              icon: true,
            },
          },
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
        ],
      },
      /* images */
      {
        test: /\.(png|jpe?g|gif)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
        },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [styleLoader, cssLoader],
      },
      {
        test: /\.less$/,
        oneOf: [
          {
            resourceQuery: /local/,
            use: [
              styleLoader,
              cssLoaderModule,
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: resolvePath('build/postcss.config.js'),
                  },
                },
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                },
              },
            ],
          },
          {
            use: [
              styleLoader,
              cssLoader,
              {
                loader: 'postcss-loader',
                options: {
                  config: {
                    path: resolvePath('build/postcss.config.js'),
                  },
                },
              },
              {
                loader: 'less-loader',
                options: {
                  modifyVars: {
                    hack: `true; @import "${SRC_DIR}/themes/antd.var.less";`,
                  },
                  javascriptEnabled: true,
                },
              },
            ],
          },
        ],
      },
    ],
  },

  plugins: [
    {
      apply: (compiler) => {
        compiler.hooks.failed.tap('failedPlugin', (error) => {
          console.log(error);
        });
      },
    },
    new webpack.DefinePlugin({ __DEV__: isDev }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: PUBLIC_DIR,
          to: 'public',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(SRC_DIR, 'index.ejs'),
      filename: 'index.html',
    }),
    new ProgressBarPlugin(),
    ...(isDev
      ? [
           /* 开发环境配置开始 */
          ...(fs.existsSync(resolvePath('webpack/dist'))
            ? [
                new webpack.DllReferencePlugin({
                  manifest: require(resolvePath('webpack/dist', 'dependencies.manifest.json')),
                }),
                new HtmlWebpackTagsPlugin({
                  tags: ['webpack/dependencies.dll.js'],
                  append: false,
                }),
                new CopyWebpackPlugin({
                  patterns: [
                    {
                      from: resolvePath('webpack/dist'),
                      to: 'webpack',
                    },
                  ],
                }),
              ]
            : []),
          new webpack.HotModuleReplacementPlugin(),
          /* 开发环境配置结束 */
        ]
      : [
          /* 生产环境开始 */
          new CleanWebpackPlugin([BUILD_DIR], { root: ROOT_DIR }),
          new MiniCssExtractPlugin({
            filename: '[name].[hash].css',
            chunkFilename: '[id].[hash].css',
          }),
          new OptimizeCssAssetsWebpackPlugin(),
          ...(isAnalyze
            ? [
                new BundleAnalyzerPlugin({
                  analyzerHost: 'localhost',
                  analyzerPort: 5000,
                }),
              ]
            : []),
          /* 生产环境结束 */
        ]),
  ],
  stats: 'minimal',
};

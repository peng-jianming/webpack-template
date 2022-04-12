const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { merge } = require('webpack-merge');
const ESLintPlugin = require('eslint-webpack-plugin');
const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const paths = require('./paths');
const fs = require('fs');

const templateHtmlConfig = require(paths.templateHtmlConfig);

const commonConfig = (isProduction) => {
  return {
    entry: paths.index,
    output: {
      path: paths.dist,
      filename: isProduction
        ? 'js/[name].[contenthash:6].bundle.js'
        : '[name].js',
      chunkFilename: isProduction
        ? 'js/[name].[contenthash:6].chunk.js'
        : '[name].js',
      publicPath: isProduction ? paths.productionPublicPath : '/'
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: [
            {
              loader: 'babel-loader'
            }
          ]
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            'postcss-loader'
          ],
          sideEffects: true
        },
        {
          test: /\.less$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 2
              }
            },
            'postcss-loader',
            'less-loader'
          ],
          sideEffects: true
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/,
          type: 'asset',
          generator: {
            filename: 'img/[name].[hash:7][ext]'
          },
          parser: {
            dataUrlCondition: {
              maxSize: 10000
            }
          }
        },
        {
          test: /\.(woff2?|eot|ttf|otf)$/,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name].[hash:7][ext]'
          }
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          type: 'asset/resource',
          generator: {
            filename: 'video/[name].[hash:7][ext]'
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: paths.template,
            globOptions: {
              ignore: ['**/index.html', '**/page.js']
            }
          }
        ]
      }),
      new ESLintPlugin({
        context: paths.src,
        extensions: ['.js', '.vue'],
        exclude: ['node_modules']
      }),
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: paths.templateHtml,
        inject: false,
        configs: templateHtmlConfig,
        plugins: {
          assetsRetry: fs.readFileSync(require.resolve('assets-retry')),
          assetsRetryConfig: templateHtmlConfig.assetsRetryConfig
        }
      })
    ],
    resolve: {
      alias: {
        src: paths.src
      },
      extensions: ['.js', '.vue']
    },
    externals: {
      lodash: '_',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      vuex: 'Vuex',
      'element-ui': 'ELEMENT',
      axios: 'axios',
      moment: 'moment'
    },
    performance: false,
    stats: {
      preset: 'errors-only',
      builtAt: true
    }
  };
};

module.exports = (env) => {
  return merge(
    commonConfig(env.production),
    env.production ? prodConfig : devConfig
  );
};

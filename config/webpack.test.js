/*
 * MIT License
 *
 * Copyright (c) 2017 Stefano Cappa
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
const helpers = require('./helpers');

const webpack = require('webpack');
const ContextReplacementPlugin = require('webpack/lib/ContextReplacementPlugin');

module.exports = {
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [helpers.root('src'), 'node_modules']
  },
  module: {
    rules: [
      /**
       * Source map loader support for *.js files
       * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
       *
       * See: https://github.com/webpack/source-map-loader
       */
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
          // these packages have problems with their sourcemaps
          helpers.root('node_modules/rxjs'),
          helpers.root('node_modules/@angular')
        ]
      },
      {
        test: /\.ts$/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            query: {
              // use inline sourcemaps for "karma-remap-coverage" reporter
              sourceMap: false,
              inlineSourceMap: true,
              compilerOptions: {

                // Remove TypeScript helpers to be injected
                // below by DefinePlugin
                removeComments: true

              }
            }
          },
          'angular2-template-loader'
        ],
        exclude: [/\.e2e\.ts$/]
      },
      {
        test: /\.css$/,
        loader: ['to-string-loader', 'css-loader'],
        exclude: [helpers.root('src/index.html'), helpers.root('src/admin.html')]
      },
      {
        test: /\.scss$/,
        loaders: ['raw-loader', 'sass-loader'],
        exclude: [helpers.root('src/index.html'), helpers.root('src/admin.html')]
      },
      {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [helpers.root('src/index.html'), helpers.root('src/admin.html')]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)/,
        loader: 'null-loader'
      },
      {
        enforce: 'post',
        test: /\.(js|ts)$/,
        loader: 'istanbul-instrumenter-loader',
        query: {
          esModules: true
        },
        include: helpers.root('src'),
        exclude: [
          /\.(e2e|spec)\.ts$/,
          /node_modules/
        ]
      },
    ]
  },
  plugins: [
    new ContextReplacementPlugin(
      // The (\\|\/) piece accounts for path separators in *nix and Windows
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./src') // location of your src
    )
  ],
  /**
   * Disable performance hints
   *
   * See: https://github.com/a-tarasyuk/rr-boilerplate/blob/master/webpack/dev.config.babel.js#L41
   */
  performance: {
    hints: false
  },

  /**
   * Include polyfills or mocks for various node stuff
   * Description: Node configuration
   *
   * See: https://webpack.github.io/docs/configuration.html#node
   */
  node: {
    global: true,
    process: false,
    crypto: 'empty',
    module: false,
    clearImmediate: false,
    setImmediate: false
  }
};

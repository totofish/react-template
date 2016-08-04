'use strict';

var path              = require('path');
var autoprefixer      = require('autoprefixer');
var webpack           = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var argv              = require('minimist')(process.argv.slice(2), { boolean:['release'] });
process.env.NODE_ENV = argv.release ? 'production' : 'development';

module.exports = {
  entry: {
    'indexApp': ['./src/index.js'],
    'pageApp' : ['./src/page.js']
  },
  output: {
    // libraryTarget: "umd",
    path: path.join(__dirname, 'dist/scripts'),
    filename: '[name].js',
    publicPath: '/scripts',
    // chunkFilename: "[name].[hash].js"
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: "commons",
      // chunks: ["indexApp", "pageApp"]
    }),
    new webpack.DefinePlugin({
      // 將 Environment Variables - 環境變數傳入
      'process.env.NODE_ENV': JSON.stringify(argv.release ? 'production' : 'development')
    })
    // new HtmlWebpackPlugin({
    //     release: argv.release,
    //     chunks: ['indexApp'], // 指定對應到的entry為app
    //     filename: 'index.html',
    //     template: './src/template.html',
    //     inject: 'body',
    //     hash: true,
    //     minify: {
    //         minifyCSS: argv.release,
    //         minifyJS: argv.release,
    //         removeComments: argv.release,
    //         collapseWhitespace: argv.release,
    //         preserveLineBreaks: true
    //     }
    // }),
    // new HtmlWebpackPlugin({
    //     release: argv.release,
    //     chunks: ['pageApp'], // 指定對應到的entry為app
    //     filename: 'about.html',
    //     template: './src/index.html',
    //     inject: 'body',
    //     hash: true,
    //     minify: {
    //         minifyCSS: argv.release,
    //         minifyJS: argv.release,
    //         removeComments: argv.release,
    //         collapseWhitespace: argv.release,
    //         preserveLineBreaks: true
    //     }
    // })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        include: [ path.join(__dirname, 'src'), path.join(__dirname, 'lib') ],
        query: {
          presets: ['es2015', 'stage-0', 'react'],
          plugins: ['babel-plugin-transform-decorators-legacy'],
          env: {
            development: {
              presets: ['react-hmre']
            }
          }
        }
      }, {
        test: /\.(css|scss)$/,
        loaders: ['style', 'css', 'postcss', 'sass']
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: [
          // 'url?limit=10000&name=[path][name].[ext]',
          'url?name=[path][name].[ext]',
          'img?minimize&optimizationLevel=5&progressive=true'
        ]
      }, {
        test: /\.json$/,
        loaders: ['json']
      }
    ]
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
      'lib',
      'src'
    ],
    extensions: ['', '.js', '.jsx', '.css', '.scss', '.ts', '.tsx']
  },
  postcss: [ autoprefixer({ browsers: ['last 2 versions'] }) ]
};


if(argv.release) {
  module.exports.plugins.unshift(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings    : false,
        dead_code   : true,
        drop_console: true
      }
    }),
    new webpack.optimize.DedupePlugin()
  )
} else {
  module.exports.plugins.unshift(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
}

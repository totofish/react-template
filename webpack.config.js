"use strict"

const path                      = require("path")
const autoprefixer              = require("autoprefixer")
const webpack                   = require("webpack")
const ExtractTextPlugin         = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin         = require("html-webpack-plugin")
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
const fs                        = require("fs")

// 設定html上的base href
const base = '/'

module.exports = (env) => {
  try {
    env.production = env.production || false
  } catch(e) {
    env = { production: false }
  }
  process.env.NODE_ENV = env.production ? "production" : "development"

  let config = {
    entry: {
      // "base": ["./src/base.js"],
      // "page" : ["./src/page.js"],
      "commons": ["fetch-polyfill", "react", "redux-saga", "react-router"]
    },
    output: {
      // libraryTarget: "umd",
      path: path.join(__dirname, "dist"),
      filename: "scripts/[name].js",
      publicPath: "",
      chunkFilename: "scripts/[name].chunk.js"
      // chunkFilename: "[name].[hash].js"
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "commons",
        minChunks: Infinity,
        // chunks: ["index", "page"]
      }),
      new webpack.DefinePlugin({
        // 將 Environment Variables - 環境變數傳入
        "process.env.NODE_ENV": JSON.stringify(env.production ? "production" : "development")
      }),
      new ExtractTextPlugin({
        filename: "css/styles.css",
        allChunks: true,
        disable: false
      }),
      new webpack.LoaderOptionsPlugin({
        debug: env.production ? false : true,
        options: {
          context: __dirname,
          postcss: [
            autoprefixer({ browsers: ["last 2 versions"], remove: false })
          ],
          sassLoader: {
            includePaths: [path.resolve(__dirname, "./src/assets/sass")]
          }
        }
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "base"],
        filename: 'base.html',
        template: "./src/ejs/base.ejs",
        inject: "head",
        hash: true,
        minify: {
          minifyCSS: env.production,
          minifyJS: env.production,
          removeComments: env.production,
          collapseWhitespace: env.production,
          preserveLineBreaks: true
        },
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackPlugin({
        chunks: ["commons", "page"],
        filename: 'page.html',
        template: "./src/ejs/page.ejs",
        inject: "head",
        hash: true,
        minify: {
          minifyCSS: env.production,
          minifyJS: env.production,
          removeComments: env.production,
          collapseWhitespace: env.production,
          preserveLineBreaks: true
        },
        alwaysWriteToDisk: true,
        base: base
      }),
      new HtmlWebpackHarddiskPlugin(
        env.production ? null : { outputPath: path.resolve(__dirname, 'src/tmp') }
      )
    ],
    module: {
      rules: [
        { test: /\.ejs$/, loader: 'ejs-loader' },
        {
          test: /\.js$/,
          use: [
            {
              loader: "babel-loader",
              options: {
                presets: [["es2015", {"modules": false}], "stage-0", "react"],
                plugins: ["babel-plugin-transform-decorators-legacy", "react-hot-loader/babel"],
                env: {
                  development: {
                    presets: []
                  }
                }
              }
            }
          ],
          exclude: /(node_modules|bower_components)/,
          include: [ path.join(__dirname, "src"), path.join(__dirname, "lib") ]
        }, {
          test: /\.(css|scss)$/,
          use: ExtractTextPlugin.extract({
            fallback: "style-loader",
            use: [
              {
                loader: 'css-loader',
                options: { url: false, minimize: true }
              },
              "postcss-loader",
              "sass-loader",
            ],
            publicPath: "/dist/css"
          })
        }, {
          test: /\.(jpe?g|png|gif|svg)$/i,
          use: [
            {
              loader: "url-loader",
              options: {
                limit: 10000,
                name: "[path][name].[ext]",
                // context: "./src/assets",
              }
            }, {
              loader: "img-loader",
              options: {
                minimize: true,
                optimizationLevel: 5,
                progressive: true
              }
            }
          ]
        }, {
          test: /\.json$/,
          use: [
            "json-loader"
          ]
        }
      ]
    },
    resolve: {
      modules: [
        "node_modules",
        path.resolve(__dirname, "src"),
        path.resolve(__dirname, "lib")
      ],
      extensions: [".js", "json", ".jsx", ".css", ".scss", ".ts", ".tsx"]
    }
  }

  // 指定./src/*.js為Bundle Entry
  fs.readdirSync(__dirname + "/src").forEach(function (file) {
    if (fs.statSync(path.join(__dirname + "/src", file)).isFile()) {
      if(/.js$/.test(file)) {
        let fileName = file.replace(/.js$/, "")
        config.entry[`${fileName}`] = [`./src/${fileName}.js`]
      }
    }
  })


  if(env.production) {
    config.plugins.unshift(
      new webpack.optimize.UglifyJsPlugin({
        comments: false,
        compress: {
          warnings    : false,
          dead_code   : true,
          drop_console: true
        }
      })
    )
  } else {
    config.plugins.unshift(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      new webpack.NamedModulesPlugin()
    )
  }

  return config
}

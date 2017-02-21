"use strict"

const path              = require("path")
const autoprefixer      = require("autoprefixer")
const webpack           = require("webpack")
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const fs                = require("fs")


module.exports = (env) => {
  try {
    env.production = env.production || false
  } catch(e) {
    env = { production: false }
  }
  process.env.NODE_ENV = env.production ? "production" : "development"

  let config = {
    entry: {
      // "baseApp": ["./src/base.js"],
      // "pageApp" : ["./src/page.js"],
      "commons": ["react", "redux-saga", "react-router"]
    },
    output: {
      // libraryTarget: "umd",
      path: path.join(__dirname, "dist/scripts"),
      filename: "[name].js",
      publicPath: "/scripts/",
      chunkFilename: "[name].chunk.js"
      // chunkFilename: "[name].[hash].js"
    },
    plugins: [
      new webpack.optimize.CommonsChunkPlugin({
        name: "commons",
        // chunks: ["indexApp", "pageApp"]
      }),
      new webpack.DefinePlugin({
        // 將 Environment Variables - 環境變數傳入
        "process.env.NODE_ENV": JSON.stringify(env.production ? "production" : "development")
      }),
      new ExtractTextPlugin({
        filename: "[name].css",
        allChunks: true,
        disable: true
      }),
      new webpack.LoaderOptionsPlugin({
        debug: env.production ? false : true,
        options: {
          context: __dirname,
          postcss: [
            autoprefixer({ browsers: ["last 2 versions"] })
          ],
          sassLoader: {
            includePaths: [path.resolve(__dirname, "./src/assets/sass")]
          }
        }
      }),
      // new HtmlWebpackPlugin({
      //     release: env.production,
      //     chunks: ["baseApp"], // 指定對應到的entry為app
      //     filename: "base.html",
      //     template: "./src/template.html",
      //     inject: "body",
      //     hash: true,
      //     minify: {
      //         minifyCSS: env.production,
      //         minifyJS: env.production,
      //         removeComments: env.production,
      //         collapseWhitespace: env.production,
      //         preserveLineBreaks: true
      //     }
      // }),
      // new HtmlWebpackPlugin({
      //     release: env.production,
      //     chunks: ["pageApp"], // 指定對應到的entry為app
      //     filename: "page.html",
      //     template: "./src/template.html",
      //     inject: "body",
      //     hash: true,
      //     minify: {
      //         minifyCSS: env.production,
      //         minifyJS: env.production,
      //         removeComments: env.production,
      //         collapseWhitespace: env.production,
      //         preserveLineBreaks: true
      //     }
      // })
    ],
    module: {
      rules: [
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
              "css-loader",
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
                name: "[path][name].[ext]"
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
        config.entry[`${fileName}App`] = [`./src/${fileName}.js`]
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

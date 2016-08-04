'use strict';

var path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')(),
    webpack = require("webpack"),
    WebpackDevServer = require("webpack-dev-server"),
    opener = require("opener"),
    express = require('express'),
    port = 8080;
var argv = require('minimist')(process.argv.slice(2), { boolean:['release'] });
var webpackConfig = require("./webpack.config.js");
var onError = function(err) {
    console.log(err); // 詳細錯誤訊息
    $.notify().write(err); // 簡易錯誤訊息
    this.emit('end'); // 中斷程序不往下走
}

///////////////////////////////
// Default task
///////////////////////////////
gulp.task('default', ['clear'], () => {
  gulp.start(['copyImg', 'copyScript', 'copyHTML'], () => {
    console.info('webpack build...');
  });
});

gulp.task('clear', function(callback) {
  del(['dist']).then(paths => {
    callback();
  });
});

gulp.task('copyImg', function() {
  return gulp.src(['src/assets/image/**/*'])
             .pipe($.plumber({
               errorHandler: onError
             }))
             .pipe(gulp.dest('dist/image')) // imagemin 最佳化圖檔有些圖可能會複製不過去,所以先 clone 一份到 image 防止漏圖
             .pipe($.imagemin({
               optimizationLevel: 3,
               progressive: true,
               interlaced: true,
               multipass: true
             }))
             .pipe(gulp.dest('dist/image'));
});

gulp.task('copyScript', function() {
  return gulp.src(['src/assets/scripts/**/*'])
             .pipe($.plumber({
               errorHandler: onError
             }))
             .pipe($.uglify())
             .pipe(gulp.dest('dist/scripts'));
});

gulp.task('copyHTML', function() {
  return gulp.src(['src/*.html'])
             .pipe($.plumber({
               errorHandler: onError
             }))
             .pipe(gulp.dest('dist'));
});

///////////////////////////////
// webpack
///////////////////////////////

gulp.task("webpack-dev-server", function(callback) {
  // Start a webpack-dev-server
  var config = Object.create(webpackConfig);
  // Inline mode 比較好用
  for(var index in config.entry){
    config.entry[index].unshift(`webpack-dev-server/client?http://localhost:${port}/`, "webpack/hot/dev-server");
  }
  config.devtool = "eval";
  config.debug = true;
  var compiler = webpack(config);
  var server = new WebpackDevServer(compiler, {
    hot: true,
    stats: { colors: true },
    publicPath: config.output.publicPath,
    // historyApiFallback: false, // 想自定路由就不要設true
    contentBase: path.join(__dirname + '/src'),
    compress: true,  // use gzip compression
    watchOptions: {
      aggregateTimeout: 300,
      poll: 100
    },
    // staticOptions: {},
    quiet: false,
    noInfo: false,
    // headers: { "X-Custom-Header": "yes" }
  });

  // 設定對應 Router
  var router = express.Router();
  // router ’/' => index.html
  router.get('/home*', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/src/index.html'));
  });
  router.get('/page*', function (req, res, next) {
    res.sendFile(path.join(__dirname + '/src/page.html'));
  });
  router.use(express.static(__dirname + '/src/assets')); // 靜態檔案root目錄
  server.app.use(router);


  server.listen(port, "localhost", function(err) {
    if (err) throw new $.util.PluginError("webpack-dev-server", err);
    // Server listening
    $.util.log("[webpack-dev-server]", `http://localhost:${port}/webpack-dev-server/`);
    $.util.log("[webpack-dev-server]", `http://localhost:${port}/`);
    // callback();
    opener(`http://localhost:${port}/`);
  });

});

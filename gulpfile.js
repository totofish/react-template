'use strict';

let path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')(),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    opener = require('opener'),
    express = require('express'),
    portfinder = require('portfinder');
let argv = require('minimist')(process.argv.slice(2), { boolean:['release'] });
let webpackConfig = require('./webpack.config.js');
let onError = (err) => {
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

gulp.task('clear', (callback) => {
  del(['dist']).then(paths => {
    callback();
  });
});

gulp.task('copyImg', () => {
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

gulp.task('copyScript', () => {
  return gulp.src(['src/assets/scripts/**/*'])
             .pipe($.plumber({
               errorHandler: onError
             }))
             .pipe($.uglify())
             .pipe(gulp.dest('dist/scripts'));
});

gulp.task('copyHTML', () => {
  return gulp.src(['src/*.html'])
             .pipe($.plumber({
               errorHandler: onError
             }))
             .pipe(gulp.dest('dist'));
});

///////////////////////////////
// webpack
///////////////////////////////

// [設定對應 Router] -- router ’/' => index.html
let router = express.Router();
router.use(express.static(__dirname + '/src/assets')); // 靜態檔案root目錄
router.get('/home*', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/src/index.html'));
});
router.get('/page*', (req, res, next) => {
  res.sendFile(path.join(__dirname + '/src/page.html'));
});


gulp.task('webpack-dev-server', (callback) => {
  let Dashboard = require('webpack-dashboard');
  let DashboardPlugin = require('webpack-dashboard/plugin');
  let dashboard = new Dashboard();

  // 偵測可用的port
  portfinder.getPort( (err, port) => {

    let config = Object.create(webpackConfig);
    config.plugins.push(new DashboardPlugin(dashboard.setData));
    // Inline mode 比較好用
    for(let index in config.entry){
      config.entry[index].unshift(`webpack-dev-server/client?http://localhost:${port}/`, 'webpack/hot/dev-server');
    }
    config.devtool = 'eval';
    config.debug = true;
    let compiler = webpack(config);
    compiler.apply(new DashboardPlugin(dashboard.setData));
    let server = new WebpackDevServer(compiler, {
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
      quiet: true,
      noInfo: false,
      // headers: { 'X-Custom-Header': 'yes' }
    });

    server.app.use(router);

    // listen
    server.listen(port, '0.0.0.0', (err) => {
      if (err) throw new $.util.PluginError('webpack-dev-server', err);
      // Server listening
      $.util.log('[webpack-dev-server]', `http://localhost:${port}/webpack-dev-server/`);
      $.util.log('[webpack-dev-server]', `http://localhost:${port}/`);
      callback();
      opener(`http://localhost:${port}/`);
    });

  });
});

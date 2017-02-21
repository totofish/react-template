'use strict'

let path = require('path'),
    gulp = require('gulp'),
    del = require('del'),
    $ = require('gulp-load-plugins')(),
    webpack = require('webpack'),
    WebpackDevServer = require('webpack-dev-server'),
    opener = require('opener'),
    express = require('express'),
    portfinder = require('portfinder')
let webpackConfig = require('./webpack.config.js')
let onError = (err) => {
    console.log(err) // 詳細錯誤訊息
    $.notify().write(err) // 簡易錯誤訊息
    this.emit('end') // 中斷程序不往下走
}
//
///////////////////////////////
// Default task
///////////////////////////////
gulp.task('default', ['clear'], () => {
  gulp.start(['copyImg', 'copyScript', 'copyHTML'], () => {
    console.info('webpack build...')
  })
})

gulp.task('clear', (callback) => {
  del(['dist']).then(paths => {
    callback()
  })
})

gulp.task('copyImg', () => {
  return gulp.src(['src/assets/images/**/*'])
             .pipe($.plumber({
               errorHandler: onError
             }))
             .pipe(gulp.dest('dist/images')) // imagemin 最佳化圖檔有些圖可能會複製不過去,所以先 clone 一份到 image 防止漏圖
             .pipe($.imagemin({
               optimizationLevel: 3,
               progressive: true,
               interlaced: true,
               multipass: true
             }))
             .pipe(gulp.dest('dist/images'))
})

gulp.task('copyScript', () => {
  return gulp.src(['src/assets/scripts/**/*'])
             .pipe($.plumber({
               errorHandler: onError
             }))
             .pipe($.uglify())
             .pipe(gulp.dest('dist/scripts'))
})

gulp.task('copyHTML', () => {
  return gulp.src(['src/*.html'])
             .pipe($.plumber({
               errorHandler: onError
             }))
             .pipe(gulp.dest('dist'))
})

// 設定Appliction Cache manifest文件
gulp.task('manifest', function(){
  gulp.src(['dist/**/*'], { base: 'dist/' })
    .pipe($.manifest({
      hash: true,
      preferOnline: true,
      network: ['*'],
      filename: 'app.manifest',
      exclude: 'app.manifest'
     }))
    .pipe(gulp.dest('dist'))
})

///////////////////////////////
// webpack
///////////////////////////////
gulp.task('webpack-dev-server', (callback) => {
  let Dashboard = require('webpack-dashboard')
  let DashboardPlugin = require('webpack-dashboard/plugin')

  // 偵測可用的port
  portfinder.getPort( (err, port) => {
    let config = webpackConfig()
    config.plugins.push(new DashboardPlugin(new Dashboard().setData))
    // Inline mode 比較好用
    for(let index in config.entry){
      config.entry[index].unshift(
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://localhost:${port}/`,
        'webpack/hot/dev-server'
      )
    }
    config.devtool = 'eval'
    let compiler = webpack(config)
    let server = new WebpackDevServer(compiler, {
      hot: true,
      stats: { colors: true },
      publicPath: config.output.publicPath,
      setup: function(app) {
        // [設定對應 Router]
        app.use(require('./server.js'))
      },
      // historyApiFallback: {
      //   // [設定對應 Router],方法3
      //   rewrites: [
      //     { from: /^\/$/, to: '/index.html' },
      //     { from: /^\/base/, to: '/index.html' },
      //     { from: /^\/page/, to: '/page.html' },
      //     { from: /^\/./,
      //       to: function(context) {
      //         return '/assets' + context.parsedUrl.pathname
      //       }
      //     }
      //   ]
      // },
      // staticOptions: {},
      contentBase: path.join(__dirname + '/src'),
      compress: true,  // use gzip compression
      watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 1000
      },
      quiet: true,
      noInfo: false,
      // headers: { 'X-Custom-Header': 'yes' }
    })

    // [設定對應 Router],方法2
    // server.app.use(require('./server.js'))

    // listen
    server.listen(port, '0.0.0.0', (err) => {
      if (err) throw new $.util.PluginError('webpack-dev-server', err)
      // Server listening
      $.util.log('[webpack-dev-server]', `http://localhost:${port}/webpack-dev-server/`)
      $.util.log('[webpack-dev-server]', `http://localhost:${port}/`)
      callback()
      opener(`http://localhost:${port}/base`)
    })

  })
})

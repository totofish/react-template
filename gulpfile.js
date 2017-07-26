const path             = require('path');
const gulp             = require('gulp');
const del              = require('del');
const $                = require('gulp-load-plugins')();
const webpack          = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const opener           = require('opener');
const portfinder       = require('portfinder');
const webpackConfig    = require('./webpack.config.js');
const Dashboard        = require('webpack-dashboard');
const DashboardPlugin  = require('webpack-dashboard/plugin');
const router           = require('./server.js');

const onError = (err) => {
  console.log(err); // 詳細錯誤訊息
  $.notify().write(err); // 簡易錯誤訊息
  this.emit('end'); // 中斷程序不往下走
};

///////////////////////////////
// Default task
///////////////////////////////
gulp.task('default', ['clear'], () => {
  gulp.start(['copyImg', 'copyScript'], () => {
    console.info('webpack build...');
  });
});

gulp.task('clear', (callback) => {
  del(['dist']).then(() => {
    callback();
  });
});

gulp.task('copyImg', () =>
  gulp.src(['src/assets/images/**/*'])
      .pipe($.plumber({
        errorHandler: onError,
      }))
      .pipe(gulp.dest('dist/images')) // imagemin 最佳化圖檔有些圖可能會複製不過去,所以先 clone 一份到 image 防止漏圖
      .pipe($.imagemin({
        optimizationLevel: 3,
        progressive: true,
        interlaced: true,
        multipass: true,
      }))
      .pipe(gulp.dest('dist/images')),
);

gulp.task('copyScript', () =>
  gulp.src(['src/assets/scripts/**/*'])
      .pipe($.plumber({
        errorHandler: onError,
      }))
      .pipe($.uglify())
      .pipe(gulp.dest('dist/scripts')),
);

gulp.task('copyHTML', () =>
  gulp.src(['src/*.html'])
      .pipe($.plumber({
        errorHandler: onError,
      }))
      .pipe(gulp.dest('dist')),
);

// 設定Appliction Cache manifest文件
gulp.task('manifest', () =>
  gulp.src(['dist/**/*'], { base: 'dist/' })
    .pipe($.manifest({
      hash: true,
      preferOnline: true,
      network: ['*'],
      filename: 'app.manifest',
      exclude: 'app.manifest',
    }))
    .pipe(gulp.dest('dist')),
);

///////////////////////////////
// webpack
///////////////////////////////
gulp.task('webpack-dev-server', (callback) => {
  // 偵測可用的port
  portfinder.getPort((err, port) => {
    const config = webpackConfig();
    config.plugins.push(new DashboardPlugin(new Dashboard().setData));
    // Inline mode 比較好用
    Object.keys(config.entry).forEach((key) => {
      config.entry[key].unshift(
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://localhost:${port}/`,
        'webpack/hot/dev-server',
      );
    });
    config.devtool = 'eval';
    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, {
      hot: true,
      stats: { colors: true },
      publicPath: config.output.publicPath,
      // setup: function(app) {
      //   // [設定對應 Router]
      //   app.use(router)
      // },
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
      contentBase: path.join(__dirname, 'src'),
      compress: true,  // use gzip compression
      watchOptions: {
        aggregateTimeout: 300,
        ignored: /node_modules/,
        poll: 1000,
      },
      quiet: true,
      noInfo: false,
      // headers: { 'X-Custom-Header': 'yes' }
    });

    // [設定對應 Router],方法2 -- 推薦用這
    server.app.use(router);

    // listen
    server.listen(port, '0.0.0.0', (error) => {
      if (error) throw new $.util.PluginError('webpack-dev-server', error);
      // Server listening
      $.util.log('[webpack-dev-server]', `http://localhost:${port}/webpack-dev-server/`);
      $.util.log('[webpack-dev-server]', `http://localhost:${port}/`);
      callback();
      opener(`http://localhost:${port}/base`);
    });
  });
});

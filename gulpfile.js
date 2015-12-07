/*
 * Gulp plugins
 */
var gulp              = require('gulp');
var gutil             = require('gulp-util');
var path              = require('path');
var webpack           = require('webpack');
var HtmlPlugin        = require('html-webpack-plugin');
var OpenBrowserPlugin = require('open-browser-webpack-plugin');
var WebpackDevServer  = require('webpack-dev-server');

var param             = require('jquery-param');

var scssIncludePaths = {
  includePaths: [
    './node_modules/foundation-sites/scss/',
    './node_modules/bourbon/app/assets/stylesheets/',
    './node_modules/bourbon-neat/app/assets/stylesheets/',
  ]
};
var scssIncludeParams = decodeURIComponent(param(scssIncludePaths));

var webpackConfig = {
  context: path.resolve(__dirname, 'app'),
  entry: {
    app: ['./app.js'],
    head: ['./head.js'],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]-bundle.js',
  },

  plugins: [
    new HtmlPlugin({
      template: 'app/index.html',
      inject: false
    })
  ],

  resolve: {
    extensions: ['', '.js', '.jsx', '.scss'],
    modulesDirectories: ['app', 'web_modules', 'node_modules']
  },

  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loaders: ['react-hot', 'babel'],
        include: path.resolve(__dirname, 'app')
      },
      {
        test: /\.scss$/,
        loader: "style-loader!css-loader!sass-loader?outputStyle=expanded&" + scssIncludeParams,
        include: path.resolve(__dirname, 'app', 'styles')
      }
    ]
  }
};

var webpackPort = 3000;
gulp.task("webpack:dev", function(callback) {
  // modify some webpack config options
  var devConfig = Object.create(webpackConfig);
  devConfig.entry.head.unshift('webpack/hot/dev-server');
  devConfig.entry.app.unshift('webpack/hot/dev-server');
  devConfig.entry.app.unshift('webpack-dev-server/client?http://localhost:' + webpackPort);
  devConfig.devtool = "sourcemap";
  devConfig.debug = true;
  devConfig.plugins = devConfig.plugins.concat(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new OpenBrowserPlugin({ url: 'http://localhost:' + webpackPort + '/webpack-dev-server/bundle' })
  );

  // Start a webpack-dev-server
  new WebpackDevServer(webpack(devConfig), {
    historyApiFallback: true,
    hot: true,
    inline: true,
    progress: true,
    stats: {
      colors: true
    }
  }).listen(webpackPort, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
    gutil.log("[webpack-dev-server]", "http://localhost:"+webpackPort+"/webpack-dev-server/index.html");
  });
});

gulp.task("webpack:build", function(callback) {
  // modify some webpack config options
  var prodConfig = Object.create(webpackConfig);
  prodConfig.plugins = prodConfig.plugins.concat(
    new webpack.DefinePlugin({
      "process.env": {
        // This has effect on the react lib size
        "NODE_ENV": JSON.stringify("production")
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  );

  // run webpack
  webpack(prodConfig, function(err, stats) {
    if(err) throw new gutil.PluginError("webpack:build", err);
    gutil.log("[webpack:build]", stats.toString({
      colors: true
    }));
    callback();
  });
});

gulp.task('default', ['webpack:dev']);

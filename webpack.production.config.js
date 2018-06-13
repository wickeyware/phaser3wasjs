var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')

// Phaser webpack config
var phaserModule = path.join(__dirname, '/node_modules/phaser/')
var phaser = path.join(phaserModule, 'src/phaser.js')

var definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
  'typeof CANVAS_RENDERER': JSON.stringify(true),
  'typeof WEBGL_RENDERER': JSON.stringify(true)
})

module.exports = {
  entry: {
    app: [
      'babel-polyfill',
      path.resolve(__dirname, 'src/main.js')
    ],
    //vendor: ['pixi']

  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: 'js/bundle.js'
  },
  plugins: [
    definePlugin,
    new CleanWebpackPlugin(['dist']),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    /*new webpack.optimize.UglifyJsPlugin({
      drop_console: true,
      minimize: true,
      output: {
        comments: false
      }
    }),*/
    //new webpack.optimize.CommonsChunkPlugin({ name: 'vendor' /* chunkName= */, filename: 'js/vendor.bundle.js' /* filename= */ }),
    new HtmlWebpackPlugin({
      filename: 'index.html', // path.resolve(__dirname, 'dist', 'index.html'),
      template: './src/index.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      hash: true
    }),
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets' },
      { from: 'favicon.ico', to: 'favicon.ico'},
      { from: 'service-worker-registration.js', to: 'service-worker-registration.js'},
      { from: 'wickeyappstore', to: 'wickeyappstore'}
    ])
  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
      { test: /phaser-split\.js$/, use: 'raw-loader' },
      { test: [/\.vert$/, /\.frag$/], use: 'raw-loader' }
    ]
  },
  /*node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  resolve: {
    alias: {
      'phaser': phaser,

    }
  }*/
}

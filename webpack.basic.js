var vue = require('vue-loader');
var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin');
var minimist = require('minimist');

const argv = minimist(process.argv.slice(2))

const prod = argv.prod ? argv.prod : 'development'
const outputfn = prod === 'development' ? '[name].[hash:8].js' : '[name].[chunkhash:8].js'

module.exports = {

  externals: [{
    'jquery':'jQuery'
  }],

  entry: {
    main: [path.resolve('./src/main.js')],
    bootstrap: ['!bootstrap-webpack!./bootstrap.config.js']
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: outputfn
  },

  vue: {
    loaders: {
      // this will override vue-loader default setting
      js: prod==='development' ? 'babel?optional[]=runtime&loose=all' : 'strip-loader?strip[]=console.debug!babel?optional[]=runtime&loose=all',
      css: ExtractTextPlugin.extract('css'),
      stylus: ExtractTextPlugin.extract('css!stylus')
    }
  },

  module: {
    // 加载器
    loaders: [{
        test: /\.vue$/,
        loader: 'vue'
      },
      // 使用Babel转换ES6，排除node_modules目录下的js
      {
        test: /\.js$/,
        loader: prod==='development' ? 'babel?optional[]=runtime&loose=all' : 'strip-loader?strip[]=console.debug!babel?optional[]=runtime&loose=all',
        // exclude: /node_modules/
        include: /src|node_modules\/vue-strap/,
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /\.css$/,
        loader: 'style!css'
      }, {
        test: /\.(png|PNG|jpg|gif)$/,
        loader: 'url-loader'
      }, {
        test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/font-woff"
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&mimetype=application/octet-stream"
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader"
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        // loader: "url?limit=10000&mimetype=image/svg+xml"
        loader: "raw"
      }
    ]
  },

  resolve: {
    // require时省略的扩展名，如：require('module') 不需要module.js
    extensions: ['', '.js'],
    // 别名
    alias: {
      filter: path.join(__dirname, './src/filters'),
      components: path.join(__dirname, './src/components')
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: `"${prod}"`
      }
    }),
    new webpack.ProvidePlugin({
      jQuery: 'jquery',
      $: 'jquery'
    }),
    new ExtractTextPlugin('[name].[chunkhash:8].css', {
      allChunks: true
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      // minify: true,
      inject: 'body',
      chunks: ['main', 'bootstrap'],
    }),
    new webpack.optimize.OccurenceOrderPlugin()
  ]
}

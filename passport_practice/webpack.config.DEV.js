const webpack = require('webpack');
const path =  require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: './js/app.js',
    vendor: ['react', 'react-dom', 'whatwg-fetch', 'react-bootstrap', 'babel-polyfill', 'react-router',
             'react-router-bootstrap', 'react-router-dom', 'axios', 'react-redux', 'react-redux-form',
             'redux', 'redux-thunk'],
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: '[name].[hash].js'
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({names: ['vendor', 'manifest']}),
    new HtmlWebpackPlugin({
      template: './static/index.html'
    })
  ],
  devServer: {
    port: 8080,
    contentBase: 'static',
    proxy: {
      '/': {
        target: 'http://localhost:3000',
      },
    },
  },
  devtool: 'source-map',
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'resolve-url-loader', 'sass-loader'],
      },
      {
        test: /\.jpg$/,
        loader: 'file-loader'
      }
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss']
  }
};

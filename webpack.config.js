const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const config = {
  mode: 'development',
  entry: './demo/index.ts',
  output: {
    path: __dirname + '/dist',
    filename: 'js-ui.js',
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'demo/index.html'
    }),
  ],
  devServer: {
    contentBase: __dirname + '/dist',
    port: 3000,
    hot: true,
  }
};

if (process.env.NODE_ENV == 'production') {
  config.mode = 'production';
  config.devtool = false;
  config.plugins.push(new BundleAnalyzerPlugin());

  delete config.devServer;
}

module.exports = config;
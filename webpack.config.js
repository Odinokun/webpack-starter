const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Cleans the dist folder before each build
  },
  module: {
    rules: [
      {
        test: /\.pug$/,
        loader: 'pug-loader',
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, // Extracts CSS into a separate file
          {
            loader: 'css-loader', // Handles CSS imports
            options: {
              importLoaders: 2, // Handling imports with the following loaders
            },
          },
          'postcss-loader', // Adds autoprefixes
          'sass-loader', // Compiles SCSS to CSS
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.pug',
      filename: 'index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css', // Saves styles to a separate file
    }),
  ],
  optimization: {
    minimizer: [
      '...', // Keeps default JS minifiers
      new CssMinimizerPlugin(), // CSS Minimizer
    ],
  },
  devtool: 'source-map', // Generating source maps
  devServer: {
    static: './dist',
    open: true,
    port: 8080,
    hot: true, // Turn on HMR
    watchFiles: ['./src/**/*'], // Monitoring files
  },
};

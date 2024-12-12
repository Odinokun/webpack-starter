const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js', // Main file name
    path: path.resolve(__dirname, 'dist'), // Path for building the project
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
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/sprite-icons'), // Path to SVG icons
        use: [
          {
            loader: 'svg-sprite-loader',
            options: {
              extract: true, // Create a separate sprite file
              spriteFilename: 'img/sprite.svg', // Sprite's path + name
            },
          },
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
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/img'), // Path to images in src
          to: 'img', // Path to images in dist
          noErrorOnMissing: true, // Don't throw an error if the folder is empty
        },
      ],
    }),
    new ImageMinimizerPlugin({
      minimizer: {
        implementation: ImageMinimizerPlugin.imageminGenerate,
        options: {
          plugins: [
            ['mozjpeg', { quality: 90 }],
            ['optipng', { optimizationLevel: 5 }],
            ['svgo'],
          ],
        },
      },
      include: path.resolve(__dirname, 'src/img'), // Minimize images in the img folder
    }),
    new (require('svg-sprite-loader/plugin'))(), // Plugin for SVG sprite
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

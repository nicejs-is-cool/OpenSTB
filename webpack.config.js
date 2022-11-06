const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: './src/ts/index.ts',
  module: {
    rules: [
      /*{
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },*/
      {
        test: /\.s[ac]ss$/i,
        use: [
          /*{
            loader: 'file-loader',
            options: { outputPath: 'css/', name: '[name].css' }
          },*/
          "style-loader",
          "css-loader",
          "sass-loader"
        ]
      },
      {
        //test: /\.m?js$/,
        test: /\.tsx?$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: false,
            configFile: false,
            presets: ['@babel/preset-env', 'babel-preset-solid', '@babel/preset-typescript'],
            plugins: ['@babel/plugin-syntax-dynamic-import', '@babel/plugin-proposal-class-properties'/*, '@babel/proposal-object-rest-spread'*/],
            cacheDirectory: true,
          }
        }
      }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.sass', '.scss'],
    fallback: { events: require.resolve('events/') }
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    library: 'OpenSTB'
  },
  mode: 'development',
  optimization: {
    usedExports: true
  },
  plugins: [
    new webpack.ProgressPlugin(),
    //new HtmlWebpackPlugin()
  ]
};
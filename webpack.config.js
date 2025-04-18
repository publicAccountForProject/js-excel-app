const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const isProd = process.env.NODE_ENV === 'production'
const isDev = !isProd

const filename = ext => isDev ? `bundle.${ext}` : `bundle.[hash].${ext}`

const jsLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env']
      }
    }
  ]

  if (isDev) {
    loaders.push('eslint-loader')
  }

  return loaders
}

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: './index.js',
  output: {
    filename:  filename('js'),
    path: path.resolve(__dirname, 'dist')
  },
  resolve: {
      extensions: ['.js'],
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@core': path.resolve(__dirname, 'src/core')
      }
    },
  devtool: isDev ? 'source-map' : false,
  devServer: {
    port: 3000,
    hot: isDev
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        conservativeCollapse: isProd
      }
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/favicon.ico'),
          to: path.resolve(__dirname, 'dist')
        }
      ]
    }),
    
    new MiniCssExtractPlugin({
      filename:  filename('css')
    })
  ],
  module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              
            },
            'css-loader',
            'sass-loader'
          ],
        }
        ,
        {
          test: /\.(?:js|mjs|cjs)$/,
          exclude: /node_modules/,
          use:   jsLoaders() 
          /*{
            loader: 'babel-loader',
            options: {
              targets: "defaults",
              presets: [
                ['@babel/preset-env']
              ],
              plugins: [
                ['@babel/plugin-proposal-decorators', { version: "2023-11", decoratorsBeforeExport: true }]
              ]
            }
          }*/
        }
      ]
    }  
}

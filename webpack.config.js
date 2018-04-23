const webpack = require('webpack')
const path = require('path')

// ENTRY ------------------------------------------->

var entry = {
  bundle: path.join(__dirname, '/example/src/index')
}

// LOADERS ------------------------------------------->

var rules = [
  {
    test: /\.(js|jsx)$/,
    use: 'babel-loader',
    exclude: /node_modules/
  },
  {
    test: /\.(png|jpg|jpeg|gif|woff|woff2|eot)$/,
    use: [{
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: '[name]__[hash].[ext]'
      }
    }]
  }
]

var plugins = [
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  })
]

var config = {
  entry,
  plugins,
  target: 'web',
  module: { rules },
  output: {
    path: path.join(__dirname, '/example/compiled/'),
    publicPath: path.join(__dirname, '/example/compiled/'),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [
      'node_modules',
    ],
  },
  devServer: {
    contentBase: path.join(__dirname, '/example'),
    host: 'localhost',
    inline: true,
    info: false,
  }
}

module.exports = config

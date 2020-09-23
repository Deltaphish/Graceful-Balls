const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  devtool: 'inline-source-map',
  devServer: {

	contentBase: './dist',

  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [ new HtmlWebpackPlugin({
    title: 'Gracefull balls',
    template: 'src/index.html'
  })],

  module:{
	  rules:[
		  {
			  test: /\.css$/,
			  use: [
				  'style-loader',
				  'css-loader',
			  ]
      },
      {
        test: /\.html$/i,
        loader: 'html-loader',
      }
	  ]
  }
};
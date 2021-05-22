const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
   entry: {
      app: './src/index.js',
   },
   output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
   },
   plugins: [
      new HtmlWebpackPlugin({
         template: 'src/index.html',
      }),
   ],
   module: {
      rules: [
         {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
               loader: 'babel-loader',
               options: {
                  presets: ['@babel/preset-env'],
               },
            },
         },
         {
            test: /\.html$/i,
            loader: 'html-loader',
         },
         {
            test: /\.css$/i,
            use: ['style-loader', 'css-loader'],
         },
         {
            test: /\.(ogg|wav|mp3)$/,
            type: 'asset/resource',
         },
         {
            test: /\.(png|svg|jpg|gif)$/,
            type: 'asset/resource',
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            type: 'asset/resource',
         },
      ],
   },
};

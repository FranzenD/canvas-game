const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
   mode: 'development',
   devtool: 'inline-source-map',
   devServer: {
      host: 'localhost',
      hot: true,
      port: 3004,
   },
});

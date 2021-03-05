const path = require('path');

module.exports = {
  devServer: {
    port: 3000,
    https: false,
    hotOnly: false,
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', path.resolve(__dirname, './src'));
  },
};

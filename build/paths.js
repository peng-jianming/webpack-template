const path = require('path');
const appDir = process.cwd();

const resolve = (relativePath) => path.resolve(appDir, relativePath);

module.exports = {
  index: resolve('src/pages/main.js'),
  dist: resolve('dist'),
  template: resolve('template'),
  templateHtml: resolve('template/index.html'),
  templateHtmlConfig: resolve('template/page.js'),
  src: resolve('src'),
  productionPublicPath: '/'
};

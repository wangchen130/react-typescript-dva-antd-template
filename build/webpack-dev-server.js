const Express = require('express');
const webpack = require('webpack');
const openBrowser = require('react-dev-utils/openBrowser');
const { choosePort } = require('react-dev-utils/WebpackDevServerUtils');
const bodyParser = require('body-parser');
const proxy = require('http-proxy-middleware');
const wdm = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config.js');
const chalk = require('chalk');
const compiler = webpack(webpackConfig);

const host = 'localhost';
const port = 8080;
const devServerOptions = {
  quiet: true,
  noInfo: true,
  hot: true,
  hotOnly: false,
  inline: true,
  lazy: false,
  https: true,
  publicPath: webpackConfig.output.publicPath,
  overlay: { errors: true, warnings: true, },
  headers: { 'Access-Control-Allow-Origin': '*', },
  proxy: {
    // '/api': {
    //   target: 'https://wangchen.com',
    //   secure: false,
    //   changeOrigin: true,
    //   pathRewrite: {},
    // }
  },
  stats: 'minimal',
};

const app = new Express();

const mock = require('../mock');

for (const key in mock) {
  const [method, url] = key.split(' ');
  app[method](url, function (req, res, next) {
    res.send(mock[url]);
  });
}

if (devServerOptions.proxy) {
  Object.keys(devServerOptions.proxy).forEach((context) => {
    app.use(proxy(context, devServerOptions.proxy[context]));
  });
}

app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '5mb' }));

app.use(require('connect-history-api-fallback')());
// 使用前端路由
const wdmInstance = wdm(compiler, devServerOptions);
app.use(wdmInstance);
app.use(require('webpack-hot-middleware')(compiler));

module.exports = new Promise((resolve) => {
  choosePort(host, port)
    .then((newPort) => {
      if (port !== newPort) {
        console.log(`${port}端口被占用，开启新端口${newPort}`);
      }
      const server = app.listen(newPort, (err) => {
        if (err) {
          console.error(err);
        }
        wdmInstance.waitUntilValid(() => {
          const url = `http://${host}:${newPort}`;
          openBrowser(url);
          console.log(`${chalk.black.bgGreen('DONE')} Server running at ${url}`);
        });
      });
      resolve({
        port: newPort,
        close: () => {
          server.close();
        },
      });
    })
    .catch((error) => {
      console.log('没有找到空闲端口，请打开任务管理器杀死进程端口再试', error);
    });
});

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const apiPrefix = '/api';
const mock = {};

const mockDir = path.resolve(process.cwd(), 'mock');

fs.readdirSync(mockDir).forEach((filename) => {
  if (filename === 'index.js' || !/^\S+\.js/.test(filename)) return;
  const config = require(`./${filename}`);
  const method = config.method || 'get';
  const apiPath = `${apiPrefix}${config.url}`;
  const key = `${method} ${apiPath}`;

  console.log(`${chalk.blueBright('[MOCK]')} ${method.toUpperCase()} ${apiPath}: ${filename}`);

  Object.assign(mock, {
    [key]: {
      resultCode: '0',
      resultData: config.data,
      message: `get ${filename} success.`,
    },
  });
});

module.exports = mock;

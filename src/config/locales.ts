interface LocalesType {
  // App语言
  [key: string]: {
    // 对应加载的antd语言资源
    antdResource: string;
    // 对应设置的moment语言
    moment: string;
    // 对应加载的moment语言资源
    momentResource: string;
  };
}

// queryString保留key名
const qsName = 'locale';

// default
const defaultLocale = 'cn';

// 不在下列配置区域内的语言声明将被忽略
const locales: LocalesType = {
  ['cn']: {
    antdResource: 'zh_CN',
    moment: 'cn',
    momentResource: 'zh-cn',
  },
  ['en']: {
    antdResource: 'en_US',
    moment: 'en',
    momentResource: '', // moment默认已加载en
  },
};

export { qsName, defaultLocale, locales };

import modelExtend from 'dva-model-extend';
import { parse } from 'qs';
import moment from 'moment';
import { defaultLocale, locales as localesConfig, qsName } from 'src/config/locales';
import i18n from 'src/config/i18n';
import commonModel from './common';

interface ImportLocalePayload {
  intlLocaleName: string;
  antdResource: string;
  momentLocaleName: string;
  momentResource: string;
  locale: string;
}

export interface AppModelType {
  locale: string;
  intl: string;
  antd: any;
  locationPathname: string;
  locationQuery: {
    [key: string]: string;
  };
}

export default modelExtend(commonModel, {
  namespace: 'app',

  state: {
    // 注意: locale相关的语言设置初始值应在subscriptions中生成
    // App语言
    locale: '',
    // App字典
    messages: {},
    // antd使用的语言包
    antd: {},
    // location相关
    locationPathname: '',
    locationQuery: {},
  },

  subscriptions: {
    setupHistory({ dispatch, history }) {
      history.listen(({ pathname, search }) => {
        const query = parse(search.slice(1));

        dispatch({
          type: 'updateLocale',
          payload: { query },
        });
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: pathname,
            locationQuery: query,
          },
        });
      });
    },
  },

  effects: {
    // 语言重定向控制: 无语言参数|切换语言参数
    //   更新语言, 若没有显示切换, 自动使用已有语言缓存
    //   不在配置区域内的语言声明将被忽略, query参数将被自动补全
    *updateLocale({ payload }: { payload: { [key: string]: string } }, { put, select }) {
      const { query } = payload;
      const qsLocale = query && query[qsName];
      const oldLocale = yield select((state) => state.app.locale);
      const newLocale = qsLocale && localesConfig[qsLocale] ? qsLocale : '';
      if (!newLocale && oldLocale) {
        console.error('[框架] 发生语言参数丢失, 建议使用全局注入的history进行路由跳转');
      }

      if (newLocale !== oldLocale || !oldLocale) {
        const locale = newLocale || oldLocale || defaultLocale;
        const { antdResource, moment, momentResource } = localesConfig[locale];
        yield put({
          type: 'importLocale',
          payload: {
            antdResource,
            momentLocaleName: moment,
            momentResource,
            locale,
          },
        });
        i18n.changeLanguage(locale);
      }
    },

    // 加载语言包
    // 加载语言包
    *importLocale({ payload }: { payload: ImportLocalePayload }, { put }) {
      const { antdResource, momentLocaleName, momentResource, locale } = payload;
      const [messages, antd] = yield Promise.all([
        // 加载自身资源文件
        import(
          /* webpackChunkName: 'tbds-locales-[request]' */
          `src/locales/${locale}.json`
        ),
        // 加载 antd 资源文件
        import(
          /* webpackInclude: /(zh_CN|en_US)\.js$/ */
          /* webpackChunkName: 'antd-locales-[request]' */
          `antd/es/locale/${antdResource}.js`
        ),
        momentResource &&
          import(
            /* webpackInclude: /(zh-cn)\.js$/ */
            /* webpackChunkName: 'moment-locales-[request]' */
            `moment/locale/${momentResource}.js`
          ),
      ]);
      moment.locale(momentLocaleName);
      i18n.addResourceBundle(locale, 'translation', messages.default, true, true);
      yield put({
        type: 'updateState',
        payload: {
          antd: antd.default,
          locale,
          messages: messages.default,
        },
      });
    },
  },
});

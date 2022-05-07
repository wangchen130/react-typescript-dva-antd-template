import { message as Message } from 'antd';
import { extend } from 'umi-request';
import { RequestOptionsInit } from 'umi-request/types';
import fetchJsonp from 'fetch-jsonp';
import { stringify } from 'qs';
import nprogress from 'nprogress';
import apiConfig from 'src/config/api';

const { CORS } = apiConfig;

export interface FetchOptions extends RequestOptionsInit {
  method?: string;
  url: string;
  fetchType?: 'CORS' | 'JSONP';
  // 路径URL参数(:id)
  dynamicSegment?: { [key: string]: string | number };
  // 若路径URL带参数(:id)会自动执行处理, 设置true将取消路径参数的处理逻辑
  //   可能存在某些特殊url是本身就带:符号的(/api/:oauth/xxx)
  noDynamicSegment?: boolean;
}

export interface RequestOptions extends FetchOptions {
  // 不使用全局请求错误提示
  noGlobalError?: boolean;
}

const extendRequest = extend({
  timeout: 30 * 1000,
});

const fetch = (_options: FetchOptions | string) => {
  const options: FetchOptions = typeof _options === 'string' ? { url: _options } : _options;

  const { method = 'get', dynamicSegment, noDynamicSegment = false } = options;
  let { url, fetchType, params } = options;

  try {
    if (/^[a-zA-z]+:\/\/\S+/.test(url)) {
      // 处理https://
      const { origin } = new URL(url);
      if (window.location.origin !== origin) {
        if (CORS && CORS.indexOf(origin) > -1) {
          fetchType = 'CORS';
        } else {
          fetchType = 'JSONP';
        }
      }
    }
    if (!noDynamicSegment && dynamicSegment && url.indexOf(':') !== -1) {
      // 处理/:id URL路径
      url = url.replace(/:(\w+)/g, ($0, $1) => dynamicSegment[$1].toString());
    }
  } catch (err) {
    console.error('[REQUEST]', err);
  }

  if (fetchType === 'JSONP') {
    return new Promise((resolve, reject) => {
      fetchJsonp(`${url}?${stringify(params)}`)
        .then((res) => res.json())
        .then((result) => {
          resolve({ statusText: 'OK', status: 200, data: result });
        })
        .catch((error: Error) => {
          reject(error);
        });
    });
  }

  let config = { ...options };
  delete config.url;
  delete config.fetchType;

  return extendRequest(url, {
    method,
    ...config,
  });
};

export default function request(options: RequestOptions) {
  nprogress.start();

  return fetch(options)
    .then((response: any) => {
      const { code, msg: message, data } = response;

      if (code && code !== 0) {
        // 不需要全局错误提示
        if (options.noGlobalError) {
          return Promise.resolve({
            ...data,
          });
        }

        let msg;
        // 请求200, 但是请求错误的情况
        switch (code) {
          case '403':
            msg = '无权限';
            break;
          case '407':
            msg = '登录失效';
            // location.href = '';
            break;
          case '500':
            msg = '接口异常';
            break;
          default:
            msg = message;
        }
        return Promise.reject(new Error(msg));
      }

      return Promise.resolve(data);
    })
    .catch((error) => {
      const { response, message } = error;
      let msg = message;

      if (response && response instanceof Object) {
        // 请求失败的情况: 404, 500, ...
        const { status, statusText } = response;
        msg = `${status} ${statusText}`;
      }

      Message.error(msg);
      return Promise.reject(new Error(msg));
    })
    .finally(() => nprogress.done());
}

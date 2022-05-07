import apiConfig from 'src/config/api';
import request from './request';

// 若使用了动态路径参数, 例如'get/:id/cars',
//   可以使用config.dynamicSegment, 系统会自动获取对应值进行填充
//   config还内置了其他可配置的键, 见ConfigType
//
// 1. GET: data默认是queryString(data[, config])
// 2. POST, PUT等: data默认是reqBody(data[, config]);

const { api, apiPrefix } = apiConfig;

type ConfigType = Partial<{
  // 非GET时仍需使用queryString在此传入
  params: { [key: string]: string | number | boolean };
  // 动态路径参数, 仿路由设计
  dynamicSegment: { [key: string]: string | number };
  noGlobalError: boolean;
  fetchType: string;
}>;

type ArgsType = [any] | [any, ConfigType];

const gen = (params: string) => {
  let url = params.indexOf('http') === 0 ? params : apiPrefix + params;
  let method = 'get';

  const paramsArray = params.split(' ');
  if (paramsArray.length === 2) {
    [method] = [...paramsArray];
    url = apiPrefix + paramsArray[1];
  }

  const func = (...rest: ArgsType) => {
    const [data, config = {}] = [...rest];

    if (method === 'get') {
      config.params = data;
    } else {
      config.data = data;
    }

    return request({
      url,
      method,
      ...config,
    });
  };

  return {
    url,
    func,
  };
};

export const apiFunc: { [key: string]: (...rest: ArgsType) => any } = {};
export const apiUrls: { [key: string]: string } = {};

for (const key in api) {
  const { func, url } = gen(api[key]);
  apiFunc[key] = func;
  apiUrls[key] = url;
}

export default apiFunc;

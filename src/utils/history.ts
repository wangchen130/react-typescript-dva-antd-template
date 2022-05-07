import { createHashHistory } from 'history';
import { parse, stringify } from 'qs';
import { qsName, defaultLocale } from 'src/config/locales';

const history = createHashHistory();

// 自动添加语言参数
function handleLocaleQuery(path) {
  const oldQuery = parse(history.location.search.slice(1));
  if (typeof path === 'string') {
    const qsIndex = path.indexOf('?');
    const originPath = qsIndex !== -1 ? path.slice(0, qsIndex) : path;
    const newQuery = qsIndex !== -1 ? parse(path.slice(qsIndex + 1)) : {};
    return `${originPath}?${stringify({
      ...newQuery,
      [qsName]: newQuery[qsName] || oldQuery[qsName] || defaultLocale,
    })}`;
  }
  const newQuery = path.search ? parse(path.search.slice(1)) : {};
  return {
    ...path,
    search: `?${stringify({
      ...newQuery,
      [qsName]: newQuery[qsName] || oldQuery[qsName] || defaultLocale,
    })}`,
  };
}

const { push, replace } = history;

history.push = (path, state?) => {
  const newPath = handleLocaleQuery(path);
  return push(newPath, state);
};

history.replace = (path, state?) => {
  const newPath = handleLocaleQuery(path);
  return replace(newPath, state);
};

export { history };

# react-typescript-dva-antd-template

## 启动

```
npm run dev
```

## 项目结构

- components: 公共组件。

- pages: 页面，每一个页面使用的路由在 `src/config/routes` 中配置。

```
.
├── build 开发与打包配置
├── dist 打包输出目录
├── mock
├── src
│   ├── components
│   ├── config
│   │   ├── api 接口配置，模块化管理
│   │   └── ...
│   ├── containers
│   ├── models
│   ├── pages
│   ├── public
│   ├── themes
│   └── utils 工具库
```

## pre-commit 和 eslint

- 执行 commit 时，会触发 hooks，调用 eslint 检测
- 报错，请确保代码规范后再提交
- 出现大量规范错误，可以使用 npm run eslint:fix 进行修复

```
// 手动检测
npm run eslint

// 手动修复
npm run eslint:fix
```

## 使用 Css Modules

  ```js
  import styles from './index.scss?local';
  <MyComponent className={styles.className}>
    xxx
  </MyComponent>
  ```

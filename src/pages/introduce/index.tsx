import { Typography } from 'antd';
import React from 'react';

const { Title, Paragraph, Text } = Typography;

const dirTree = `
  .
  ├── build 打包与开发模式配置
  ├── dist 打包输出目录
  ├── mock
  ├── src
  │ ├── components
  │ ├── config
  │ │ ├── api 接口配置，模块化管理
  │ │ └── ...
  │ ├── models
  │ ├── pages
  │ ├── public
  │ ├── themes
  │ └── utils 工具库
  └── webpack 开发缓存相关，例如 webpack.dll
`;

const Comp: React.FC = () => (
  <Typography>
    <Title level={3}>介绍</Title>
    <Paragraph>
      项目使用
      <a target="_blank" href="https://reactjs.org/" rel="noopener noreferrer">
        react
      </a>
      ,
      <a target="_blank" href="https://www.typescriptlang.org/" rel="noopener noreferrer">
        typescript
      </a>
      ,
      <a target="_blank" href="https://ant.design/" rel="noopener noreferrer">
        antd
      </a>
      作为技术架构，更多文档请见 README, QUESTION, CHANGELOG。
    </Paragraph>

    <Title level={3}>快速新增一个页面</Title>
    <Paragraph>
      <ul>
        <li>
          在 <Text code>src/pages</Text> 中新建一个文件夹，例如mypage
        </li>
        <li>
          在 <Text code>src/config/routes</Text> 中定义路由，可指定组件，语言包，models等
        </li>
        <li>
          若需要关联菜单，在 <Text code>src/config/menu</Text> 中定义即可
        </li>
      </ul>
    </Paragraph>

    <Title level={3}>项目结构</Title>
    <Paragraph>
      <ul>
        <li>
          pages: 页面，每一个单独的页面可能包含入口 index, 样式 style.less, 语言包
          locales/等，每一个页面使用的路由在 <Text code>src/config/routes</Text> 中进行配置
        </li>
      </ul>

      <pre>{dirTree}</pre>
    </Paragraph>
  </Typography>
);

export default Comp;

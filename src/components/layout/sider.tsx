import React from 'react';
import { Layout } from 'antd';
import { menuTree } from 'src/config/menu';
import Menu from './menu';

interface SiderProps {
  pathname: string;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
}

const Sider: React.FC<SiderProps> = ({ pathname, prepend, append }) => {
  return (
    <Layout.Sider width={200}>
      {prepend}
      <Menu
        mode="inline"
        theme="dark"
        menuData={menuTree}
        pathname={pathname}
        defaultOpenKeys={menuTree.map((item) => item.id)}
      />
      {append}
    </Layout.Sider>
  );
};

export default Sider;

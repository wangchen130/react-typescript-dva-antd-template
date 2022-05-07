import { Layout } from 'antd';
import { Link } from 'dva/router';
import React from 'react';
import { ReactComponent as SvgComponent } from 'src/public/react.svg';
import { menuTree } from 'src/config/menu';
import Menu from './menu';
import styles from './index.less?local';

const Header = ({ pathname }) => {
  return (
    <Layout.Header className={styles.header}>
      <Link to="/" className={styles.logo}>
        <SvgComponent />
        <span style={{ padding: '0 10px' }}>react-typescript-dva-antd-template</span>
      </Link>
      <Menu
        mode="horizontal"
        theme="dark"
        maxDeep={1}
        menuData={menuTree}
        pathname={pathname}
        style={{ flex: 1 }}
      />

      <div>wangchen</div>
    </Layout.Header>
  );
};

export default Header;

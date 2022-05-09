import { Layout } from 'antd';
import { useLocation } from 'dva';
import React from 'react';
import { Helmet } from 'react-helmet';
import { Header, Sider } from 'src/components/layout';

const App: React.FC = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;

  const siderProps = {
    pathname,
  };

  return (
    <>
      <Helmet>
        <title>react-typescript-dva-antd-template</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="" type="image/x-icon" />
      </Helmet>

      <Layout style={{ height: '100%' }}>
        <Header pathname={pathname} />

        <Layout>
          <Sider {...siderProps} />
          <Layout>
            <Layout.Content style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ flex: '1' }}>{children}</div>
            </Layout.Content>
          </Layout>
        </Layout>
      </Layout>
    </>
  );
};

export default App;

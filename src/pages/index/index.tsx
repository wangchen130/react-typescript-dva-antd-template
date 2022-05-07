import React from 'react';
import { Button } from 'antd';
import './index.less';

const Index: React.FC = () => {
  return (
    <div>
      <div className="page">
        <div className="container">
          <div className="main">
            react-typescript-dva-antd-template
            <div>
              <Button type="primary" href="/#/introduce" style={{ marginRight: '20px' }}>
                进入项目介绍页面
              </Button>
            </div>
          </div>
          <div className="meta">
            <img src="/public/react.svg" alt="logo" />
          </div>
          <div className="ball" />
        </div>
      </div>
    </div>
  );
};

export default Index;

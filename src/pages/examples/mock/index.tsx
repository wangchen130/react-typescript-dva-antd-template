import { Alert, Collapse } from 'antd';
import React from 'react';

const basicUses = `
  module.exports = {
    url: '/user',
    data: {
      name: 'danielzli',
      id: '1',
      role: 'admin',
    },
  };
`;

const Comp = () => {
  const list = [
    {
      label: '基础用法',
      content: <pre>{basicUses}</pre>,
    },
  ];

  return (
    <>
      <Alert
        message="提供Mock功能，助于开发环境下的接口调试。"
        type="info"
        closable
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Collapse defaultActiveKey={[0]}>
        {list.map((item, index) => (
          <Collapse.Panel key={index} header={<div>{item.label}</div>}>
            {item.content}
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  );
};

export default Comp;

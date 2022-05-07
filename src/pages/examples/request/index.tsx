import { Alert, Button, Collapse, message } from 'antd';
import { connect } from 'dva';
import React from 'react';

interface PropsType {
  readonly dispatch: any;
}

const useRequestExample = `
  import { useRequest } from '@umijs/hooks';
  import { apiUrls } from 'src/utils/services';

  // 使用方法参考useRequest官方文档
  const { data, loading, run: getData } = useRequest(
    {
      url: apiUrls['global/getUserInfo'],
      // params: options,
    },
    {
      initialData: [],
    },
  );
`;

const useServicesExample = `
  import services from 'src/utils/services';

  const onDelete = async ({ id }) => {
    Modal.confirm({
      title: '确定删除吗?',
      onOk: async () => {
        await services['global/delUser'](null, {
          dynamicSegment: { id },
        });
        await getData();
        message.success('删除成功');
      },
    });
  };
`;

const Comp: React.FC<PropsType> = ({ dispatch }) => {
  const requestList = [
    {
      label: (
        <span>
          使用
          <Button
            type="link"
            href="https://hooks.umijs.org/zh-CN/hooks/async#%E6%89%A9%E5%B1%95%E7%94%A8%E6%B3%95"
            target="_blank"
            style={{ padding: 0 }}
          >
            useRequest
          </Button>
        </span>
      ),
      content: <pre>{useRequestExample}</pre>,
    },
    {
      label: '使用services',
      content: <pre>{useServicesExample}</pre>,
    },
    {
      label: '使用dva effect: GET',
      contents: [
        {
          label: 'GET',
          type: 'examples/get',
        },
        {
          label: 'GET带querystring',
          type: 'examples/get',
          payload: {
            id: 1,
          },
        },
        {
          label: 'GET带querystring与路径参数',
          type: 'examples/getWithDynamicSegment',
          payload: {
            keyword: 'keyword',
            id: 1,
          },
        },
      ],
    },
    {
      label: '使用dva effect: POST, PUT, DELETE, ...',
      contents: [
        {
          label: 'POST',
          type: 'examples/post',
          payload: {
            name: 'name',
            id: 1,
          },
        },
        {
          label: 'POST带requestBody, querystring, 路径参数, 并指定contentType',
          type: 'examples/postWithQuerystring',
          payload: {
            name: 'name',
            id: 1,
            params: {
              host: 'host.com',
            },
          },
        },
        {
          label: 'PUT',
          type: 'examples/put',
          payload: {
            id: 1,
          },
        },
        {
          label: 'DELETE',
          type: 'examples/delete',
        },
      ],
    },
  ];

  return (
    <>
      <Alert
        message="Request异步请求实例，在src/config/api中对请求URL进行模块化管理，在services与request的js文件中对umi-request进行二次封装，在umi-request原有提供的参数上，增加了路径参数(例如: /api/url/:id，其中id为路径参数)与一些其他控制参数(例如noGlobalError)，同时可以使用umi Hooks的useRequest，以下为一些常见的异步请求例子。dva effect的具体写法请参考代码，models/examples.ts"
        type="info"
        closable
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <Collapse defaultActiveKey={[0]}>
        {requestList.map((item, index) => (
          <Collapse.Panel key={index} header={<div>{item.label}</div>}>
            {(item.contents &&
              (item.contents as any).map((item, index) => (
                <Button
                  key={index}
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    const options = {
                      type: item.type,
                    } as any;
                    if (item.payload) {
                      options.payload = item.payload;
                    }
                    dispatch(options);
                    message.success(`成功发出dispatch请求${item.type}`);
                  }}
                >
                  {item.label}
                </Button>
              ))) ||
              item.content}
          </Collapse.Panel>
        ))}
      </Collapse>
    </>
  );
};

export default connect()(Comp);

import { Alert, Button, Calendar, Collapse, Pagination, Transfer, Typography, message } from 'antd';
import React from 'react';

const { Text } = Typography;

interface ExternalProps {
  history: any;
}

const basicUses = `
  import { FormattedMessage } from 'react-intl';

  const Comp: React.FC = () => {
    return (
      <div>
        <FormattedMessage id="title" />
      </div>
    );
  };

  export default Comp;
`;

const apiUses = `
  import { FormattedMessage, WrappedComponentProps, injectIntl } from 'react-intl';

  const Comp: React.FC<WrappedComponentProps> = ({ intl }) => {
    return (
      <div title={intl.formatMessage({ id: 'title' })}>
        <FormattedMessage id="title" />
      </div>
    );
  };

  export default injectIntl(Comp);
`;

const hookUses = `
  import { useIntl } from 'react-intl';

  const Comp: React.FC = () => {
    const intl = useIntl();

    return (
      <div>
        {intl.formatMessage({ id: 'title' })}
      </div>
    );
  };

  export default Comp;
`;

const Comp: React.FC<ExternalProps> = ({ history }) => {
  const toggleLocale = () => {
    const { location } = history;
    const localesMap = {
      ['cn']: 'en',
      ['en']: 'cn',
    };
    history.push({
      pathname: location.pathname,
      search: location.search.replace(/locale=([\w|-]+)/, ($0, $1) => `locale=${localesMap[$1]}`),
    });
    message.success('切换成功');
  };

  const list = [
    {
      label: '基础用法',
      content: <pre>{basicUses}</pre>,
    },
    {
      label: '使用 react-intl 的 API',
      content: <pre>{apiUses}</pre>,
    },
    {
      label: '使用 react-intl 的 hooks',
      content: <pre>{hookUses}</pre>,
    },
    {
      label: 'antd组件多语言测试',
      content: (
        <>
          <Pagination
            showSizeChanger
            defaultCurrent={3}
            total={20}
            style={{ marginBottom: '20px' }}
          />
          <Transfer dataSource={[]} showSearch targetKeys={[]} render={(item) => item.title} />
          <Calendar fullscreen={false} />
        </>
      ),
    },
  ];

  return (
    <>
      <Alert
        message={
          <>
            国际化实现实例，项目使用react-i18n辅助提供多语言解决方案。项目语言包统一在
            <Text code>src/locales</Text>进行管理。
          </>
        }
        type="info"
        closable
        showIcon
        style={{ marginBottom: '20px' }}
      />

      <div style={{ textAlign: 'right' }}>
        <Button type="link" onClick={toggleLocale}>
          一键切换中英文
        </Button>
      </div>

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

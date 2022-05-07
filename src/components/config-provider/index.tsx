import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { ConfigProvider } from 'antd';
import { useSelector } from 'dva';
import { AppModelType } from 'src/models/app';
import i18n from 'src/config/i18n';

// props 类型检查，对每一个输入参数都必须检查
export interface LocalProviderType {
  // 子内容
  children?: React.ReactNode;
}
const Provider = ({ children }: LocalProviderType): JSX.Element => {
  const app: AppModelType = useSelector((state: any) => state.app);
  const { antd } = app;

  return (
    <I18nextProvider i18n={i18n}>
      <ConfigProvider locale={antd} autoInsertSpaceInButton={false}>
        {children}
      </ConfigProvider>
    </I18nextProvider>
  );
};

export default Provider;

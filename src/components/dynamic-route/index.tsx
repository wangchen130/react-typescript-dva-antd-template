import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import dynamic from 'dva/dynamic';
import { AppModelType } from 'src/models/app';
import Wrapper from 'src/components/wrapper';

interface PropsType {
  app: AppModelType;
}

const DefaultLoadingComponent = () => null;

export default function asyncComponent(config) {
  const resolve = () => Promise.resolve(dynamic(config));

  const DynamicComponent: React.FC<PropsType> = ({ app, ...otherProps }) => {
    const [mounted, setMounted] = useState(false);
    const [AsyncComponent, setAsyncComponent] = useState(null);

    const load = async () => {
      const component = await resolve();
      setAsyncComponent(() => component);
    };

    useEffect(() => {
      setMounted(true);
      return () => setMounted(false);
    }, []);

    useEffect(() => {
      if (mounted) {
        load();
      }
    }, [mounted]);

    if (AsyncComponent) {
      return (
        <Wrapper>
          <AsyncComponent app={app} {...otherProps} />
        </Wrapper>
      );
    }

    return <DefaultLoadingComponent />;
  };

  return connect(({ app = {} }: any) => ({
    app,
  }))(DynamicComponent);
}

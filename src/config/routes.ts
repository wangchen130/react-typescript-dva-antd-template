import React from 'react';

export interface RouteItemType {
  // 路由路径
  path: string;
  // 组件
  component?: () => Promise<React.ReactNode>;
  // dva model
  models?: () => Promise<any>[];
  // 子路由
  childRoutes?: RouteItemType[];
}

const portalRoutes: RouteItemType[] = [
  {
    path: '/',
    component: () =>
      import(
        /* webpackChunkName: 'async-index' */
        'src/pages/index'
      ),
  },
];

const adminRoutes: RouteItemType[] = [
  {
    path: '/introduce',
    component: () => import('src/pages/introduce'),
  },
  {
    path: '/examples',
    childRoutes: [
      {
        path: '/request',
        component: () => import('src/pages/examples/request'),
        models: () => [import('src/models/examples')],
      },
      {
        path: '/mock',
        component: () => import('src/pages/examples/mock'),
      },
      {
        path: '/intl',
        component: () => import('src/pages/examples/intl'),
      },
    ],
  },
];

export { portalRoutes, adminRoutes };

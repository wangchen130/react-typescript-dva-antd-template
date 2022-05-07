import React from 'react';
import { HomeOutlined, BulbOutlined } from '@ant-design/icons';
import { treeToArray, arrayToTree } from '../utils';

export interface MenuItemType {
  // 名称
  name: string;
  // 唯一标识，与后端数据一致(部分后端不存在数据的模块例外，例如个人中心)
  id: string;
  // 图标
  icon?: string;
  // 孩子
  children?: MenuItemType[];
  // 路由
  route?: string;
}
const menuTreeOrigin = [
  {
    id: 'introduce',
    name: '介绍',
    icon: <HomeOutlined />,
    route: '/introduce',
  },
  {
    id: 'examples',
    name: '示例',
    icon: <BulbOutlined />,
    children: [
      {
        id: 'request',
        name: 'Request',
        route: '/examples/request',
      },
      {
        id: 'mock',
        name: 'Mock',
        route: '/examples/mock',
      },
      {
        id: 'intl',
        name: '国际化',
        route: '/examples/intl',
      },
    ],
  },
];

export const menu = treeToArray(menuTreeOrigin);
export const menuTree = arrayToTree(menu);

/**
 * description: 头像有三种尺寸，两种形状可选。
 */
import { UserOutline } from '@metaoa/icons';
import { Avatar, Space } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <Space direction="vertical" size={16}>
    <Space wrap size={16}>
      <Avatar size={64} icon={<UserOutline />} />
      <Avatar size="large" icon={<UserOutline />} />
      <Avatar icon={<UserOutline />} />
      <Avatar size="small" icon={<UserOutline />} />
    </Space>
    <Space wrap size={16}>
      <Avatar shape="square" size={64} icon={<UserOutline />} />
      <Avatar shape="square" size="large" icon={<UserOutline />} />
      <Avatar shape="square" icon={<UserOutline />} />
      <Avatar shape="square" size="small" icon={<UserOutline />} />
    </Space>
  </Space>
);

export default App;

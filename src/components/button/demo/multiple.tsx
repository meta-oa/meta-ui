import type { MenuProps } from '@meta/ui';
import { Button, Dropdown, Space } from '@meta/ui';
import React from 'react';

const onMenuClick: MenuProps['onClick'] = (e) => {
  console.log('click', e);
};

const items = [
  {
    key: '1',
    label: '1st item',
  },
  {
    key: '2',
    label: '2nd item',
  },
  {
    key: '3',
    label: '3rd item',
  },
];

const App: React.FC = () => (
  <Space direction="vertical">
    <Button type="primary">primary</Button>
    <Button>secondary</Button>
    <Dropdown.Button menu={{ items, onClick: onMenuClick }}>Actions</Dropdown.Button>
  </Space>
);

export default App;

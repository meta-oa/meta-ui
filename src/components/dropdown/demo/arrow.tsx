/**
 * description: 可以展示一个箭头。
 */
import type { MenuProps } from 'meta-ui';
import { Button, Dropdown, Space } from 'meta-ui';
import React from 'react';

const items: MenuProps['items'] = [
  {
    key: '1',
    label: '1st menu item',
  },
  {
    key: '2',
    label: '2nd menu item',
  },
  {
    key: '3',
    label: '3rd menu item',
  },
];

const App: React.FC = () => (
  <Space direction="vertical">
    <Space wrap>
    <Dropdown menu={{ items }} placement="bottomLeft" arrow>
      <Button>bottomLeft</Button>
    </Dropdown>
    <Dropdown menu={{ items }} placement="bottom" arrow>
      <Button>bottom</Button>
    </Dropdown>
    <Dropdown menu={{ items }} placement="bottomRight" arrow>
      <Button>bottomRight</Button>
    </Dropdown>
    </Space>
    <Space wrap>
    <Dropdown menu={{ items }} placement="topLeft" arrow>
      <Button>topLeft</Button>
    </Dropdown>
    <Dropdown menu={{ items }} placement="top" arrow>
      <Button>top</Button>
    </Dropdown>
    <Dropdown menu={{ items }} placement="topRight" arrow>
      <Button>topRight</Button>
    </Dropdown>
    </Space>
  </Space>
);

export default App;

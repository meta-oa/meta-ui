/**
 * description: 预设五种状态颜色，可以通过设置 `color` 为 `success`、 `processing`、`error`、`default`、`warning` 来代表不同的状态。
 */
import {
  ArrowPathOutline,
  CheckCircleOutline,
  ClockOutline,
  ExclamationCircleOutline,
  MinusCircleOutline,
  XCircleOutline,
} from '@metaoa/icons';
import { Divider, Space, Tag } from 'meta-ui';
import React from 'react';

const App: React.FC = () => (
  <>
    <Divider orientation="left">Without icon</Divider>
    <Space size={[0, 8]} wrap>
      <Tag color="success">success</Tag>
      <Tag color="processing">processing</Tag>
      <Tag color="error">error</Tag>
      <Tag color="warning">warning</Tag>
      <Tag color="default">default</Tag>
    </Space>
    <Divider orientation="left">With icon</Divider>
    <Space size={[0, 8]} wrap>
      <Tag icon={<CheckCircleOutline />} color="success">
        success
      </Tag>
      <Tag icon={<ArrowPathOutline className="animate-spin" />} color="processing">
        processing
      </Tag>
      <Tag icon={<XCircleOutline />} color="error">
        error
      </Tag>
      <Tag icon={<ExclamationCircleOutline />} color="warning">
        warning
      </Tag>
      <Tag icon={<ClockOutline />} color="default">
        waiting
      </Tag>
      <Tag icon={<MinusCircleOutline />} color="default">
        stop
      </Tag>
    </Space>
  </>
);

export default App;

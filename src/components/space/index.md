---
title: Space
subtitle: 间距
group:
  title: 布局
  order: 1
---

设置组件之间的间距。

## 何时使用

避免组件紧贴在一起，拉开统一的空间。

- 适合行内元素的水平间距。
- 可以设置各种水平对齐方式。
- 需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact（自 antd@4.24.0 版本开始提供该组件。）。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/align.tsx" description="设置对齐模式">对齐</code>

## API

### Space

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| align | 对齐方式 | `start` \| `end` \|`center` \|`baseline` | - | 4.2.0 |
| direction | 间距方向 | `vertical` \| `horizontal` | `horizontal` | 4.1.0 |
| size | 间距大小 | [Size](#Size) \| [Size\[\]](#Size) | `small` | 4.1.0 \| Array: 4.9.0 |
| split | 设置拆分 | ReactNode | - | 4.7.0 |
| wrap | 是否自动换行，仅在 `horizontal` 时有效 | boolean | false | 4.9.0 |

### Size

`'small' | 'middle' | 'large' | number`

### Space.Compact

> 自 antd@4.24.0 版本开始提供该组件。

需要表单组件之间紧凑连接且合并边框时，使用 Space.Compact。支持的组件有：

- Button
- AutoComplete
- Cascader
- DatePicker
- Input/Input.Search
- Select
- TimePicker
- TreeSelect

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| block | 将宽度调整为父元素宽度的选项 | boolean | false | 4.24.0 |
| direction | 指定排列方向 | `vertical` \| `horizontal` | `horizontal` | 4.24.0 |
| size | 子组件大小 | `large` \| `middle` \| `small` | `middle` | 4.24.0 |

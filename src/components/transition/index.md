---
title: Transition
order: 3
group:
  title: 其他
  order: 6
---

# Transition 过渡动画

> 基于 [HeadlessUI/Transition](https://headlessui.com/react/transition) 修改而来

允许您向有条件呈现的元素添加进入/离开过渡，使用 CSS 类来控制过渡不同阶段的实际过渡样式。

## 代码演示

<!-- prettier-ignore -->
<code src="./demo/basic.tsx" >显示隐藏</code>
<code src="./demo/multiple.tsx" >多个元素</code>

## API

### Transition

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| show | 子元素应该显示还是隐藏 | boolean | - |  |
| as | 要代替`Transition`本身呈现的元素或组件 | string \| Component | `div` |  |
| appear | 动画是否应在初始化时运行 | boolean | false |  |
| unmount | 根据显示状态是否应卸载或隐藏元素 | boolean | true | - |
| enter | `enter`阶段添加到元素`class`或`style` | string \| CSSProperties | - |  |
| enterFrom | `enter`阶段开始之前添加到元素`class`或`style` | string \| CSSProperties | - |  |
| enterTo | `enter`阶段开始后立即添加到元素`class`或`style` | string \| CSSProperties | - |  |
| entered | 动画完成后要添加到元素的`class`或`style` | string \| CSSProperties | - |  |
| leave | `leave`阶段添加到元素`class`或`style` | string \| CSSProperties | - |  |
| leaveFrom | `leave`阶段开始之前添加到元素`class`或`style` | string \| CSSProperties | - |  |
| leaveTo | `leave`阶段开始后立即添加到元素`class`或`style` | string \| CSSProperties | - |  |
| beforeEnter | 状态切换的回调 | () => void | - |  |
| beforeLeave | 状态切换的回调 | () => void | - |  |
| afterLeave | 状态切换的回调 | () => void | - |  |

### Transition.Child

| 参数 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| as | 要代替`Transition`本身呈现的元素或组件 | string \| Component | `div` |  |
| appear | 动画是否应在初始化时运行 | boolean | false |  |
| unmount | 根据显示状态是否应卸载或隐藏元素 | boolean | true | - |
| enter | `enter`阶段添加到元素`class`或`style` | string \| CSSProperties | - |  |
| enterFrom | `enter`阶段开始之前添加到元素`class`或`style` | string \| CSSProperties | - |  |
| enterTo | `enter`阶段开始后立即添加到元素`class`或`style` | string \| CSSProperties | - |  |
| entered | 动画完成后要添加到元素的`class`或`style` | string \| CSSProperties | - |  |
| leave | `leave`阶段添加到元素`class`或`style` | string \| CSSProperties | - |  |
| leaveFrom | `leave`阶段开始之前添加到元素`class`或`style` | string \| CSSProperties | - |  |
| leaveTo | `leave`阶段开始后立即添加到元素`class`或`style` | string \| CSSProperties | - |  |
| beforeEnter | 状态切换的回调 | () => void | - |  |
| beforeLeave | 状态切换的回调 | () => void | - |  |
| afterLeave | 状态切换的回调 | () => void | - |  |